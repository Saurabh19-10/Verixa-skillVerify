import User from "../models/User.js";
import Project from "../models/Project.js";
import AIReview from "../models/AIReview.js";
import { calculateTrustScore } from "../utils/trustScoreCalculator.js";
import { createNotification } from "./notificationController.js";

export const calculateMyTrustScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const projects = await Project.find({
      owner: req.user._id,
    });

    const aiReview = await AIReview.findOne({
      user: req.user._id,
    }).sort({ updatedAt: -1 });

    const oldTrustScore = user.trustScore || 0;

    const trustScore = calculateTrustScore({
      user,
      projects,
      aiReview,
    });

    user.trustScore = trustScore;
    await user.save();

    if (oldTrustScore !== trustScore) {
      await createNotification({
        user: req.user._id,
        title: "Trust Score Updated",
        message: `Your trust score changed from ${oldTrustScore} to ${trustScore}.`,
        type: trustScore >= oldTrustScore ? "success" : "warning",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trust score calculated successfully",
      trustScore,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};