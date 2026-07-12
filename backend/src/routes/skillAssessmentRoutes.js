import express from "express";

import {
  getSkillAssessments,
  startSkillAssessment,
  submitSkillAssessment,
  getMySkillResults,
} from "../controllers/skillAssessmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSkillAssessments);

router.get("/my-results", protect, getMySkillResults);

router.post("/start", protect, startSkillAssessment);

router.post("/submit", protect, submitSkillAssessment);

export default router;