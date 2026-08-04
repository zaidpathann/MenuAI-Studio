import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler.js";
import { ClientAccess } from "../models/ClientAccess.js";
import { Design } from "../models/Design.js";
import { Project } from "../models/Project.js";
import { generateClientKey } from "../utils/generateClientKey.js";
export async function createAccessKey(req, res) {
    const { projectId, password, expiresAt } = req.body;
    if (!projectId) {
        throw new AppError(400, "VALIDATION_ERROR", "projectId is required");
    }
    const project = await Project.findOne({ _id: projectId, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    let accessKey = generateClientKey();
    while (await ClientAccess.exists({ accessKey })) {
        accessKey = generateClientKey();
    }
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const access = await ClientAccess.create({
        projectId: project._id,
        accessKey,
        passwordHash,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        createdBy: req.user?.id,
        isActive: true
    });
    res.status(201).json({
        accessKey: access.accessKey,
        access
    });
}
export async function listAccessKeys(req, res) {
    const projectId = typeof req.query.projectId === "string" ? req.query.projectId : "";
    if (!projectId) {
        throw new AppError(400, "VALIDATION_ERROR", "projectId is required");
    }
    const project = await Project.findOne({ _id: projectId, createdBy: req.user?.id });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Project not found");
    }
    const accessKeys = await ClientAccess.find({ projectId: project._id, isActive: true })
        .select("-passwordHash")
        .sort({ createdAt: -1 });
    res.json({ accessKeys });
}
export async function verifyAccessKey(req, res) {
    const { accessKey, password } = req.body;
    if (!accessKey) {
        throw new AppError(400, "VALIDATION_ERROR", "accessKey is required");
    }
    const access = await ClientAccess.findOne({ accessKey, isActive: true });
    if (!access) {
        throw new AppError(401, "INVALID_ACCESS_KEY", "Invalid access key");
    }
    if (access.expiresAt && access.expiresAt < new Date()) {
        throw new AppError(401, "ACCESS_EXPIRED", "Access key has expired");
    }
    if (access.passwordHash) {
        const validPassword = password ? await bcrypt.compare(password, access.passwordHash) : false;
        if (!validPassword) {
            throw new AppError(401, "INVALID_PASSWORD", "Invalid access password");
        }
    }
    const project = await Project.findOne({ _id: access.projectId, status: "published" });
    if (!project) {
        throw new AppError(404, "NOT_FOUND", "Published project not found");
    }
    const designs = await Design.find({ projectId: project._id, status: "published" }).sort({
        designIndex: 1
    });
    access.lastAccessedAt = new Date();
    await access.save();
    res.json({
        project: {
            id: project._id,
            name: project.name,
            restaurantName: project.restaurantName
        },
        designs
    });
}
