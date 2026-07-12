import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
  return jwt.sign(
    {
      id,
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRE || "15m",
    }
  );
};

export const generateRefreshToken = (id) => {
  return jwt.sign(
    {
      id,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRE || "7d",
    }
  );
};

const generateToken = generateAccessToken;

export default generateToken;