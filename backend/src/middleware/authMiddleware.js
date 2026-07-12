import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    const authorizationHeader =
      req.headers.authorization;

    if (
      authorizationHeader &&
      authorizationHeader.startsWith(
        "Bearer "
      )
    ) {
      token =
        authorizationHeader.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message:
          "Invalid access token type",
      });
    }

    const user = await User.findById(
      decoded.id
    ).select("+passwordChangedAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.changedPasswordAfter(
        decoded.iat
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Password changed. Please login again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access token expired",
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Not authorized, token failed",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};