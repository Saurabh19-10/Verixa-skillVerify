import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tech: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    live: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ============================
    // Project Verification
    // ============================

    verificationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Rejected",
      ],
      default: "Pending",
    },

    verificationBreakdown: {
      githubRepository: {
        type: Number,
        default: 0,
      },

      liveDemo: {
        type: Number,
        default: 0,
      },

      readme: {
        type: Number,
        default: 0,
      },

      description: {
        type: Number,
        default: 0,
      },

      technologies: {
        type: Number,
        default: 0,
      },

      recentActivity: {
        type: Number,
        default: 0,
      },

      repositoryQuality: {
        type: Number,
        default: 0,
      },
    },

    verifiedAt: Date,

    lastVerifiedAt: Date,

    verificationMessage: {
      type: String,
      default: "",
    },

    githubAnalytics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    screenshots: [
      {
        type: String,
      },
    ],

    evidence: [
      {
        title: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Project",
  projectSchema
);