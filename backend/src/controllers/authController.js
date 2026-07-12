import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import generateOTP from "../utils/generateOTP.js";

import {
  sendVerificationOTPEmail,
} from "../services/emailService.js";

const OTP_EXPIRY_MINUTES = 10;

const REFRESH_TOKEN_COOKIE = "verixa_refresh_token";

const REFRESH_TOKEN_EXPIRY =
  7 * 24 * 60 * 60 * 1000;

// =========================================
// Helper Functions
// =========================================

const normalizeEmail = (email = "") => {
  return email
    .toString()
    .trim()
    .toLowerCase();
};

const hashValue = (value = "") => {
  return crypto
    .createHash("sha256")
    .update(value.toString())
    .digest("hex");
};

const hashOTP = (otp = "") => {
  return hashValue(
    otp.toString().trim()
  );
};

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    bio: user.bio,
    skills: user.skills,
    github: user.github,
    githubUsername: user.githubUsername,
    portfolio: user.portfolio,
    avatar: user.avatar,
    trustScore: user.trustScore,
    githubScore: user.githubScore,
    isEmailVerified: user.isEmailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
  };
};

const getRefreshCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRY,
    path: "/api/auth",
  };
};

const clearRefreshCookie = (res) => {
  const cookieOptions =
    getRefreshCookieOptions();

  res.clearCookie(
    REFRESH_TOKEN_COOKIE,
    {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    }
  );
};

const createAuthenticationSession = async (
  user,
  res
) => {
  const accessToken =
    generateAccessToken(user._id);

  const refreshToken =
    generateRefreshToken(user._id);

  user.refreshToken =
    hashValue(refreshToken);

  user.refreshTokenExpires = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY
  );

  await user.save({
    validateBeforeSave: false,
  });

  res.cookie(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    getRefreshCookieOptions()
  );

  return accessToken;
};

const sendTokenResponse = async (
  user,
  statusCode,
  res
) => {
  const token =
    await createAuthenticationSession(
      user,
      res
    );

  return res.status(statusCode).json({
    success: true,
    token,
    user: getUserResponse(user),
  });
};

const prepareVerificationOTP = (user) => {
  const otp = generateOTP(6);

  user.emailVerificationOTP =
    hashOTP(otp);

  user.emailVerificationExpires =
    new Date(
      Date.now() +
        OTP_EXPIRY_MINUTES *
          60 *
          1000
    );

  user.emailVerificationLastSentAt =
    new Date();

  user.emailVerificationAttempts = 0;

  return otp;
};

// =========================================
// Register User
// POST /api/auth/register
// =========================================

export const register = async (req, res) => {
  let createdUser = null;

  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const normalizedName =
      name?.toString().trim();

    const normalizedEmail =
      normalizeEmail(email);

    if (
      !normalizedName ||
      !normalizedEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    const allowedRoles = [
      "developer",
      "recruiter",
    ];

    const selectedRole =
      allowedRoles.includes(role)
        ? role
        : "developer";

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      }).select(
        "+emailVerificationOTP " +
          "+emailVerificationExpires " +
          "+emailVerificationLastSentAt " +
          "+emailVerificationAttempts " +
          "+refreshToken " +
          "+refreshTokenExpires"
      );

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists",
        });
      }

      existingUser.name =
        normalizedName;

      existingUser.password = password;

      existingUser.role =
        selectedRole;

      existingUser.isEmailVerified =
        false;

      const otp =
        prepareVerificationOTP(
          existingUser
        );

      await existingUser.save();

      try {
        await sendVerificationOTPEmail({
          email: existingUser.email,
          name: existingUser.name,
          otp,
          expiresInMinutes:
            OTP_EXPIRY_MINUTES,
        });
      } catch (emailError) {
        console.error(
          "Existing user OTP email failed:",
          emailError.message
        );

        return res.status(503).json({
          success: false,
          message:
            "Verification email could not be sent. Please try again later.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Registration updated. A new verification OTP has been sent to your email.",
        requiresEmailVerification: true,
        email: existingUser.email,
        expiresInMinutes:
          OTP_EXPIRY_MINUTES,
        user:
          getUserResponse(existingUser),
      });
    }

    createdUser = new User({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: selectedRole,
      isEmailVerified: false,
    });

    const otp =
      prepareVerificationOTP(
        createdUser
      );

    await createdUser.save();

    try {
      await sendVerificationOTPEmail({
        email: createdUser.email,
        name: createdUser.name,
        otp,
        expiresInMinutes:
          OTP_EXPIRY_MINUTES,
      });
    } catch (emailError) {
      await User.findByIdAndDelete(
        createdUser._id
      );

      console.error(
        "Registration OTP email failed:",
        emailError.message
      );

      return res.status(503).json({
        success: false,
        message:
          "Account verification email could not be sent. Please check the email configuration and try registering again.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. A verification OTP has been sent to your email.",
      requiresEmailVerification: true,
      email: createdUser.email,
      expiresInMinutes:
        OTP_EXPIRY_MINUTES,
      user: getUserResponse(createdUser),
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    if (createdUser?._id) {
      try {
        await User.findByIdAndDelete(
          createdUser._id
        );
      } catch (cleanupError) {
        console.error(
          "Registration cleanup failed:",
          cleanupError.message
        );
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    if (
      error.name === "ValidationError"
    ) {
      const validationErrors =
        Object.values(
          error.errors
        ).map(
          (item) => item.message
        );

      return res.status(400).json({
        success: false,
        message:
          validationErrors[0],
        errors: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to register user",
      ...(process.env.NODE_ENV ===
        "development" && {
        error: error.message,
      }),
    });
  }
};

// =========================================
// Login
// POST /api/auth/login
// =========================================

export const login = async (req, res) => {
  try {
    const normalizedEmail =
      normalizeEmail(req.body.email);

    const { password } = req.body;

    if (
      !normalizedEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+password +refreshToken +refreshTokenExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in",
        requiresEmailVerification: true,
        email: user.email,
      });
    }

    return sendTokenResponse(
      user,
      200,
      res
    );
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to login",
      ...(process.env.NODE_ENV ===
        "development" && {
        error: error.message,
      }),
    });
  }
};

// =========================================
// Refresh Access Token
// POST /api/auth/refresh-token
// =========================================

export const refreshAccessToken = async (
  req,
  res
) => {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_TOKEN_COOKIE
      ];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Refresh token is missing",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Refresh token is invalid or expired",
      });
    }

    if (decoded.type !== "refresh") {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Invalid refresh token type",
      });
    }

    const user = await User.findById(
      decoded.id
    ).select(
      "+refreshToken " +
        "+refreshTokenExpires " +
        "+passwordChangedAt"
    );

    if (
      !user ||
      !user.refreshToken ||
      !user.refreshTokenExpires
    ) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Refresh session is invalid",
      });
    }

    if (
      user.refreshTokenExpires <
      new Date()
    ) {
      user.refreshToken = null;
      user.refreshTokenExpires = null;

      await user.save({
        validateBeforeSave: false,
      });

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Refresh session has expired",
      });
    }

    const incomingTokenHash =
      hashValue(refreshToken);

    const isValidToken =
      crypto.timingSafeEqual(
        Buffer.from(
          incomingTokenHash,
          "hex"
        ),
        Buffer.from(
          user.refreshToken,
          "hex"
        )
      );

    if (!isValidToken) {
      user.refreshToken = null;
      user.refreshTokenExpires = null;

      await user.save({
        validateBeforeSave: false,
      });

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Refresh token reuse detected",
      });
    }

    if (
      user.changedPasswordAfter(
        decoded.iat
      )
    ) {
      user.refreshToken = null;
      user.refreshTokenExpires = null;

      await user.save({
        validateBeforeSave: false,
      });

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Password changed. Please login again.",
      });
    }

    const token =
      await createAuthenticationSession(
        user,
        res
      );

    return res.status(200).json({
      success: true,
      message:
        "Access token refreshed successfully",
      token,
    });
  } catch (error) {
    console.error(
      "Refresh token error:",
      error
    );

    clearRefreshCookie(res);

    return res.status(500).json({
      success: false,
      message:
        "Unable to refresh authentication",
    });
  }
};

// =========================================
// Get Logged-in User
// GET /api/auth/me
// =========================================

export const getMe = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Get me error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch user profile",
    });
  }
};

// =========================================
// Logout
// POST /api/auth/logout
// =========================================

export const logout = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select(
      "+refreshToken +refreshTokenExpires"
    );

    if (user) {
      user.refreshToken = null;
      user.refreshTokenExpires = null;

      await user.save({
        validateBeforeSave: false,
      });
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    clearRefreshCookie(res);

    return res.status(500).json({
      success: false,
      message: "Unable to logout",
    });
  }
};