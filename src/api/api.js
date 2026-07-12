import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5050/api";

const TOKEN_STORAGE_KEY =
  "verixa_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type":
      "application/json",
  },
  withCredentials: true,
});

let refreshPromise = null;

const clearAuthentication = () => {
  localStorage.removeItem(
    "verixa_token"
  );

  localStorage.removeItem(
    "verixa_user"
  );
};

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        TOKEN_STORAGE_KEY
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const isUnauthorized =
      error.response?.status === 401;

    const isRefreshRequest =
      originalRequest?.url?.includes(
        "/auth/refresh-token"
      );

    if (
      !isUnauthorized ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh-token")
          .then(({ data }) => {
            if (!data?.token) {
              throw new Error(
                "Refresh token response did not contain an access token"
              );
            }

            localStorage.setItem(
              TOKEN_STORAGE_KEY,
              data.token
            );

            return data.token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken =
        await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthentication();

      return Promise.reject(
        refreshError
      );
    }
  }
);

export default api;