import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import Question from "../models/Question.js";
import { generateAllQuestions } from "../services/questionGenerator.js";

const normalizeQuestionText = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const getUniqueQuestions = (questions = []) => {
  const uniqueQuestions = [];
  const seen = new Set();

  for (const question of questions) {
    const skill = question.skill
      ?.toString()
      .trim()
      .toLowerCase();

    const questionText = normalizeQuestionText(
      question.question
    );

    if (!skill || !questionText) {
      continue;
    }

    const uniqueKey = `${skill}::${questionText}`;

    if (seen.has(uniqueKey)) {
      continue;
    }

    seen.add(uniqueKey);
    uniqueQuestions.push(question);
  }

  return uniqueQuestions;
};

const printSkillSummary = (questions = []) => {
  const summary = questions.reduce(
    (result, question) => {
      const skill = question.skill || "Unknown";

      result[skill] = (result[skill] || 0) + 1;

      return result;
    },
    {}
  );

  console.log("\nQuestion count by skill:");

  Object.entries(summary)
    .sort(([firstSkill], [secondSkill]) =>
      firstSkill.localeCompare(secondSkill)
    )
    .forEach(([skill, total]) => {
      console.log(`- ${skill}: ${total}`);
    });
};

const seedQuestions = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is required in backend/.env"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for question seeding");

    const generatedQuestions = generateAllQuestions();

    if (!Array.isArray(generatedQuestions)) {
      throw new Error(
        "generateAllQuestions must return an array"
      );
    }

    const uniqueQuestions = getUniqueQuestions(
      generatedQuestions
    );

    const duplicateCount =
      generatedQuestions.length -
      uniqueQuestions.length;

    if (uniqueQuestions.length === 0) {
      throw new Error(
        "No valid questions were generated"
      );
    }

    await Question.deleteMany({});
    await Question.insertMany(uniqueQuestions, {
      ordered: true,
    });

    console.log(
      `Generated questions: ${generatedQuestions.length}`
    );

    console.log(
      `Duplicate questions removed: ${duplicateCount}`
    );

    console.log(
      `Seeded ${uniqueQuestions.length} unique questions successfully`
    );

    printSkillSummary(uniqueQuestions);
  } catch (error) {
    console.error(
      "Question seed error:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedQuestions();