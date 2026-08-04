import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler.js";
import { Design } from "../models/Design.js";
import { Project } from "../models/Project.js";

export async function getDesignById(req: Request, res: Response) {
  const design = await Design.findById(req.params.id);

  if (!design) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  const project = await Project.findOne({ _id: design.projectId, createdBy: req.user?.id });

  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  res.json({ design });
}

export async function saveDesignCanvas(req: Request, res: Response) {
  const { canvasState } = req.body as { canvasState?: unknown };
  const design = await Design.findById(req.params.id);

  if (!design) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  const project = await Project.findOne({ _id: design.projectId, createdBy: req.user?.id });

  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  if (!canvasState) {
    throw new AppError(400, "VALIDATION_ERROR", "canvasState is required");
  }

  design.canvasState = canvasState;
  await design.save();

  res.json({ design });
}

export async function publishDesign(req: Request, res: Response) {
  const design = await Design.findById(req.params.id);

  if (!design) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  const project = await Project.findOne({ _id: design.projectId, createdBy: req.user?.id });

  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Design not found");
  }

  design.status = "published";
  project.status = "published";
  project.publishedAt = project.publishedAt || new Date();

  await Promise.all([design.save(), project.save()]);

  res.json({ design, project });
}
