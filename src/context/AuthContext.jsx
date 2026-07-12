import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/api";

export const AuthContext = createContext(null);

const USER_STORAGE_KEY = "verixa_user";
const TOKEN_STORAGE_KEY = "verixa_token";

const saveAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  if (user) {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(user)
    );
  }
};

const clearAuthData = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // Load authenticated user
  // =========================================

  useEffect(() => {
    const loadCurrentUser = async () => {
      const storedToken = localStorage.getItem(
        TOKEN_STORAGE_KEY
      );

      const storedUser = localStorage.getItem(
        USER_STORAGE_KEY
      );

      if (!storedToken) {
        clearAuthData();
        setUser(null);
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      try {
        const { data } = await api.get("/auth/me");

        if (!data?.user) {
          throw new Error(
            "Authenticated user was not returned"
          );
        }

        setUser(data.user);

        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error(
          "Unable to restore authentication:",
          error.response?.data?.message || error.message
        );

        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // =========================================
  // Login
  // =========================================

  const login = async (email, password) => {
    const normalizedEmail = email
      .toString()
      .trim()
      .toLowerCase();

    const { data } = await api.post("/auth/login", {
      email: normalizedEmail,
      password,
    });

    if (!data?.token || !data?.user) {
      throw new Error(
        "Invalid login response received from server"
      );
    }

    saveAuthData({
      token: data.token,
      user: data.user,
    });

    setUser(data.user);

    return data.user;
  };

  // =========================================
  // Register
  // =========================================

  const register = async (userData) => {
    const payload = {
      ...userData,
      name: userData.name?.trim(),
      email: userData.email
        ?.toString()
        .trim()
        .toLowerCase(),
    };

    const { data } = await api.post(
      "/auth/register",
      payload
    );

    /*
     * New registration flow does not log the user in.
     * User must first verify the OTP.
     */
    if (data?.requiresEmailVerification) {
      clearAuthData();
      setUser(null);

      if (data.email) {
        sessionStorage.setItem(
          "verixa_verification_email",
          data.email
        );
      }

      return data;
    }

    /*
     * Fallback support, in case backend later returns
     * token immediately for a special registration flow.
     */
    if (data?.token && data?.user) {
      saveAuthData({
        token: data.token,
        user: data.user,
      });

      setUser(data.user);
    }

    return data;
  };

  // =========================================
  // Refresh current user
  // =========================================

  const refreshUser = async () => {
    const { data } = await api.get("/auth/me");

    if (!data?.user) {
      throw new Error("User data was not returned");
    }

    setUser(data.user);

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(data.user)
    );

    return data.user;
  };

  // =========================================
  // Update user locally
  // =========================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setUser((currentUser) => {
      const nextUser = currentUser
        ? {
            ...currentUser,
            ...updatedUser,
          }
        : updatedUser;

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(nextUser)
      );

      return nextUser;
    });
  };

  // =========================================
  // Logout
  // =========================================

  const logout = async () => {
    try {
      const token = localStorage.getItem(
        TOKEN_STORAGE_KEY
      );

      if (token) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error(
        "Backend logout failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      clearAuthData();
      sessionStorage.removeItem(
        "verixa_verification_email"
      );
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      updateUser,
      setUser,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      isEmailVerified:
        user?.isEmailVerified === true,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};