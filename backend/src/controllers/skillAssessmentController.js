import Question from "../models/Question.js";
import User from "../models/User.js";
import AssessmentResult from "../models/AssessmentResult.js";

import { createNotification } from "./notificationController.js";
import { calculateTrustScore } from "../services/trustScoreService.js";
import { generateCertificateForAssessment } from "./certificateController.js";

const TOTAL_QUESTIONS = 15;
const PASS_PERCENTAGE = 70;
const ASSESSMENT_DURATION_MINUTES = 30;

// =========================================
// Skill Helpers
// =========================================

const normalizeSkill = (skill = "") => {
  return skill
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "")
    .replace("javascript", "js")
    .replace("reactjs", "react")
    .replace("nodejs", "node")
    .replace("expressjs", "express")
    .replace("mongodb", "mongo");
};

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSkillRegex = (skill = "") => {
  const normalized = normalizeSkill(skill);

  const aliases = {
    react: ["React", "react", "ReactJS", "reactjs"],
    mongo: ["MongoDB", "mongoDb", "mongodb", "Mongo"],
    java: ["Java", "java"],
    js: ["JavaScript", "javascript", "JS", "js"],
    node: ["Node.js", "NodeJS", "nodejs", "node"],
    express: [
      "Express.js",
      "ExpressJS",
      "expressjs",
      "express",
    ],
    html: ["HTML", "html", "HTML5", "html5"],
    css: ["CSS", "css", "CSS3", "css3"],
    sql: ["SQL", "sql", "MySQL", "mysql"],
    python: ["Python", "python", "py"],
    git: ["Git", "git", "GitHub", "github"],
  };

  const values = aliases[normalized] || [skill];

  const pattern = values
    .map((value) => escapeRegex(value))
    .join("|");

  return new RegExp(`^(${pattern})$`, "i");
};

// =========================================
// Question Helpers
// =========================================

const getUniqueQuestionPipeline = (skill) => {
  return [
    {
      $match: {
        skill: getSkillRegex(skill),
        isActive: true,
        question: {
          $type: "string",
          $ne: "",
        },
      },
    },

    /*
     * Same question ko lowercase + trimmed text ke basis
     * par group karte hain.
     *
     * Isse same question alag _id ke saath database me
     * multiple times ho tab bhi assessment me once hi aayega.
     */
    {
      $group: {
        _id: {
          $toLower: {
            $trim: {
              input: "$question",
            },
          },
        },
        questionDocument: {
          $first: "$$ROOT",
        },
      },
    },

    {
      $replaceRoot: {
        newRoot: "$questionDocument",
      },
    },
  ];
};

const countUniqueQuestions = async (skill) => {
  const result = await Question.aggregate([
    ...getUniqueQuestionPipeline(skill),
    {
      $count: "total",
    },
  ]);

  return result[0]?.total || 0;
};

const hasDuplicateValues = (values = []) => {
  return new Set(values).size !== values.length;
};

// =========================================
// Available Tests
// =========================================

export const getSkillAssessments = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "skills"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userSkills = Array.isArray(user.skills)
      ? user.skills.filter(Boolean)
      : [];

    const availableTests = [];

    for (const skill of userSkills) {
      const uniqueQuestionCount =
        await countUniqueQuestions(skill);

      if (uniqueQuestionCount >= TOTAL_QUESTIONS) {
        availableTests.push({
          skill,
          totalQuestions: TOTAL_QUESTIONS,
          duration: ASSESSMENT_DURATION_MINUTES,
          passingPercentage: PASS_PERCENTAGE,
          availableQuestions: uniqueQuestionCount,
        });
      }
    }

    return res.status(200).json({
      success: true,
      tests: availableTests,
    });
  } catch (error) {
    console.error(
      "Get skill assessments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch skill assessments",
    });
  }
};

// =========================================
// Start Assessment
// =========================================

export const startSkillAssessment = async (req, res) => {
  try {
    const skill = req.body.skill?.toString().trim();

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required",
      });
    }

    const uniqueQuestionCount =
      await countUniqueQuestions(skill);

    if (uniqueQuestionCount < TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          `Only ${uniqueQuestionCount} unique questions are ` +
          `available for ${skill}. At least ` +
          `${TOTAL_QUESTIONS} unique questions are required.`,
      });
    }

    const questions = await Question.aggregate([
      ...getUniqueQuestionPipeline(skill),

      {
        $sample: {
          size: TOTAL_QUESTIONS,
        },
      },
    ]);

    if (questions.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          `Unable to generate ${TOTAL_QUESTIONS} unique ` +
          `questions for ${skill}.`,
      });
    }

    const safeQuestions = questions.map((question) => ({
      _id: question._id,
      question: question.question,
      options: question.options,
      difficulty: question.difficulty,
    }));

    return res.status(200).json({
      success: true,
      assessment: {
        skill,
        duration: ASSESSMENT_DURATION_MINUTES,
        totalQuestions: safeQuestions.length,
        passingPercentage: PASS_PERCENTAGE,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("Start assessment error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to start assessment",
    });
  }
};

// =========================================
// Submit Assessment
// =========================================

export const submitSkillAssessment = async (
  req,
  res
) => {
  try {
    const {
      skill,
      answers = [],
      warnings = 0,
      antiCheatEvents = [],
      timeTaken = 0,
    } = req.body;

    const normalizedInputSkill = skill
      ?.toString()
      .trim();

    if (!normalizedInputSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required",
      });
    }

    if (
      !Array.isArray(answers) ||
      answers.length !== TOTAL_QUESTIONS
    ) {
      return res.status(400).json({
        success: false,
        message:
          `You must submit exactly ` +
          `${TOTAL_QUESTIONS} answers`,
      });
    }

    const questionIds = answers
      .map((item) => item.questionId?.toString())
      .filter(Boolean);

    if (questionIds.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          "Every answer must contain a valid questionId",
      });
    }

    if (hasDuplicateValues(questionIds)) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate questions were detected in the submission",
      });
    }

    const questions = await Question.find({
      _id: {
        $in: questionIds,
      },
      skill: getSkillRegex(normalizedInputSkill),
      isActive: true,
    });

    if (questions.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          "Some questions are invalid, inactive, or do not belong to this skill",
      });
    }

    /*
     * Extra server-side safety:
     * Different IDs ke saath same question text submit nahi
     * hona chahiye.
     */
    const normalizedQuestionTexts = questions.map(
      (question) =>
        question.question
          .toString()
          .trim()
          .toLowerCase()
    );

    if (hasDuplicateValues(normalizedQuestionTexts)) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate question content was detected. Please start a new assessment.",
      });
    }

    const questionMap = new Map(
      questions.map((question) => [
        question._id.toString(),
        question,
      ])
    );

    let correctAnswers = 0;

    const evaluatedAnswers = answers.map((item) => {
      const question = questionMap.get(
        item.questionId?.toString()
      );

      if (!question) {
        return {
          questionId: item.questionId,
          question: item.question || "",
          selectedAnswer: item.selectedAnswer || "",
          correctAnswer: "",
          isCorrect: false,
          explanation: "",
        };
      }

      const selectedAnswer =
        item.selectedAnswer?.toString() || "";

      const isCorrect =
        question.correctAnswer === selectedAnswer;

      if (isCorrect) {
        correctAnswers += 1;
      }

      return {
        questionId: question._id,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || "",
      };
    });

    const percentage = Math.round(
      (correctAnswers / TOTAL_QUESTIONS) * 100
    );

    const passed =
      percentage >= PASS_PERCENTAGE;

    const previousAttempts =
      await AssessmentResult.countDocuments({
        user: req.user._id,
        skill: getSkillRegex(normalizedInputSkill),
      });

    const result = await AssessmentResult.create({
      user: req.user._id,
      skill: normalizedInputSkill,
      answers: evaluatedAnswers,
      score: correctAnswers,
      totalQuestions: TOTAL_QUESTIONS,
      percentage,
      passed,
      attemptNumber: previousAttempts + 1,
      warnings: Math.max(Number(warnings) || 0, 0),
      antiCheatEvents: Array.isArray(
        antiCheatEvents
      )
        ? antiCheatEvents
        : [],
      timeTaken: Math.max(Number(timeTaken) || 0, 0),
    });

    try {
      await calculateTrustScore(req.user._id);
    } catch (trustScoreError) {
      console.error(
        "Trust score calculation failed:",
        trustScoreError.message
      );
    }

    let certificate = null;

    if (passed) {
      try {
        certificate =
          await generateCertificateForAssessment({
            assessmentResultId: result._id,
            userId: req.user._id,
          });
      } catch (certificateError) {
        console.error(
          "Certificate generation failed:",
          certificateError.message
        );
      }
    }

    try {
      await createNotification({
        user: req.user._id,
        title: passed
          ? "Assessment Passed"
          : "Assessment Completed",
        message: passed
          ? `Congratulations! You passed the ${normalizedInputSkill} assessment with ${percentage}%.`
          : `${normalizedInputSkill} Assessment Score: ${percentage}%`,
        type: passed ? "success" : "warning",
      });
    } catch (notificationError) {
      console.error(
        "Notification creation failed:",
        notificationError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: passed
        ? certificate
          ? "Assessment passed and certificate generated successfully"
          : "Assessment passed, but certificate generation failed"
        : "Assessment submitted successfully",
      result,
      certificate,
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to submit assessment",
    });
  }
};

// =========================================
// My Results
// =========================================

export const getMySkillResults = async (
  req,
  res
) => {
  try {
    const results = await AssessmentResult.find({
      user: req.user._id,
    })
      .populate(
        "certificate",
        "certificateId skill percentage issuedAt status pdfPath verificationUrl"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Get results error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch assessment results",
    });
  }
};