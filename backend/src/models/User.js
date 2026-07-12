import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must contain at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["developer", "recruiter", "admin"],
      default: "developer",
      index: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },

    githubUsername: {
      type: String,
      trim: true,
      default: "",
    },

    githubScore: {
      type: Number,
      default: 0,
      min: [0, "GitHub score cannot be negative"],
    },
    githubAnalytics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: String,
      trim: true,
      default: "",
    },

    trustScore: {
      type: Number,
      default: 0,
      min: [0, "Trust score cannot be negative"],
    },

    // =========================================
    // Email Verification
    // =========================================

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    emailVerificationOTP: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
      default: null,
    },

    emailVerificationLastSentAt: {
      type: Date,
      select: false,
      default: null,
    },

    emailVerificationAttempts: {
      type: Number,
      select: false,
      default: 0,
      min: [0, "Verification attempts cannot be negative"],
    },

    // =========================================
    // Forgot / Reset Password
    // =========================================

    passwordResetToken: {
      type: String,
      select: false,
      default: null,
      index: true,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
      default: null,
    },

    // =========================================
    // Refresh Token
    // =========================================

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    refreshTokenExpires: {
      type: Date,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =========================================
// Password Hashing
// =========================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  if (!this.isNew) {
    this.passwordChangedAt = new Date(
      Date.now() - 1000
    );

    this.refreshToken = null;
    this.refreshTokenExpires = null;
  }
});

// =========================================
// Compare Password
// =========================================

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// =========================================
// Generate Password Reset Token
// =========================================

userSchema.methods.createPasswordResetToken =
  function () {
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    return resetToken;
  };

// =========================================
// Check Password Change Against JWT
// =========================================

userSchema.methods.changedPasswordAfter = function (
  jwtIssuedAt
) {
  if (!this.passwordChangedAt) {
    return false;
  }

  const passwordChangedTimestamp = Math.floor(
    this.passwordChangedAt.getTime() / 1000
  );

  return passwordChangedTimestamp > jwtIssuedAt;
};

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;