import { Router } from "express";
import {
  createProject,
  deleteProject,
  extractProjectData,
  generateProjectDesigns,
  getProjectById,
  getProjects,
  removeProjectPdf,
  uploadProjectPdf
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadPdf } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getProjects));
router.post("/", asyncHandler(createProject));
router.get("/:id", asyncHandler(getProjectById));
router.delete("/:id", asyncHandler(deleteProject));
router.post("/:id/upload", uploadPdf.single("file"), asyncHandler(uploadProjectPdf));
router.delete("/:id/upload", asyncHandler(removeProjectPdf));
router.post("/:id/extract", asyncHandler(extractProjectData));
router.post("/:id/generate", asyncHandler(generateProjectDesigns));

export default router;
