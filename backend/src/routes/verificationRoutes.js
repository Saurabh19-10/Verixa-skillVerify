import express from "express";
import { verifyProject } from "../controllers/verificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/project/:projectId",
  protect,
  authorize("developer"),
  verifyProject
);

export default router;