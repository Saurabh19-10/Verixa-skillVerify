import express from "express";

import {
  calculateMyTrustScore,
} from "../controllers/trustController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/calculate",
  protect,
  authorize("developer"),
  calculateMyTrustScore
);

export default router;