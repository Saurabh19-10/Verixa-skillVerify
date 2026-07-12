import { javaQuestions } from "./questions/javaQuestions.js";
import { javascriptQuestions } from "./questions/javascriptQuestions.js";
import { reactQuestions } from "./questions/reactQuestions.js";
import { nodeQuestions } from "./questions/nodeQuestions.js";
import { expressQuestions } from "./questions/expressQuestions.js";
import { mongoQuestions } from "./questions/mongoQuestions.js";
import { htmlQuestions } from "./questions/htmlQuestions.js";
import { cssQuestions } from "./questions/cssQuestions.js";
import { sqlQuestions } from "./questions/sqlQuestions.js";
import { gitQuestions } from "./questions/gitQuestions.js";
import { artificialIntelligenceQuestions } from "./questions/artificialIntelligenceQuestions.js";
import { dsaQuestions } from "./questions/dsaQuestions.js";
import { machineLearningQuestions } from "./questions/machineLearningQuestions.js";
import { pythonQuestions } from "./questions/pythonQuestions.js";

const validateQuestion = (question, skill) => {
  if (!question?.question?.trim()) {
    throw new Error(
      `Question text is missing for skill: ${skill}`
    );
  }

  if (
    !Array.isArray(question.options) ||
    question.options.length !== 4
  ) {
    throw new Error(
      `"${question.question}" must contain exactly 4 options`
    );
  }

  const uniqueOptions = new Set(
    question.options.map((option) =>
      option.toString().trim().toLowerCase()
    )
  );

  if (uniqueOptions.size !== 4) {
    throw new Error(
      `"${question.question}" contains duplicate options`
    );
  }

  if (!question.options.includes(question.correctAnswer)) {
    throw new Error(
      `Correct answer is missing from options: ${question.question}`
    );
  }

  if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) {
    throw new Error(
      `Invalid difficulty for question: ${question.question}`
    );
  }
};

const removeDuplicates = (questions, skill) => {
  const seen = new Set();
  const uniqueQuestions = [];

  for (const question of questions) {
    validateQuestion(question, skill);

    const key = question.question
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueQuestions.push(question);
  }

  return uniqueQuestions;
};

const createSkillLibrary = ({
  skill,
  category,
  questions,
}) => {
  if (!Array.isArray(questions)) {
    throw new Error(
      `Question list must be an array for ${skill}`
    );
  }

  const uniqueQuestions = removeDuplicates(
    questions,
    skill
  );

  if (uniqueQuestions.length < 15) {
    throw new Error(
      `${skill} requires at least 15 unique questions. Found ${uniqueQuestions.length}.`
    );
  }

  return {
    category,
    questions: uniqueQuestions,
  };
};
export const questionLibrary = {
  Java: createSkillLibrary({
    skill: "Java",
    category: "Programming",
    questions: javaQuestions,
  }),

  JavaScript: createSkillLibrary({
    skill: "JavaScript",
    category: "Programming",
    questions: javascriptQuestions,
  }),

  React: createSkillLibrary({
    skill: "React",
    category: "Frontend",
    questions: reactQuestions,
  }),

  "Node.js": createSkillLibrary({
    skill: "Node.js",
    category: "Backend",
    questions: nodeQuestions,
  }),

  "Express.js": createSkillLibrary({
    skill: "Express.js",
    category: "Backend",
    questions: expressQuestions,
  }),

  MongoDB: createSkillLibrary({
    skill: "MongoDB",
    category: "Database",
    questions: mongoQuestions,
  }),

  HTML: createSkillLibrary({
    skill: "HTML",
    category: "Frontend",
    questions: htmlQuestions,
  }),

  CSS: createSkillLibrary({
    skill: "CSS",
    category: "Frontend",
    questions: cssQuestions,
  }),

  SQL: createSkillLibrary({
    skill: "SQL",
    category: "Database",
    questions: sqlQuestions,
  }),

  Git: createSkillLibrary({
    skill: "Git",
    category: "Tools",
    questions: gitQuestions,
  }),

  "Artificial Intelligence": createSkillLibrary({
    skill: "Artificial Intelligence",
    category: "AI",
    questions: artificialIntelligenceQuestions,
  }),

  "Machine Learning": createSkillLibrary({
    skill: "Machine Learning",
    category: "AI",
    questions: machineLearningQuestions,
  }),

  DSA: createSkillLibrary({
    skill: "DSA",
    category: "Programming",
    questions: dsaQuestions,
  }),
  Python: createSkillLibrary({
    skill: "Python",
    category: "Programming",
    questions: pythonQuestions,
  }),
};