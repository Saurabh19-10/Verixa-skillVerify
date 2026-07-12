import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    question: {
      type: String,
      trim: true,
      default: "",
    },

    selectedAnswer: {
      type: String,
      trim: true,
      default: "",
    },

    correctAnswer: {
      type: String,
      trim: true,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    explanation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const antiCheatEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const assessmentResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
      maxlength: [100, "Skill cannot exceed 100 characters"],
      index: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
      min: [0, "Score cannot be negative"],
    },

    totalQuestions: {
      type: Number,
      default: 15,
      min: [1, "Total questions must be at least 1"],
    },

    percentage: {
      type: Number,
      default: 0,
      min: [0, "Percentage cannot be less than 0"],
      max: [100, "Percentage cannot be greater than 100"],
    },

    passed: {
      type: Boolean,
      default: false,
      index: true,
    },

    attemptNumber: {
      type: Number,
      default: 1,
      min: [1, "Attempt number must be at least 1"],
    },

    timeTaken: {
      type: Number,
      default: 0,
      min: [0, "Time taken cannot be negative"],
    },

    warnings: {
      type: Number,
      default: 0,
      min: [0, "Warnings cannot be negative"],
    },

    antiCheatEvents: {
      type: [antiCheatEventSchema],
      default: [],
    },

    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
      index: true,
    },

    certificateId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Latest assessment results for a user
assessmentResultSchema.index({
  user: 1,
  createdAt: -1,
});

// Skill-wise assessment attempt history
assessmentResultSchema.index({
  user: 1,
  skill: 1,
  createdAt: -1,
});

// Passed assessment history
assessmentResultSchema.index({
  user: 1,
  passed: 1,
  createdAt: -1,
});

// Automatically calculate percentage before validation
assessmentResultSchema.pre("validate", function () {
  if (
    typeof this.score === "number" &&
    typeof this.totalQuestions === "number" &&
    this.totalQuestions > 0
  ) {
    this.percentage = Math.round(
      (this.score / this.totalQuestions) * 100
    );
  }
});

// Keep certificate ID normalized
assessmentResultSchema.pre("save", function () {
  if (!this.certificate) {
    this.certificateId = null;
  }

  if (this.certificateId) {
    this.certificateId = this.certificateId
      .toString()
      .trim()
      .toUpperCase();
  }
});

const AssessmentResult =
  mongoose.models.AssessmentResult ||
  mongoose.model("AssessmentResult", assessmentResultSchema);

export default AssessmentResult;