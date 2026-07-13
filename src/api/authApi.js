import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5050/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("verixa_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Register
export const register = async (userData) => {
  const { data } = await API.post("/register", userData);
  return data;
};

// Login
export const login = async (credentials) => {
  const { data } = await API.post("/login", credentials);

  if (data.token) {
    localStorage.setItem("verixa_token", data.token);
  }

  return data;
};

// Logout
export const logout = async () => {
  await API.post("/logout");
  localStorage.removeItem("verixa_token");
};

// Logged-in user
export const getMe = async () => {
  const { data } = await API.get("/me");
  return data.user;
};

// Email verification
export const sendVerificationOTP = async (email) => {
  const { data } = await API.post("/send-verification-otp", {
    email,
  });

  return data;
};

export const verifyEmailOTP = async (email, otp) => {
  const { data } = await API.post("/verify-email", {
    email,
    otp,
  });

  return data;
};

export const resendVerificationOTP = async (email) => {
  const { data } = await API.post("/resend-verification-otp", {
    email,
  });

  return data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const { data } = await API.post("/forgot-password", {
    email,
  });

  return data;
};

// Reset password
export const resetPassword = async (
  token,
  password,
  confirmPassword
) => {
  const { data } = await API.put(`/reset-password/${token}`, {
    password,
    confirmPassword,
  });

  return data;
};

// Change password
export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const { data } = await API.put("/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });

  return data;
};

export default API;