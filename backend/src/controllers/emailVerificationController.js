import crypto from "crypto";

import User from "../models/User.js";
import generateOTP from "../utils/generateOTP.js";

import {
  sendVerificationOTPEmail,
} from "../services/emailService.js";

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_VERIFICATION_ATTEMPTS = 5;

const normalizeEmail = (email = "") => {
  return email.toString().trim().toLowerCase();
};

const hashOTP = (otp = "") => {
  return crypto
    .createHash("sha256")
    .update(otp.toString().trim())
    .digest("hex");
};

const getGenericSuccessResponse = (res) => {
  return res.status(200).json({
    success: true,
    message:
      "If an eligible account exists, a verification OTP has been sent.",
  });
};

// =====================================================
// SEND VERIFICATION OTP
// POST /api/auth/send-verification-otp
// =====================================================

export const sendVerificationOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select(
      [
        "+emailVerificationOTP",
        "+emailVerificationExpires",
        "+emailVerificationLastSentAt",
        "+emailVerificationAttempts",
      ].join(" ")
    );

    if (!user) {
      return getGenericSuccessResponse(res);
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (user.emailVerificationLastSentAt) {
      const lastSentTime = new Date(
        user.emailVerificationLastSentAt
      ).getTime();

      const elapsedMilliseconds =
        Date.now() - lastSentTime;

      const cooldownMilliseconds =
        OTP_RESEND_COOLDOWN_SECONDS * 1000;

      if (elapsedMilliseconds < cooldownMilliseconds) {
        const remainingSeconds = Math.ceil(
          (cooldownMilliseconds -
            elapsedMilliseconds) /
            1000
        );

        return res.status(429).json({
          success: false,
          message:
            `Please wait ${remainingSeconds} seconds ` +
            "before requesting another OTP",
          retryAfter: remainingSeconds,
        });
      }
    }

    const otp = generateOTP(6);

    user.emailVerificationOTP = hashOTP(otp);
    user.emailVerificationExpires = new Date(
      Date.now() +
        OTP_EXPIRY_MINUTES * 60 * 1000
    );
    user.emailVerificationLastSentAt =
      new Date();
    user.emailVerificationAttempts = 0;

    await user.save({
      validateBeforeSave: false,
    });

    try {
      console.log(
        "========== VERIFICATION EMAIL =========="
      );
      console.log("Sending OTP email to:", user.email);
      console.log(
        "OTP expires in:",
        `${OTP_EXPIRY_MINUTES} minutes`
      );

      const emailResult =
        await sendVerificationOTPEmail({
          email: user.email,
          name: user.name,
          otp,
          expiresInMinutes:
            OTP_EXPIRY_MINUTES,
        });

      console.log(
        "Verification email message ID:",
        emailResult?.messageId
      );
      console.log(
        "Verification email accepted:",
        emailResult?.accepted
      );
      console.log(
        "Verification email rejected:",
        emailResult?.rejected
      );
      console.log(
        "========================================"
      );

      const acceptedRecipients =
        Array.isArray(emailResult?.accepted)
          ? emailResult.accepted
          : [];

      if (acceptedRecipients.length === 0) {
        throw new Error(
          "SMTP server did not accept the recipient email"
        );
      }
    } catch (emailError) {
      user.emailVerificationOTP = null;
      user.emailVerificationExpires = null;
      user.emailVerificationLastSentAt =
        null;
      user.emailVerificationAttempts = 0;

      await user.save({
        validateBeforeSave: false,
      });

      console.error(
        "Verification OTP email failed:",
        emailError
      );

      return res.status(500).json({
        success: false,
        message:
          "Verification email could not be sent. Please try again later.",
        ...(process.env.NODE_ENV ===
          "development" && {
          error: emailError.message,
        }),
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Verification OTP sent successfully",
      expiresInMinutes:
        OTP_EXPIRY_MINUTES,
      resendAfterSeconds:
        OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    console.error(
      "Send verification OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send verification OTP",
      ...(process.env.NODE_ENV ===
        "development" && {
        error: error.message,
      }),
    });
  }
};

// =====================================================
// VERIFY EMAIL OTP
// POST /api/auth/verify-email
// =====================================================

export const verifyEmailOTP = async (
  req,
  res
) => {
  try {
    const email = normalizeEmail(
      req.body.email
    );

    const otp = req.body.otp
      ?.toString()
      .trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message:
          "OTP must contain exactly 6 digits",
      });
    }

    const user = await User.findOne({
      email,
    }).select(
      [
        "+emailVerificationOTP",
        "+emailVerificationExpires",
        "+emailVerificationAttempts",
      ].join(" ")
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message:
          "Email is already verified",
      });
    }

    if (
      !user.emailVerificationOTP ||
      !user.emailVerificationExpires
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No verification OTP found. Please request a new OTP.",
      });
    }

    const expiresAt = new Date(
      user.emailVerificationExpires
    ).getTime();

    if (
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now()
    ) {
      user.emailVerificationOTP = null;
      user.emailVerificationExpires = null;
      user.emailVerificationLastSentAt =
        null;
      user.emailVerificationAttempts = 0;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new verification OTP.",
      });
    }

    const attempts = Number(
      user.emailVerificationAttempts || 0
    );

    if (
      attempts >=
      MAX_VERIFICATION_ATTEMPTS
    ) {
      user.emailVerificationOTP = null;
      user.emailVerificationExpires = null;
      user.emailVerificationLastSentAt =
        null;
      user.emailVerificationAttempts = 0;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many invalid attempts. Please request a new OTP.",
      });
    }

    const submittedOTPHash =
      hashOTP(otp);

    const storedOTPBuffer =
      Buffer.from(
        user.emailVerificationOTP,
        "hex"
      );

    const submittedOTPBuffer =
      Buffer.from(
        submittedOTPHash,
        "hex"
      );

    const isOTPValid =
      storedOTPBuffer.length ===
        submittedOTPBuffer.length &&
      crypto.timingSafeEqual(
        storedOTPBuffer,
        submittedOTPBuffer
      );

    if (!isOTPValid) {
      user.emailVerificationAttempts =
        attempts + 1;

      await user.save({
        validateBeforeSave: false,
      });

      const remainingAttempts =
        MAX_VERIFICATION_ATTEMPTS -
        user.emailVerificationAttempts;

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        remainingAttempts: Math.max(
          remainingAttempts,
          0
        ),
      });
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();

    user.emailVerificationOTP = null;
    user.emailVerificationExpires = null;
    user.emailVerificationLastSentAt =
      null;
    user.emailVerificationAttempts = 0;

    await user.save({
      validateBeforeSave: false,
    });

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
          user.isEmailVerified,
        emailVerifiedAt:
          user.emailVerifiedAt,
      },
    });
  } catch (error) {
    console.error(
      "Verify email OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify email",
      ...(process.env.NODE_ENV ===
        "development" && {
        error: error.message,
      }),
    });
  }
};

// =====================================================
// RESEND VERIFICATION OTP
// POST /api/auth/resend-verification-otp
// =====================================================

export const resendVerificationOTP = async (
  req,
  res
) => {
  return sendVerificationOTP(req, res);
};