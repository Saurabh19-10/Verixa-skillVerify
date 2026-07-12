import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const token = createToken(req.user);

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const token = createToken(req.user);

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

export default router;