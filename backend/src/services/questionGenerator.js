import { questionLibrary } from "../data/questionLibrary.js";

const normalizeText = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const shuffleArray = (items = []) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const validateQuestion = (item, skill) => {
  if (!item?.question?.trim()) {
    throw new Error(
      `Question text is missing for skill: ${skill}`
    );
  }

  if (
    !Array.isArray(item.options) ||
    item.options.length !== 4
  ) {
    throw new Error(
      `Question "${item.question}" must contain exactly 4 options`
    );
  }

  if (!item.options.includes(item.correctAnswer)) {
    throw new Error(
      `Correct answer is not present in options for question: ${item.question}`
    );
  }
};

const removeDuplicateQuestions = (
  questions = [],
  skill = ""
) => {
  const uniqueQuestions = [];
  const seenQuestions = new Set();

  for (const item of questions) {
    validateQuestion(item, skill);

    const normalizedQuestion = normalizeText(
      item.question
    );

    if (seenQuestions.has(normalizedQuestion)) {
      continue;
    }

    seenQuestions.add(normalizedQuestion);

    uniqueQuestions.push({
      skill,
      category: item.category || "",
      difficulty: item.difficulty || "Medium",
      question: item.question.trim(),
      options: shuffleArray(item.options),
      correctAnswer: item.correctAnswer,
      explanation: item.explanation?.trim() || "",
      isActive: item.isActive !== false,
    });
  }

  return uniqueQuestions;
};

export const generateQuestionsForSkill = (skill) => {
  const library = questionLibrary[skill];

  if (!library) {
    throw new Error(
      `No question library found for ${skill}`
    );
  }

  if (
    !Array.isArray(library.questions) ||
    library.questions.length === 0
  ) {
    throw new Error(
      `No questions found in library for ${skill}`
    );
  }

  const questionsWithCategory = library.questions.map(
    (item) => ({
      ...item,
      category:
        item.category || library.category || "General",
    })
  );

  return removeDuplicateQuestions(
    questionsWithCategory,
    skill
  );
};

export const generateAllQuestions = () => {
  const allQuestions = [];

  for (const skill of Object.keys(questionLibrary)) {
    const skillQuestions =
      generateQuestionsForSkill(skill);

    allQuestions.push(...skillQuestions);
  }

  return allQuestions;
};