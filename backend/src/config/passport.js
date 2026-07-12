import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

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

// ===============================
// Google OAuth
// ===============================

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
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

  console.log("✅ Google OAuth Enabled");
} else {
  console.log("⚠️ Google OAuth Disabled");
}

// ===============================
// GitHub OAuth
// ===============================

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
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

  console.log("✅ GitHub OAuth Enabled");
} else {
  console.log("⚠️ GitHub OAuth Disabled");
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;