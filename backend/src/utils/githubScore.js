const clamp = (value, minimum = 0, maximum = 100) => {
    return Math.min(
      Math.max(Number(value) || minimum, minimum),
      maximum
    );
  };
  
  const calculateRepositoryScore = (repositories = []) => {
    const totalRepositories = repositories.length;
  
    // Maximum 20 points
    return clamp(totalRepositories * 2, 0, 20);
  };
  
  const calculateProfileScore = (profile = {}) => {
    let score = 0;
  
    if (profile.name?.trim()) score += 2;
    if (profile.bio?.trim()) score += 2;
    if (profile.avatar_url) score += 2;
    if (profile.blog?.trim()) score += 2;
    if (profile.location?.trim()) score += 1;
    if (profile.company?.trim()) score += 1;
  
    // Maximum 10 points
    return clamp(score, 0, 10);
  };
  
  const calculateFollowerScore = (profile = {}) => {
    const followers = Number(profile.followers) || 0;
  
    // 1 point per 2 followers, maximum 10
    return clamp(Math.floor(followers / 2), 0, 10);
  };
  
  const calculateStarsScore = (repositories = []) => {
    const totalStars = repositories.reduce(
      (total, repository) =>
        total +
        (Number(repository.stargazers_count) || 0),
      0
    );
  
    // 2 points per star, maximum 15
    return clamp(totalStars * 2, 0, 15);
  };
  
  const calculateForksScore = (repositories = []) => {
    const totalForks = repositories.reduce(
      (total, repository) =>
        total + (Number(repository.forks_count) || 0),
      0
    );
  
    // 2 points per fork, maximum 10
    return clamp(totalForks * 2, 0, 10);
  };
  
  const calculateLanguageScore = (repositories = []) => {
    const languages = new Set(
      repositories
        .map((repository) => repository.language)
        .filter(Boolean)
    );
  
    // 3 points per language, maximum 15
    return clamp(languages.size * 3, 0, 15);
  };
  
  const calculateRecentActivityScore = (
    repositories = []
  ) => {
    if (repositories.length === 0) {
      return 0;
    }
  
    const now = Date.now();
    const ninetyDaysInMilliseconds =
      90 * 24 * 60 * 60 * 1000;
  
    const recentlyUpdatedRepositories =
      repositories.filter((repository) => {
        const updatedAt = new Date(
          repository.pushed_at || repository.updated_at
        ).getTime();
  
        return (
          Number.isFinite(updatedAt) &&
          now - updatedAt <= ninetyDaysInMilliseconds
        );
      }).length;
  
    // Maximum 15 points
    return clamp(
      recentlyUpdatedRepositories * 3,
      0,
      15
    );
  };
  
  const calculateQualityScore = (repositories = []) => {
    if (repositories.length === 0) {
      return 0;
    }
  
    let points = 0;
  
    for (const repository of repositories) {
      if (repository.description?.trim()) {
        points += 1;
      }
  
      if (repository.homepage?.trim()) {
        points += 1;
      }
  
      if (repository.has_wiki) {
        points += 0.5;
      }
  
      if (repository.license) {
        points += 0.5;
      }
  
      if (
        Array.isArray(repository.topics) &&
        repository.topics.length > 0
      ) {
        points += 1;
      }
    }
  
    // Maximum 5 points
    return clamp(Math.floor(points), 0, 5);
  };
  
  export const getGitHubLanguageSummary = (
    repositories = []
  ) => {
    const languageCounts = {};
  
    for (const repository of repositories) {
      const language = repository.language;
  
      if (!language) {
        continue;
      }
  
      languageCounts[language] =
        (languageCounts[language] || 0) + 1;
    }
  
    const totalRepositoriesWithLanguage =
      Object.values(languageCounts).reduce(
        (total, count) => total + count,
        0
      );
  
    return Object.entries(languageCounts)
      .map(([language, repositoryCount]) => ({
        language,
        repositoryCount,
        percentage:
          totalRepositoriesWithLanguage > 0
            ? Number(
                (
                  (repositoryCount /
                    totalRepositoriesWithLanguage) *
                  100
                ).toFixed(2)
              )
            : 0,
      }))
      .sort(
        (firstLanguage, secondLanguage) =>
          secondLanguage.repositoryCount -
          firstLanguage.repositoryCount
      );
  };
  
  export const getTopGitHubRepositories = (
    repositories = [],
    limit = 5
  ) => {
    return [...repositories]
      .sort((firstRepository, secondRepository) => {
        const firstScore =
          (Number(firstRepository.stargazers_count) ||
            0) *
            3 +
          (Number(firstRepository.forks_count) || 0) *
            2;
  
        const secondScore =
          (Number(secondRepository.stargazers_count) ||
            0) *
            3 +
          (Number(secondRepository.forks_count) || 0) *
            2;
  
        return secondScore - firstScore;
      })
      .slice(0, limit)
      .map((repository) => ({
        githubId: repository.id,
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description || "",
        url: repository.html_url,
        homepage: repository.homepage || "",
        language: repository.language || "Unknown",
        stars: Number(repository.stargazers_count) || 0,
        forks: Number(repository.forks_count) || 0,
        openIssues:
          Number(repository.open_issues_count) || 0,
        topics: Array.isArray(repository.topics)
          ? repository.topics
          : [],
        isFork: Boolean(repository.fork),
        createdAt: repository.created_at,
        updatedAt: repository.updated_at,
        pushedAt: repository.pushed_at,
      }));
  };
  
  export const calculateGitHubScore = ({
    profile = {},
    repositories = [],
  }) => {
    const originalRepositories =
      repositories.filter(
        (repository) => !repository.fork
      );
  
    const breakdown = {
      repositories:
        calculateRepositoryScore(
          originalRepositories
        ),
  
      profile: calculateProfileScore(profile),
  
      followers: calculateFollowerScore(profile),
  
      stars: calculateStarsScore(
        originalRepositories
      ),
  
      forks: calculateForksScore(
        originalRepositories
      ),
  
      languages: calculateLanguageScore(
        originalRepositories
      ),
  
      recentActivity:
        calculateRecentActivityScore(
          originalRepositories
        ),
  
      repositoryQuality:
        calculateQualityScore(
          originalRepositories
        ),
    };
  
    const score = clamp(
      Object.values(breakdown).reduce(
        (total, value) => total + value,
        0
      ),
      0,
      100
    );
  
    return {
      score,
      breakdown,
      totalRepositories: repositories.length,
      originalRepositories:
        originalRepositories.length,
  
      totalStars: originalRepositories.reduce(
        (total, repository) =>
          total +
          (Number(repository.stargazers_count) ||
            0),
        0
      ),
  
      totalForks: originalRepositories.reduce(
        (total, repository) =>
          total +
          (Number(repository.forks_count) || 0),
        0
      ),
  
      languages: getGitHubLanguageSummary(
        originalRepositories
      ),
  
      topRepositories:
        getTopGitHubRepositories(
          originalRepositories
        ),
    };
  };