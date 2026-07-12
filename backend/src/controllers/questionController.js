import XLSX from "xlsx";
import Question from "../models/Question.js";

const allowedDifficulties = ["Easy", "Medium", "Hard"];

const normalizeDifficulty = (difficulty = "Medium") => {
  const value = difficulty.toString().trim();

  if (!value) return "Medium";

  const formatted =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  return allowedDifficulties.includes(formatted)
    ? formatted
    : "Medium";
};

const validateQuestionPayload = (payload) => {
  const {
    skill,
    category,
    difficulty = "Medium",
    question,
    options,
    correctAnswer,
    explanation = "",
  } = payload;

  if (!skill || !category || !question || !options || !correctAnswer) {
    return {
      valid: false,
      message:
        "Skill, category, question, options and correctAnswer are required",
    };
  }

  if (!Array.isArray(options) || options.length !== 4) {
    return {
      valid: false,
      message: "Options must contain exactly 4 values",
    };
  }

  const cleanOptions = options.map((option) =>
    option.toString().trim()
  );

  if (cleanOptions.some((option) => !option)) {
    return {
      valid: false,
      message: "Options cannot be empty",
    };
  }

  const cleanCorrectAnswer = correctAnswer.toString().trim();

  if (!cleanOptions.includes(cleanCorrectAnswer)) {
    return {
      valid: false,
      message: "correctAnswer must exactly match one of the options",
    };
  }

  return {
    valid: true,
    data: {
      skill: skill.toString().trim(),
      category: category.toString().trim(),
      difficulty: normalizeDifficulty(difficulty),
      question: question.toString().trim(),
      options: cleanOptions,
      correctAnswer: cleanCorrectAnswer,
      explanation: explanation?.toString().trim() || "",
    },
  };
};

const mapRowToQuestion = (row) => {
  return {
    skill: row.skill || row.Skill,
    category: row.category || row.Category,
    difficulty: row.difficulty || row.Difficulty || "Medium",
    question: row.question || row.Question,
    options: [
      row.option1 || row.Option1 || row["Option 1"],
      row.option2 || row.Option2 || row["Option 2"],
      row.option3 || row.Option3 || row["Option 3"],
      row.option4 || row.Option4 || row["Option 4"],
    ],
    correctAnswer:
      row.correctAnswer ||
      row.CorrectAnswer ||
      row["Correct Answer"] ||
      row.answer ||
      row.Answer,
    explanation:
      row.explanation || row.Explanation || "",
  };
};

export const createQuestion = async (req, res) => {
  try {
    const validation = validateQuestionPayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const newQuestion = await Question.create({
      ...validation.data,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const importQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV or Excel file",
      });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file has no sheets",
      });
    }

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file is empty",
      });
    }

    const validQuestions = [];
    const invalidRows = [];

    rows.forEach((row, index) => {
      const mapped = mapRowToQuestion(row);
      const validation = validateQuestionPayload(mapped);

      if (validation.valid) {
        validQuestions.push({
          ...validation.data,
          createdBy: req.user._id,
        });
      } else {
        invalidRows.push({
          row: index + 2,
          reason: validation.message,
          data: row,
        });
      }
    });

    if (validQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid questions found in file",
        invalidRows,
      });
    }

    const inserted = await Question.insertMany(validQuestions, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      message: "Questions imported successfully",
      totalRows: rows.length,
      insertedCount: inserted.length,
      invalidCount: invalidRows.length,
      invalidRows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { skill, difficulty, search } = req.query;

    const query = {};

    if (skill) query.skill = new RegExp(skill, "i");
    if (difficulty) query.difficulty = difficulty;

    if (search) {
      query.question = new RegExp(search, "i");
    }

    const questions = await Question.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const questionDoc = await Question.findById(req.params.id);

    if (!questionDoc) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const payload = {
      skill:
        req.body.skill !== undefined
          ? req.body.skill
          : questionDoc.skill,
      category:
        req.body.category !== undefined
          ? req.body.category
          : questionDoc.category,
      difficulty:
        req.body.difficulty !== undefined
          ? req.body.difficulty
          : questionDoc.difficulty,
      question:
        req.body.question !== undefined
          ? req.body.question
          : questionDoc.question,
      options:
        req.body.options !== undefined
          ? req.body.options
          : questionDoc.options,
      correctAnswer:
        req.body.correctAnswer !== undefined
          ? req.body.correctAnswer
          : questionDoc.correctAnswer,
      explanation:
        req.body.explanation !== undefined
          ? req.body.explanation
          : questionDoc.explanation,
    };

    const validation = validateQuestionPayload(payload);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    questionDoc.skill = validation.data.skill;
    questionDoc.category = validation.data.category;
    questionDoc.difficulty = validation.data.difficulty;
    questionDoc.question = validation.data.question;
    questionDoc.options = validation.data.options;
    questionDoc.correctAnswer = validation.data.correctAnswer;
    questionDoc.explanation = validation.data.explanation;

    if (req.body.isActive !== undefined) {
      questionDoc.isActive = req.body.isActive;
    }

    const updatedQuestion = await questionDoc.save();

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestionStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();

    const activeQuestions = await Question.countDocuments({
      isActive: true,
    });

    const bySkill = await Question.aggregate([
      {
        $group: {
          _id: "$skill",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const byDifficulty = await Question.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalQuestions,
        activeQuestions,
        inactiveQuestions: totalQuestions - activeQuestions,
        bySkill,
        byDifficulty,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};