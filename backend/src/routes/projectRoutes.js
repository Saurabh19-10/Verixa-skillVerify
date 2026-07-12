import express from "express";

import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("developer"), createProject)
  .get(protect, getMyProjects);

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, authorize("developer"), updateProject)
  .delete(protect, authorize("developer"), deleteProject);

export default router;
