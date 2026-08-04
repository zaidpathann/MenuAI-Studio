import { Router } from "express";
import { createAccessKey, listAccessKeys, verifyAccessKey } from "../controllers/accessController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/keys", requireAuth, asyncHandler(createAccessKey));
router.get("/keys", requireAuth, asyncHandler(listAccessKeys));
router.post("/verify", asyncHandler(verifyAccessKey));

export default router;
