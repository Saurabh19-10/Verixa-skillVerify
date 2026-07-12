import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Certificate owner is required"],
      index: true,
    },

    assessmentResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentResult",
      required: [true, "Assessment result is required"],
      unique: true,
      index: true,
    },

    candidateName: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true,
      maxlength: [100, "Candidate name cannot exceed 100 characters"],
    },

    skill: {
      type: String,
      required: [true, "Certificate skill is required"],
      trim: true,
      maxlength: [100, "Skill cannot exceed 100 characters"],
      index: true,
    },

    score: {
      type: Number,
      required: [true, "Assessment score is required"],
      min: [0, "Score cannot be negative"],
    },

    totalQuestions: {
      type: Number,
      required: [true, "Total questions are required"],
      min: [1, "Total questions must be at least 1"],
      default: 15,
    },

    percentage: {
      type: Number,
      required: [true, "Percentage is required"],
      min: [0, "Percentage cannot be less than 0"],
      max: [100, "Percentage cannot be greater than 100"],
    },

    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    verificationUrl: {
      type: String,
      required: [true, "Verification URL is required"],
      trim: true,
    },

    qrCode: {
      type: String,
      required: [true, "QR code is required"],
    },

    pdfPath: {
      type: String,
      required: [true, "PDF path is required"],
      trim: true,
    },

    pdfFileName: {
      type: String,
      required: [true, "PDF file name is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "revoked"],
        message: "Certificate status must be active or revoked",
      },
      default: "active",
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    revokeReason: {
      type: String,
      trim: true,
      maxlength: [500, "Revoke reason cannot exceed 500 characters"],
      default: "",
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: [0, "Download count cannot be negative"],
    },

    lastDownloadedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      virtuals: true,

      transform(doc, ret) {
        delete ret.qrCode;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

// User certificates grouped by skill and date
certificateSchema.index({
  user: 1,
  skill: 1,
  issuedAt: -1,
});

// Public verification lookup
certificateSchema.index({
  certificateId: 1,
  status: 1,
});

// Recruiter certificate search
certificateSchema.index({
  skill: 1,
  percentage: -1,
  issuedAt: -1,
});

// Virtual validity field
certificateSchema.virtual("isValid").get(function () {
  return this.status === "active";
});

// Certificate download API path
certificateSchema.virtual("downloadUrl").get(function () {
  return `/api/certificates/${this.certificateId}/download`;
});

// Frontend public verification page path
certificateSchema.virtual("publicVerificationPath").get(function () {
  return `/verify-certificate/${this.certificateId}`;
});

// Normalize certificate data before validation
certificateSchema.pre("validate", function () {
  if (this.certificateId) {
    this.certificateId = this.certificateId
      .toString()
      .trim()
      .toUpperCase();
  }

  if (this.skill) {
    this.skill = this.skill.toString().trim();
  }

  if (this.candidateName) {
    this.candidateName = this.candidateName
      .toString()
      .trim();
  }
});

// Keep revoke fields consistent before saving
certificateSchema.pre("save", function () {
  if (this.status === "active") {
    this.revokedAt = null;
    this.revokedBy = null;
    this.revokeReason = "";
  }

  if (this.status === "revoked" && !this.revokedAt) {
    this.revokedAt = new Date();
  }
});

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;