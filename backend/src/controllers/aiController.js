import AIReview from "../models/AIReview.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

const generateReviewData = ({ user, projects }) => {
  const totalProjects = projects.length;

  const verifiedProjects = projects.filter(
    (project) => project.status === "Verified"
  ).length;

  const averageProjectScore =
    totalProjects > 0
      ? Math.round(
          projects.reduce(
            (sum, project) =>
              sum + (project.verificationScore || 0),
            0
          ) / totalProjects
        )
      : 0;

  const skillCount = user.skills?.length || 0;

  const projectScore = averageProjectScore;
  const githubScore = user.githubScore || (user.github ? 85 : 60);
  const resumeScore = user.bio ? 82 : 65;
  const codingScore =
    skillCount >= 5 ? 88 : skillCount >= 3 ? 75 : 60;

  const overallScore = Math.round(
    (projectScore + githubScore + resumeScore + codingScore) / 4
  );

  const recruiterReadiness = Math.min(
    100,
    Math.round(
      overallScore * 0.7 +
        verifiedProjects * 5 +
        Math.min(skillCount, 8)
    )
  );

  const strengths = [];

  if (verifiedProjects > 0) {
    strengths.push("You have verified projects that increase recruiter trust.");
  }

  if (skillCount >= 5) {
    strengths.push("Your skill set shows strong full-stack capability.");
  }

  if (user.github) {
    strengths.push("GitHub profile is connected with your developer identity.");
  }

  if (user.bio) {
    strengths.push("Your profile bio clearly explains your development focus.");
  }

  if (strengths.length === 0) {
    strengths.push("You have started building your developer profile.");
  }

  const weaknesses = [];

  if (totalProjects < 3) {
    weaknesses.push("Add more projects to improve your portfolio depth.");
  }

  if (!user.github) {
    weaknesses.push("Connect a GitHub profile for stronger verification.");
  }

  if (!user.bio) {
    weaknesses.push("Add a strong bio explaining your skills and goals.");
  }

  if (skillCount < 5) {
    weaknesses.push("Add more relevant technical skills to your profile.");
  }

  if (weaknesses.length === 0) {
    weaknesses.push(
      "Your profile is strong, but can improve with advanced projects."
    );
  }

  const recommendations = [
    "Add at least three complete full-stack projects.",
    "Keep GitHub repositories clean with README files and commit history.",
    "Add live demo links for every major project.",
    "Improve backend depth with authentication, APIs, database design and deployment.",
    "Practice DSA consistently for placement and technical interviews.",
  ];

  return {
    overallScore,
    resumeScore,
    projectScore,
    githubScore,
    codingScore,
    strengths,
    weaknesses,
    recommendations,
    recruiterReadiness,
  };
};

export const generateAIReview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const projects = await Project.find({
      owner: req.user._id,
    });

    const reviewData = generateReviewData({
      user,
      projects,
    });

    const review = await AIReview.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        ...reviewData,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await createNotification({
      user: req.user._id,
      title: "AI Review Generated",
      message: `Your AI review is ready with overall score ${review.overallScore}%.`,
      type: "info",
    });

    res.status(200).json({
      success: true,
      message: "AI review generated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAIReview = async (req, res) => {
  try {
    const review = await AIReview.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "AI review not found. Please generate a review first.",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};