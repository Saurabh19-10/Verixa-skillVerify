import User from "../models/User.js";

import {
  getGithubProfile,
  getGithubRepositories,
} from "../services/githubService.js";

import {
  calculateGitHubScore,
} from "../utils/githubScore.js";

import {
  calculateTrustScore,
} from "../services/trustScoreService.js";

import {
  createNotification,
} from "./notificationController.js";

// =========================================
// Helpers
// =========================================

const normalizeGitHubUsername = (username = "") => {
  return username
    .toString()
    .trim()
    .replace(/^@/, "")
    .replace(
      /^https?:\/\/(www\.)?github\.com\//i,
      ""
    )
    .split("/")[0]
    .trim();
};

const buildGitHubData = ({
  profile,
  repositories,
  analytics,
}) => {
  return {
    username: profile.login,
    name: profile.name || "",
    bio: profile.bio || "",
    avatar: profile.avatar_url || "",
    profileUrl: profile.html_url || "",
    company: profile.company || "",
    location: profile.location || "",
    blog: profile.blog || "",

    followers: Number(profile.followers) || 0,
    following: Number(profile.following) || 0,
    publicRepos:
      Number(profile.public_repos) || 0,

    accountCreatedAt:
      profile.created_at || null,

    profileUpdatedAt:
      profile.updated_at || null,

    totalRepositories:
      analytics.totalRepositories || 0,

    originalRepositories:
      analytics.originalRepositories || 0,

    totalStars: analytics.totalStars || 0,
    totalForks: analytics.totalForks || 0,

    languages: analytics.languages || [],

    topRepositories:
      analytics.topRepositories || [],

    scoreBreakdown:
      analytics.breakdown || {},

    verified: true,
    verifiedAt: new Date(),
    lastSyncedAt: new Date(),

    repositoryCount: repositories.length,
  };
};

const fetchAndAnalyzeGitHub = async (username) => {
  const profile = await getGithubProfile(username);

  const repositories =
    await getGithubRepositories(profile.login);

  const analytics = calculateGitHubScore({
    profile,
    repositories,
  });

  return {
    profile,
    repositories,
    analytics,
    githubData: buildGitHubData({
      profile,
      repositories,
      analytics,
    }),
  };
};

const saveGitHubDataToUser = async ({
  user,
  profile,
  analytics,
  githubData,
}) => {
  /*
   * Existing Verixa fields preserve kiye gaye hain
   * taaki purana Profile UI break na ho.
   */
  user.githubUsername = profile.login;
  user.github = profile.html_url;
  user.githubScore = analytics.score;

  /*
   * User model me githubAnalytics field add karne ke
   * baad complete GitHub information isme save hogi.
   */
  user.githubAnalytics = githubData;

  await user.save();

  return user;
};

const safelyUpdateTrustScore = async (userId) => {
  try {
    await calculateTrustScore(userId);
  } catch (error) {
    console.error(
      "GitHub trust score update failed:",
      error.message
    );
  }
};

const safelyCreateNotification = async ({
  userId,
  title,
  message,
}) => {
  try {
    await createNotification({
      user: userId,
      title,
      message,
      type: "success",
    });
  } catch (error) {
    console.error(
      "GitHub notification creation failed:",
      error.message
    );
  }
};

// =========================================
// POST /api/github/verify
// =========================================

export const verifyGithub = async (req, res) => {
  try {
    const username = normalizeGitHubUsername(
      req.body.username
    );

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "GitHub username is required",
      });
    }

    if (
      !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(
        username
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid GitHub username",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      profile,
      analytics,
      githubData,
    } = await fetchAndAnalyzeGitHub(username);

    await saveGitHubDataToUser({
      user,
      profile,
      analytics,
      githubData,
    });

    await safelyUpdateTrustScore(user._id);

    await safelyCreateNotification({
      userId: user._id,
      title: "GitHub Profile Verified",
      message:
        `Your GitHub account @${profile.login} ` +
        `was verified successfully. GitHub Score: ` +
        `${analytics.score}/100.`,
    });

    return res.status(200).json({
      success: true,
      message: "GitHub profile verified successfully",
      github: githubData,
      githubScore: analytics.score,
    });
  } catch (error) {
    console.error(
      "Verify GitHub error:",
      error
    );

    const statusCode =
      error.message === "GitHub user was not found."
        ? 404
        : error.message.includes(
              "authentication failed"
            )
          ? 502
          : error.message.includes("rate limit")
            ? 429
            : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Unable to verify GitHub profile",
    });
  }
};

// =========================================
// GET /api/github/profile
// =========================================

export const getGithubProfileData = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select(
      [
        "github",
        "githubUsername",
        "githubScore",
        "githubAnalytics",
      ].join(" ")
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.githubUsername ||
      !user.githubAnalytics?.verified
    ) {
      return res.status(404).json({
        success: false,
        message:
          "GitHub profile has not been verified yet",
      });
    }

    return res.status(200).json({
      success: true,
      github: user.githubAnalytics,
      githubScore: user.githubScore || 0,
    });
  } catch (error) {
    console.error(
      "Get GitHub profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch GitHub profile",
    });
  }
};

// =========================================
// POST /api/github/refresh
// =========================================

export const refreshGithub = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const username = normalizeGitHubUsername(
      user.githubUsername
    );

    if (!username) {
      return res.status(400).json({
        success: false,
        message:
          "Verify a GitHub account before refreshing it",
      });
    }

    const lastSyncedAt =
      user.githubAnalytics?.lastSyncedAt;

    if (lastSyncedAt) {
      const fiveMinutes =
        5 * 60 * 1000;

      const elapsed =
        Date.now() -
        new Date(lastSyncedAt).getTime();

      if (elapsed < fiveMinutes) {
        const waitSeconds = Math.ceil(
          (fiveMinutes - elapsed) / 1000
        );

        return res.status(429).json({
          success: false,
          message:
            `GitHub profile was recently refreshed. ` +
            `Please try again after ${waitSeconds} seconds.`,
          retryAfterSeconds: waitSeconds,
        });
      }
    }

    const {
      profile,
      analytics,
      githubData,
    } = await fetchAndAnalyzeGitHub(username);

    await saveGitHubDataToUser({
      user,
      profile,
      analytics,
      githubData,
    });

    await safelyUpdateTrustScore(user._id);

    return res.status(200).json({
      success: true,
      message:
        "GitHub profile refreshed successfully",
      github: githubData,
      githubScore: analytics.score,
    });
  } catch (error) {
    console.error(
      "Refresh GitHub error:",
      error
    );

    const statusCode =
      error.message === "GitHub user was not found."
        ? 404
        : error.message.includes(
              "authentication failed"
            )
          ? 502
          : error.message.includes("rate limit")
            ? 429
            : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Unable to refresh GitHub profile",
    });
  }
};