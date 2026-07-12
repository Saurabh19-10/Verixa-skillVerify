import User from "../models/User.js";
import Project from "../models/Project.js";
import AssessmentResult from "../models/AssessmentResult.js";

export const calculateTrustScore = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await Project.find({
    owner: userId,
  });

  const results = await AssessmentResult.find({
    user: userId,
  });

  const verifiedProjects = projects.filter(
    (project) => project.status === "Verified"
  ).length;

  const bestAssessmentBySkill = new Map();

  results.forEach((result) => {
    const skill = result.skill?.toLowerCase();

    if (!skill) return;

    const existing = bestAssessmentBySkill.get(skill);

    if (!existing || result.percentage > existing.percentage) {
      bestAssessmentBySkill.set(skill, result);
    }
  });

  const bestResults = Array.from(bestAssessmentBySkill.values());

  const averageAssessment =
    bestResults.length > 0
      ? bestResults.reduce(
          (sum, result) => sum + (result.percentage || 0),
          0
        ) / bestResults.length
      : 0;

  let score = 0;

  // Profile completeness: 20 points
  if (user.name) score += 3;
  if (user.title) score += 3;
  if (user.bio) score += 4;
  if (user.avatar) score += 3;
  if (user.github) score += 3;
  if (user.portfolio) score += 2;
  if (user.skills?.length >= 3) score += 2;

  // Verified projects: 30 points
  score += Math.min(verifiedProjects * 10, 30);

  // Assessments: 40 points
  score += Math.min((averageAssessment / 100) * 40, 40);

  // GitHub score: 10 points
  const githubScore = Math.min(user.githubScore || 0, 100);
  score += (githubScore / 100) * 10;

  const finalScore = Math.min(Math.round(score), 100);

  user.trustScore = finalScore;
  await user.save();

  return {
    trustScore: finalScore,
    breakdown: {
      verifiedProjects,
      averageAssessment: Math.round(averageAssessment),
      githubScore,
    },
  };
};