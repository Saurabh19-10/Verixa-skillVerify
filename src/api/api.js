import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://verixa-skillverify.onrender.com/api";

const TOKEN_STORAGE_KEY = "verixa_token";
const USER_STORAGE_KEY = "verixa_user";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise = null;

const clearAuthentication = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const shouldSkipRefresh = (url = "") => {
  const publicAuthEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/send-verification-otp",
    "/auth/resend-verification-otp",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh-token",
  ];

  return publicAuthEndpoints.some((endpoint) =>
    url.includes(endpoint)
  );
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(requestUrl)
    ) {
      return Promise.reject(error);
    }

    const storedAccessToken = localStorage.getItem(
      TOKEN_STORAGE_KEY
    );

    /*
     * When no access token exists, the user is not currently
     * authenticated. Do not attempt refresh on public pages.
     */
    if (!storedAccessToken) {
      clearAuthentication();
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

      const newAccessToken = await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthentication();

      /*
       * Return the original unauthorized error instead of
       * showing "Refresh token is missing" on login pages.
       */
      return Promise.reject(error);
    }
  }
);

export default api;