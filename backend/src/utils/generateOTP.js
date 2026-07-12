import crypto from "crypto";

/**
 * Generates a secure numeric OTP.
 *
 * @param {number} length OTP length
 * @returns {string} Numeric OTP
 */
const generateOTP = (length = 6) => {
  if (!Number.isInteger(length) || length < 4 || length > 10) {
    throw new Error("OTP length must be an integer between 4 and 10");
  }

  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return crypto.randomInt(min, max).toString();
};

export default generateOTP;