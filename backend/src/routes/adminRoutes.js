import express from "express";

import {
  getDashboardAnalytics,
  getAllUsers,
  deleteUser,
  getAllProjects,
  getAllAIReviews,
 
} from "../controllers/adminController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getDashboardAnalytics
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

router.get(
  "/projects",
  protect,
  authorize("admin"),
  getAllProjects
);


router.get(
  "/ai-reviews",
  protect,
  authorize("admin"),
  getAllAIReviews
);


export default router;