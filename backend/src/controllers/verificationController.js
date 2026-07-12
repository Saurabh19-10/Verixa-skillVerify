import axios from "axios";

import Project from "../models/Project.js";

import {
  getGithubRepositories,
} from "../services/githubService.js";

import {
  calculateProjectScore,
} from "../utils/scoreCalculator.js";

import {
  calculateTrustScore,
} from "../services/trustScoreService.js";

import {
  createNotification,
} from "./notificationController.js";

const VERIFIED_SCORE = 70;
const LIVE_URL_TIMEOUT = 8000;

// =========================================
// Helpers
// =========================================

const normalizeUrl = (value = "") => {
  return value.toString().trim();
};

const extractGitHubRepository = (repositoryUrl = "") => {
  try {
    const normalizedUrl = normalizeUrl(repositoryUrl);

    if (!normalizedUrl) {
      return null;
    }

    const url = new URL(normalizedUrl);

    if (
      !["github.com", "www.github.com"].includes(
        url.hostname.toLowerCase()
      )
    ) {
      return null;
    }

    const pathParts = url.pathname
      .split("/")
      .filter(Boolean);

    if (pathParts.length < 2) {
      return null;
    }

    const owner = pathParts[0];
    const repository = pathParts[1].replace(
      /\.git$/i,
      ""
    );

    if (!owner || !repository) {
      return null;
    }

    return {
      owner,
      repository,
      fullName: `${owner}/${repository}`,
    };
  } catch {
    return null;
  }
};

const checkLiveUrl = async (liveUrl = "") => {
  const normalizedUrl = normalizeUrl(liveUrl);

  if (!normalizedUrl) {
    return {
      configured: false,
      reachable: false,
      statusCode: null,
    };
  }

  try {
    const response = await axios.get(
      normalizedUrl,
      {
        timeout: LIVE_URL_TIMEOUT,
        maxRedirects: 5,
        validateStatus: (status) =>
          status >= 200 && status < 500,
      }
    );

    return {
      configured: true,
      reachable:
        response.status >= 200 &&
        response.status < 400,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      statusCode:
        error.response?.status || null,
    };
  }
};

const buildRepositoryAnalytics = (
  repository
) => {
  if (!repository) {
    return null;
  }

  const pushedAt = repository.pushed_at
    ? new Date(repository.pushed_at)
    : null;

  const ninetyDaysAgo = new Date(
    Date.now() -
      90 * 24 * 60 * 60 * 1000
  );

  const isRecentlyActive =
    pushedAt &&
    !Number.isNaN(pushedAt.getTime()) &&
    pushedAt >= ninetyDaysAgo;

  return {
    githubId: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    owner:
      repository.owner?.login || "",
    url: repository.html_url || "",
    description:
      repository.description || "",
    language:
      repository.language || "",
    stars:
      Number(
        repository.stargazers_count
      ) || 0,
    forks:
      Number(repository.forks_count) ||
      0,
    openIssues:
      Number(
        repository.open_issues_count
      ) || 0,
    topics: Array.isArray(
      repository.topics
    )
      ? repository.topics
      : [],
    license:
      repository.license?.name || "",
    homepage:
      repository.homepage || "",
    isFork: Boolean(repository.fork),
    hasIssues:
      Boolean(repository.has_issues),
    hasProjects:
      Boolean(repository.has_projects),
    hasWiki:
      Boolean(repository.has_wiki),
    defaultBranch:
      repository.default_branch || "",
    createdAt:
      repository.created_at || null,
    updatedAt:
      repository.updated_at || null,
    pushedAt:
      repository.pushed_at || null,
    recentCommits: isRecentlyActive
      ? 5
      : 0,
    hasReadme: false,
  };
};

const checkRepositoryReadme = async ({
  owner,
  repository,
}) => {
  try {
    const headers = {
      Accept:
        "application/vnd.github+json",
      "X-GitHub-Api-Version":
        "2022-11-28",
      "User-Agent": "Verixa-Backend",
    };

    const githubToken =
      process.env.GITHUB_TOKEN?.trim();

    if (githubToken) {
      headers.Authorization =
        `Bearer ${githubToken}`;
    }

    await axios.get(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(
        repository
      )}/readme`,
      {
        headers,
        timeout: 10000,
      }
    );

    return true;
  } catch {
    return false;
  }
};

const verifyGitHubRepository = async (
  repositoryUrl
) => {
  const repositoryInfo =
    extractGitHubRepository(repositoryUrl);

  if (!repositoryInfo) {
    return {
      exists: false,
      validUrl: false,
      repositoryInfo: null,
      analytics: null,
      message:
        "Please provide a valid GitHub repository URL",
    };
  }

  const repositories =
    await getGithubRepositories(
      repositoryInfo.owner
    );

  const repository = repositories.find(
    (item) =>
      item.name.toLowerCase() ===
      repositoryInfo.repository.toLowerCase()
  );

  if (!repository) {
    return {
      exists: false,
      validUrl: true,
      repositoryInfo,
      analytics: null,
      message:
        "GitHub repository could not be found",
    };
  }

  const analytics =
    buildRepositoryAnalytics(repository);

  analytics.hasReadme =
    await checkRepositoryReadme(
      repositoryInfo
    );

  return {
    exists: true,
    validUrl: true,
    repositoryInfo,
    analytics,
    message:
      "GitHub repository verified successfully",
  };
};

const safelyUpdateTrustScore = async (
  userId
) => {
  try {
    await calculateTrustScore(userId);
  } catch (error) {
    console.error(
      "Project verification trust score update failed:",
      error.message
    );
  }
};

const safelyCreateNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  try {
    await createNotification({
      user: userId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error(
      "Project verification notification failed:",
      error.message
    );
  }
};

// =========================================
// POST /api/verification/:projectId
// =========================================

export const verifyProject = async (
  req,
  res
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let repositoryVerification = {
      exists: false,
      validUrl: false,
      analytics: null,
      message:
        "No GitHub repository provided",
    };

    if (project.github) {
      repositoryVerification =
        await verifyGitHubRepository(
          project.github
        );
    }

    const liveVerification =
      await checkLiveUrl(project.live);

    project.githubAnalytics =
      repositoryVerification.analytics;

    const {
      score,
      breakdown,
    } = calculateProjectScore(project);

    /*
     * Invalid GitHub URL ko repository points
     * nahi milne chahiye.
     */
    if (
      !repositoryVerification.exists
    ) {
      breakdown.githubRepository = 0;
      breakdown.readme = 0;
      breakdown.recentActivity = 0;
      breakdown.repositoryQuality = 0;
    }

    /*
     * Live URL configured but unreachable ho
     * to live demo points remove kar do.
     */
    if (
      liveVerification.configured &&
      !liveVerification.reachable
    ) {
      breakdown.liveDemo = 0;
    }

    const finalScore = Math.min(
      Object.values(breakdown).reduce(
        (total, value) =>
          total +
          (Number(value) || 0),
        0
      ),
      100
    );

    const isVerified =
      finalScore >= VERIFIED_SCORE &&
      repositoryVerification.exists;

    project.verificationScore =
      finalScore;

    project.verificationBreakdown =
      breakdown;

    project.verificationStatus =
      isVerified
        ? "Verified"
        : "Pending";

    project.lastVerifiedAt =
      new Date();

    project.verificationMessage =
      isVerified
        ? "Project passed GitHub repository and quality verification."
        : repositoryVerification.exists
          ? `Project score is ${finalScore}%. A minimum score of ${VERIFIED_SCORE}% is required.`
          : repositoryVerification.message;

    if (isVerified) {
      project.verifiedAt = new Date();
    } else {
      project.verifiedAt = null;
    }

    const updatedProject =
      await project.save();

    await safelyUpdateTrustScore(
      project.owner
    );

    await safelyCreateNotification({
      userId: project.owner,
      title: isVerified
        ? "Project Verified"
        : "Project Verification Pending",
      message: isVerified
        ? `${project.title} has been verified with a score of ${finalScore}%.`
        : `${project.title} received ${finalScore}%. ${project.verificationMessage}`,
      type: isVerified
        ? "success"
        : "warning",
    });

    return res.status(200).json({
      success: true,
      message: isVerified
        ? "Project verified successfully"
        : "Project verification completed, but requirements were not met",
      project: updatedProject,
      verification: {
        score: finalScore,
        minimumRequired:
          VERIFIED_SCORE,
        status:
          project.verificationStatus,
        breakdown,
        github: {
          validUrl:
            repositoryVerification.validUrl,
          repositoryExists:
            repositoryVerification.exists,
          message:
            repositoryVerification.message,
          analytics:
            repositoryVerification.analytics,
        },
        liveDemo:
          liveVerification,
      },
    });
  } catch (error) {
    console.error(
      "Verify project error:",
      error
    );

    const statusCode =
      error.message?.includes(
        "GitHub authentication failed"
      )
        ? 502
        : error.message?.includes(
              "rate limit"
            )
          ? 429
          : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Unable to verify project",
    });
  }
};