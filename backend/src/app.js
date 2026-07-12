import compression from "compression";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import passport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import trustRoutes from "./routes/trustRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import skillAssessmentRoutes from "./routes/skillAssessmentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

import {
  apiLimiter,
} from "./middleware/rateLimiters.js";

const app = express();

// Render / reverse proxy support
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "../uploads");

// ================================
// Security Middleware
// ================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ================================
// Global API Rate Limiting
// ================================

app.use("/api", apiLimiter);

// ================================
// Response Compression
// ================================

app.use(
  compression({
    threshold: 1024,
  })
);

// ================================
// CORS
// ================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow curl, Postman, server-to-server and same-origin requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ================================
// Request Parsing
// ================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());

// ================================
// Static Files
// ================================

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ================================
// Health Routes
// ================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Verixa API is running",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend server is healthy",
    environment:
      process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ================================
// Development Request Logger
// ================================

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(
      "REQUEST:",
      req.method,
      req.originalUrl
    );

    if (
      req.body &&
      Object.keys(req.body).length > 0
    ) {
      console.log("BODY:", req.body);
    }

    next();
  });
}

// ================================
// API Routes
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use(
  "/api/verification",
  verificationRoutes
);
app.use("/api/ai", aiRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/trust", trustRoutes);
app.use("/api/github", githubRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/questions", questionRoutes);

app.use(
  "/api/skill-assessments",
  skillAssessmentRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ================================
// Global Error Handler
// ================================

app.use((error, req, res, next) => {
  console.error("Global error:", error);

  if (res.headersSent) {
    return next(error);
  }

  if (
    error.message?.startsWith(
      "CORS blocked for origin:"
    )
  ) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(
      error.errors
    ).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path}: ${error.value}`,
    });
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(
      error.keyValue || {}
    )[0];

    return res.status(409).json({
      success: false,
      message: duplicateField
        ? `${duplicateField} already exists`
        : "Duplicate value already exists",
    });
  }

  return res
    .status(error.statusCode || 500)
    .json({
      success: false,
      message:
        error.message ||
        "Internal server error",
      ...(process.env.NODE_ENV ===
        "development" && {
        stack: error.stack,
      }),
    });
});

export default app;