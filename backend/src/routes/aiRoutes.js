import express from "express";

import {
  generateAIReview,
  getAIReview,
} from "../controllers/aiController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/review",
  protect,
  authorize("developer"),
  generateAIReview
);

router.get(
  "/review",
  protect,
  authorize("developer"),
  getAIReview
);

export default router;