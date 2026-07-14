import crypto from "crypto";

import User from "../models/User.js";

import {
  sendPasswordResetEmail,
} from "../services/emailService.js";

import generateToken from "../utils/generateToken.js";

// =========================================
// Helper Functions
// =========================================

const normalizeEmail = (email = "") => {
  return email
    .toString()
    .trim()
    .toLowerCase();
};

const buildAuthResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    bio: user.bio,
    skills: user.skills,
    github: user.github,
    linkedin: user.linkedin,
    githubUsername: user.githubUsername,
    portfolio: user.portfolio,
    avatar: user.avatar,
    trustScore: user.trustScore,
    isEmailVerified: user.isEmailVerified,
  };
};

const getFrontendUrl = () => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173";

  return frontendUrl.replace(/\/+$/, "");
};

// =========================================
// Forgot Password
// POST /api/auth/forgot-password
// =========================================

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email,
    }).select(
      "+passwordResetToken +passwordResetExpires"
    );

    /*
     * Security:
     * Account exists kare ya nahi, same response return
     * karenge to prevent email enumeration.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken =
      user.createPasswordResetToken();

    await user.save({
      validateBeforeSave: false,
    });

    console.log("PASSWORD_RESET_CREATED", {
      userId: user._id.toString(),
      tokenHashPrefix:
        user.passwordResetToken?.slice(0, 12),
      expiresAt: user.passwordResetExpires,
      serverTime: new Date(),
    });

    const frontendUrl = getFrontendUrl();

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
        expiresInMinutes: 15,
      });

      console.log("PASSWORD_RESET_EMAIL_SENT", {
        userId: user._id.toString(),
        email: user.email,
      });
    } catch (emailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      await user.save({
        validateBeforeSave: false,
      });

      console.error(
        "Password reset email failed:",
        emailError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Password reset email could not be sent. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =========================================
// Reset Password
// PUT /api/auth/reset-password/:token
// =========================================

export const resetPassword = async (req, res) => {
  try {
    const token = req.params?.token?.trim();

    const {
      password,
      confirmPassword,
    } = req.body || {};

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("PASSWORD_RESET_ATTEMPT", {
      tokenHashPrefix:
        hashedToken.slice(0, 12),
      serverTime: new Date(),
    });

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    }).select(
      [
        "+password",
        "+passwordResetToken",
        "+passwordResetExpires",
        "+passwordChangedAt",
        "+refreshToken",
        "+refreshTokenExpires",
      ].join(" ")
    );

    console.log(
      "PASSWORD_RESET_USER_FOUND",
      Boolean(user)
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset token is invalid or has expired",
      });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshToken = null;
    user.refreshTokenExpires = null;

    await user.save();

    const jwtToken = generateToken(user._id);

    console.log("PASSWORD_RESET_SUCCESS", {
      userId: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
      token: jwtToken,
      user: buildAuthResponse(user),
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =========================================
// Change Password
// PUT /api/auth/change-password
// Protected Route
// =========================================

export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body || {};

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password, new password and confirm password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    const user = await User.findById(
      req.user._id
    ).select(
      [
        "+password",
        "+passwordChangedAt",
        "+refreshToken",
        "+refreshTokenExpires",
      ].join(" ")
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isCurrentPasswordCorrect =
      await user.matchPassword(
        currentPassword
      );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshToken = null;
    user.refreshTokenExpires = null;

    await user.save();

    const jwtToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
      token: jwtToken,
      user: buildAuthResponse(user),
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};