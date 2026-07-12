import express from "express";

import {
  authLimiter,
} from "../middleware/rateLimiters.js";

import {
  register,
  login,
  getMe,
  logout,
  refreshAccessToken,
} from "../controllers/authController.js";

import {
  sendVerificationOTP,
  verifyEmailOTP,
  resendVerificationOTP,
} from "../controllers/emailVerificationController.js";

import {
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/passwordController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================================
// Basic Authentication
// =========================================

router.post(
  "/register",
  authLimiter,
  register
);

router.post(
  "/login",
  authLimiter,
  login
);

router.post(
  "/refresh-token",
  refreshAccessToken
);

router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/logout",
  protect,
  logout
);

// =========================================
// Email Verification
// =========================================

router.post(
  "/send-verification-otp",
  authLimiter,
  sendVerificationOTP
);

router.post(
  "/verify-email",
  authLimiter,
  verifyEmailOTP
);

router.post(
  "/resend-verification-otp",
  authLimiter,
  resendVerificationOTP
);

// =========================================
// Password Management
// =========================================

router.post(
  "/forgot-password",
  authLimiter,
  forgotPassword
);

router.put(
  "/reset-password/:token",
  authLimiter,
  resetPassword
);

router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;