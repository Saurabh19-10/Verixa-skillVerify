export const calculateTrustScore = ({
  user,
  projects = [],
  aiReview = null,
}) => {
  let score = 0;

  // 1. Verified Projects: 35 marks
  const verifiedProjects = projects.filter(
    (project) =>
      (project.verificationStatus || project.status) ===
      "Verified"
  ).length;

  if (projects.length > 0) {
    const projectRatio =
      verifiedProjects / projects.length;

    score += Math.round(projectRatio * 35);
  }

  // 2. AI Review: 25 marks
  if (aiReview?.overallScore) {
    score += Math.round(
      (aiReview.overallScore / 100) * 25
    );
  }

  // 3. Profile Completion: 20 marks
  let profilePoints = 0;

  if (user.name) profilePoints += 4;
  if (user.title) profilePoints += 4;
  if (user.bio) profilePoints += 4;
  if (user.email) profilePoints += 4;
  if (user.avatar) profilePoints += 4;

  score += profilePoints;

  // 4. Skills: 10 marks
  const skillCount = user.skills?.length || 0;

  if (skillCount >= 8) score += 10;
  else if (skillCount >= 5) score += 7;
  else if (skillCount >= 3) score += 5;
  else if (skillCount >= 1) score += 2;

  // 5. GitHub / Portfolio: 10 marks
  if (user.github) score += 5;
  if (user.portfolio) score += 5;

  return Math.min(score, 100);
};