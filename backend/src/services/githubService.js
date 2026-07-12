import axios from "axios";

const getGitHubHeaders = () => {
  const token = process.env.GITHUB_TOKEN?.trim();

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Verixa-Backend",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const githubApi = axios.create({
  baseURL:
    process.env.GITHUB_API?.trim() ||
    "https://api.github.com",
  timeout: 15000,
});

const handleGitHubError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (status === 401) {
    throw new Error(
      "GitHub authentication failed. Check whether GITHUB_TOKEN is valid, active, and not revoked."
    );
  }

  if (status === 404) {
    throw new Error("GitHub user was not found.");
  }

  if (status === 403) {
    const remaining =
      error.response?.headers?.["x-ratelimit-remaining"];

    if (remaining === "0") {
      throw new Error(
        "GitHub API rate limit exceeded. Try again after the rate-limit reset."
      );
    }

    throw new Error(
      message || "GitHub API access was forbidden."
    );
  }

  throw new Error(
    message ||
      error.message ||
      "Unable to communicate with GitHub."
  );
};

export const getGithubProfile = async (username) => {
  try {
    const normalizedUsername = username
      ?.toString()
      .trim();

    if (!normalizedUsername) {
      throw new Error("GitHub username is required.");
    }

    const { data } = await githubApi.get(
      `/users/${encodeURIComponent(normalizedUsername)}`,
      {
        headers: getGitHubHeaders(),
      }
    );

    return data;
  } catch (error) {
    handleGitHubError(error);
  }
};

export const getGithubRepositories = async (
  username
) => {
  try {
    const normalizedUsername = username
      ?.toString()
      .trim();

    if (!normalizedUsername) {
      throw new Error("GitHub username is required.");
    }

    const repositories = [];
    let page = 1;

    while (page <= 10) {
      const { data } = await githubApi.get(
        `/users/${encodeURIComponent(
          normalizedUsername
        )}/repos`,
        {
          headers: getGitHubHeaders(),
          params: {
            per_page: 100,
            page,
            sort: "updated",
            direction: "desc",
            type: "owner",
          },
        }
      );

      repositories.push(...data);

      if (data.length < 100) {
        break;
      }

      page += 1;
    }

    return repositories;
  } catch (error) {
    handleGitHubError(error);
  }
};

export const verifyGithubConnection = async () => {
  try {
    const token = process.env.GITHUB_TOKEN?.trim();

    if (!token) {
      throw new Error(
        "GITHUB_TOKEN is missing from backend/.env"
      );
    }

    const { data } = await githubApi.get("/user", {
      headers: getGitHubHeaders(),
    });

    return {
      login: data.login,
      id: data.id,
      profileUrl: data.html_url,
    };
  } catch (error) {
    handleGitHubError(error);
  }
};