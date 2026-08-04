import { AppError } from "../middleware/errorHandler.js";
import { ClientAccess } from "../models/ClientAccess.js";
import { Design } from "../models/Design.js";
import { Project } from "../models/Project.js";
import { extractMenuFromPdf } from "../services/extraction/pdfExtraction.js";
import { generateDesignBatch60 as generateDesignBatch } from "../services/generation/generateDesigns.js";
export async function createProject(req, res) {
    const { name, restaurantName, manualEntry } = req.body;
    if (!name || !restaurantName) {
        throw new AppError(400, "VALIDATION_ERROR", "Project name and restaurant name are required");
    }
    const project = await Project.create({
        name,
        restaurantName,
        createdBy: req.user?.id,
        inputSource: manualEntry ? "manual" : undefined,
        extractedData: manualEntry || undefined
    });
    res.status(201).json({ project });
}
export async function getProjects(req, res) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 20), 50);
    const skip = (page - 1) * limit;
    const filter = { createdBy: req.user?.id };
    if (status) {
        filter.status = status;
    }
    const [projects, total] = await Promise.all([
        Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
        Project.countDocuments(filter)
    ]);
    res.json({ projects, pagination: { page, limit, total } });
}
export async function getProjectById(req, res) {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    const designs = await Design.find({ projectId: project._id }).sort({ designIndex: 1 });
    res.json({ project, designs });
}
export async function deleteProject(req, res) {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    // Cascade delete everything tied to this project — full cleanup from MongoDB
    await Promise.all([
        Design.deleteMany({ projectId: project._id }),
        ClientAccess.deleteMany({ projectId: project._id })
    ]);
    await Project.deleteOne({ _id: project._id });
    res.json({ success: true, deletedProjectId: project._id });
}
export async function uploadProjectPdf(req, res) {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    if (!req.file) {
        throw new AppError(400, "VALIDATION_ERROR", "A PDF file is required");
    }
    if (!req.file.buffer.subarray(0, 4).equals(Buffer.from("%PDF"))) {
        throw new AppError(400, "INVALID_UPLOAD", "Uploaded file is not a valid PDF");
    }
    project.inputSource = "pdf";
    project.set("uploadedFiles", [
        {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date()
        }
    ]);
    // Store base64 PDF so we can extract later without re-upload
    project.pdfContentBase64 = req.file.buffer.toString("base64");
    await project.save();
    res.json({
        projectId: project._id,
        uploadedFile: project.uploadedFiles.at(-1)
    });
}
export async function removeProjectPdf(req, res) {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    project.set("uploadedFiles", []);
    project.inputSource = undefined;
    project.pdfContentBase64 = undefined;
    await project.save();
    res.json({ project });
}
export async function extractProjectData(req, res) {
    // Must fetch with pdfContentBase64 (select: false by default)
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id }, "+pdfContentBase64");
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    const pdfBase64 = project.pdfContentBase64;
    // Use NVIDIA API key (set in .env)
    const nvidiaKey = process.env.NVIDIA_API_KEY?.replace(/^"|"$/g, ""); // strip quotes if any
    let extractedData;
    if (pdfBase64 && nvidiaKey) {
        try {
            // Real extraction from PDF using NVIDIA DeepSeek
            extractedData = await extractMenuFromPdf(pdfBase64, project.restaurantName, nvidiaKey);
        }
        catch (error) {
            console.error("[extractProjectData] AI extraction failed, using fallback data:", error);
            extractedData = buildFallbackData(project.restaurantName, project.uploadedFiles.at(-1)?.originalName, "AI extraction service is temporarily unavailable. Please retry extraction in a few minutes.");
        }
    }
    else {
        // Fallback: build minimal skeleton from project info only
        extractedData = buildFallbackData(project.restaurantName, project.uploadedFiles.at(-1)?.originalName, "Upload a PDF and ensure NVIDIA_API_KEY is set in .env to extract real menu items.");
    }
    project.extractedData = extractedData;
    await project.save();
    res.json({ projectId: project._id, extractedData });
}
function buildFallbackData(restaurantName, fileName, serviceNote) {
    const name = restaurantName ||
        (fileName ?? "Restaurant").replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
    const fallbackNote = serviceNote || "Upload a PDF and ensure NVIDIA_API_KEY is set in .env to extract real menu items.";
    return {
        restaurantName: name,
        logo: {
            text: name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)
                .toUpperCase(),
            placement: "top-left"
        },
        currency: "INR",
        brandColors: {
            primary: "#111827",
            secondary: "#C8A45D",
            accent: "#B8442F",
            paper: "#F7F1E8"
        },
        style: {
            mood: "classic restaurant",
            typography: "serif headings, clean body",
            spacing: "open"
        },
        businessDetails: { address: "", phone: "", website: "", serviceNote: fallbackNote },
        sections: [
            {
                name: "Menu",
                description: fallbackNote,
                items: [
                    {
                        name: "Retry extraction",
                        description: "When the AI provider recovers, click Extract again to pull real menu items from your PDF.",
                        price: 0
                    }
                ]
            }
        ]
    };
}
export async function generateProjectDesigns(req, res) {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    if (!project.extractedData) {
        throw new AppError(400, "MISSING_EXTRACTED_DATA", "Extract menu data before generating designs");
    }
    const existingCount = await Design.countDocuments({ projectId: project._id });
    if (existingCount >= 60) {
        throw new AppError(400, "GENERATION_LIMIT_REACHED", "Maximum 60 designs reached for this project");
    }
    const remaining = 60 - existingCount;
    const count = Math.min(10, remaining);
    const generatedDesigns = generateDesignBatch(project._id.toString(), project.extractedData, existingCount + 1, count);
    const designs = await Design.insertMany(generatedDesigns);
    const allDesigns = await Design.find({ projectId: project._id }).sort({ designIndex: 1 });
    res.status(201).json({
        projectId: project._id,
        count: designs.length,
        total: allDesigns.length,
        designs: allDesigns
    });
}
