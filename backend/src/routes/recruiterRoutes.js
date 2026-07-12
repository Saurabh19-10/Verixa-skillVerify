import express from "express";

import {
  searchDevelopers,
  getDeveloperDetails,
  recruiterAnalytics,
  recruiterDashboard,
} from "../controllers/recruiterController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("recruiter"),
  recruiterDashboard
);

router.get(
  "/developers",
  protect,
  authorize("recruiter"),
  searchDevelopers
);

router.get(
  "/developers/:id",
  protect,
  authorize("recruiter"),
  getDeveloperDetails
);
router.get(
    "/analytics",
    protect,
    authorize("recruiter"),
    recruiterAnalytics
  );

export default router;