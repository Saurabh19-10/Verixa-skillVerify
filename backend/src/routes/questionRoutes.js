import express from "express";

import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionStats,
  importQuestions,
} from "../controllers/questionController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getQuestionStats);

router.post(
  "/import",
  protect,
  authorize("admin"),
  upload.single("file"),
  importQuestions
);

router.get("/", protect, authorize("admin"), getQuestions);
router.get("/:id", protect, authorize("admin"), getQuestionById);
router.post("/", protect, authorize("admin"), createQuestion);
router.put("/:id", protect, authorize("admin"), updateQuestion);
router.delete("/:id", protect, authorize("admin"), deleteQuestion);

export default router;