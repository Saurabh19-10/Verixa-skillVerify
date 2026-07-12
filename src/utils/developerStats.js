// Derives consistent, presentable stats from a raw developer record
// (src/data/developers.js) so every recruiter-facing page shows the
// same numbers for the same developer.

export function getGithubScore(dev) {
  if (!dev?.github) return 0;

  const { repos = 0, stars = 0 } = dev.github;

  const raw = 50 + stars / 5 + repos / 2;

  return Math.max(0, Math.min(99, Math.round(raw)));
}

export function getDeveloperStats(dev) {
  return {
    trustScore: dev.trustScore,
    githubScore: getGithubScore(dev),
    projects: dev.projects,
    assessmentScore: dev.assessments?.averageScore ?? 0,
    verified: !!dev.github?.verified,
  };
}

export function getDeveloperById(developers, id) {
  return developers.find(
    (dev) => String(dev.id) === String(id)
  );
}
