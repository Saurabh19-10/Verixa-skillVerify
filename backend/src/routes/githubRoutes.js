import express from "express";

import {
  verifyGithub,
  getGithubProfileData,
  refreshGithub,
} from "../controllers/githubController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GitHub Verification Routes
|--------------------------------------------------------------------------
|
| Base URL:
| /api/github
|
| All routes are protected.
| Only developer accounts can link and refresh GitHub data.
|
*/

// POST /api/github/verify
router.post(
  "/verify",
  protect,
  authorize("developer"),
  verifyGithub
);

// GET /api/github/profile
router.get(
  "/profile",
  protect,
  authorize("developer"),
  getGithubProfileData
);

// POST /api/github/refresh
router.post(
  "/refresh",
  protect,
  authorize("developer"),
  refreshGithub
);

export default router;