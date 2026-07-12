export const calculateProjectScore = (project) => {
  const breakdown = {
    githubRepository: 0,
    liveDemo: 0,
    readme: 0,
    description: 0,
    technologies: 0,
    recentActivity: 0,
    repositoryQuality: 0,
  };

  // =========================
  // GitHub Repository (30)
  // =========================
  if (project.github) {
    breakdown.githubRepository = 30;
  }

  // =========================
  // Live Demo (15)
  // =========================
  if (project.live) {
    breakdown.liveDemo = 15;
  }

  // =========================
  // Description (10)
  // =========================
  if (
    project.description &&
    project.description.trim().length >= 100
  ) {
    breakdown.description = 10;
  } else if (
    project.description &&
    project.description.trim().length >= 50
  ) {
    breakdown.description = 5;
  }

  // =========================
  // Tech Stack (10)
  // =========================
  if (project.tech?.length >= 5) {
    breakdown.technologies = 10;
  } else if (project.tech?.length >= 3) {
    breakdown.technologies = 6;
  } else if (project.tech?.length >= 1) {
    breakdown.technologies = 3;
  }

  // =========================
  // GitHub Analytics
  // =========================

  if (project.githubAnalytics) {
    const analytics = project.githubAnalytics;

    // README (10)
    if (analytics.hasReadme) {
      breakdown.readme = 10;
    }

    // Recent Activity (10)
    if (analytics.recentCommits >= 20) {
      breakdown.recentActivity = 10;
    } else if (analytics.recentCommits >= 10) {
      breakdown.recentActivity = 7;
    } else if (analytics.recentCommits >= 5) {
      breakdown.recentActivity = 5;
    }

    // Repository Quality (15)
    let quality = 0;

    if (analytics.stars >= 50) quality += 5;
    else if (analytics.stars >= 10) quality += 3;

    if (analytics.forks >= 20) quality += 5;
    else if (analytics.forks >= 5) quality += 3;

    if (analytics.openIssues <= 5) quality += 5;

    breakdown.repositoryQuality = Math.min(
      quality,
      15
    );
  }

  const score = Object.values(breakdown).reduce(
    (sum, value) => sum + value,
    0
  );

  return {
    score: Math.min(score, 100),
    breakdown,
  };
};