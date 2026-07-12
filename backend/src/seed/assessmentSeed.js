import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import reactQuestions from "../data/questions/reactQuestions.js";
import javaQuestions from "../data/questions/javaQuestions.js";

const assessments = [
  {
    title: "React Assessment",
    skill: "React",
    category: "Frontend",
    level: "Beginner",
    duration: 30,
    totalMarks: 20,
    passingPercentage: 70,
    questions: reactQuestions,
    isActive: true,
  },
  {
    title: "Java Assessment",
    skill: "Java",
    category: "Programming",
    level: "Beginner",
    duration: 30,
    totalMarks: 20,
    passingPercentage: 70,
    questions: javaQuestions,
    isActive: true,
  },
];

const seedAssessments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Assessment.deleteMany({});
    await Assessment.insertMany(assessments);

    console.log("Assessments seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAssessments();