import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";

import User from "../models/User.js";
const createOAuthUser = async ({
  name,
  email,
  avatar,
  github = "",
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      password: Math.random().toString(36).slice(-10),
      role: "developer",
      avatar,
      github,
    });
  }

  return user;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "http://localhost:5050/api/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        const user = await createOAuthUser({
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0]?.value || "",
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "http://localhost:5050/api/oauth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.local`;

        const user = await createOAuthUser({
          name: profile.displayName || profile.username,
          email,
          avatar: profile.photos?.[0]?.value || "",
          github: profile.profileUrl || "",
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;