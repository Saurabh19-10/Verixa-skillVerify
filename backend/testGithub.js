import "dotenv/config";

import {
  getGithubProfile,
  verifyGithubConnection,
} from "./src/services/githubService.js";

const testGitHub = async () => {
  try {
    console.log(
      "Token configured:",
      Boolean(process.env.GITHUB_TOKEN)
    );

    const connection =
      await verifyGithubConnection();

    console.log("GitHub token connected:");
    console.log(connection);

    const profile = await getGithubProfile(
      "Saurabh19-10"
    );

    console.log("Requested GitHub profile:");
    console.log({
      login: profile.login,
      name: profile.name,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      profileUrl: profile.html_url,
    });
  } catch (error) {
    console.error("GitHub test failed:", error.message);
    process.exitCode = 1;
  }
};

testGitHub();