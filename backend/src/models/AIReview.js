import mongoose from "mongoose";

const aiReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    projectScore: {
      type: Number,
      default: 0,
    },

    githubScore: {
      type: Number,
      default: 0,
    },

    codingScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    recruiterReadiness: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AIReview = mongoose.model("AIReview", aiReviewSchema);

export default AIReview;