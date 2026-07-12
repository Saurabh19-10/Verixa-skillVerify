import express from "express";

import {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  updateCertificateStatus,
} from "../controllers/certificateController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// Public route
// =====================================================

router.get("/verify/:certificateId", verifyCertificate);

// =====================================================
// Protected routes
// =====================================================

router.get(
  "/my-certificates",
  protect,
  getMyCertificates
);

router.post(
  "/generate/:assessmentResultId",
  protect,
  authorize("developer"),
  generateCertificate
);

router.get(
  "/:certificateId/download",
  protect,
  downloadCertificate
);

router.get(
  "/:certificateId",
  protect,
  getCertificateById
);

// =====================================================
// Admin route
// =====================================================

router.patch(
  "/:certificateId/status",
  protect,
  authorize("admin"),
  updateCertificateStatus
);

export default router;