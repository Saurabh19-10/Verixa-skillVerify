import { rateLimit } from "express-rate-limit";

// =========================================
// Global API Rate Limiter
// =========================================

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

// =========================================
// Authentication Rate Limiter
// =========================================

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
});