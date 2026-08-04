import { Router } from "express";
import { getDesignById, publishDesign, saveDesignCanvas } from "../controllers/designController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/:id", asyncHandler(getDesignById));
router.patch("/:id/canvas", asyncHandler(saveDesignCanvas));
router.post("/:id/publish", asyncHandler(publishDesign));

export default router;
