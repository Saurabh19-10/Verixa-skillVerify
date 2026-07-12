import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const normalizeEmail = (email = "") => {
  return email.toString().trim().toLowerCase();
};

const seedAdmin = async () => {
  try {
    await connectDB();

    const name =
      process.env.ADMIN_NAME?.trim() || "Verixa Admin";

    const email = normalizeEmail(
      process.env.ADMIN_EMAIL
    );

    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in backend/.env"
      );
    }

    if (password.length < 8) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 8 characters"
      );
    }

    const existingUser = await User.findOne({
      email,
    }).select(
      "+password +emailVerificationOTP +emailVerificationExpires"
    );

    if (existingUser) {
      existingUser.name = name;
      existingUser.role = "admin";
      existingUser.isEmailVerified = true;
      existingUser.emailVerifiedAt =
        existingUser.emailVerifiedAt || new Date();

      existingUser.emailVerificationOTP = null;
      existingUser.emailVerificationExpires = null;
      existingUser.emailVerificationLastSentAt = null;
      existingUser.emailVerificationAttempts = 0;

      if (
        process.env.ADMIN_RESET_PASSWORD === "true"
      ) {
        existingUser.password = password;
      }

      await existingUser.save();

      console.log("Admin account updated successfully");
      console.log(`Admin email: ${existingUser.email}`);

      if (
        process.env.ADMIN_RESET_PASSWORD !== "true"
      ) {
        console.log(
          "Existing password was preserved. Set ADMIN_RESET_PASSWORD=true to replace it."
        );
      }

      process.exit(0);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    console.log("Admin account created successfully");
    console.log(`Admin email: ${admin.email}`);

    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();