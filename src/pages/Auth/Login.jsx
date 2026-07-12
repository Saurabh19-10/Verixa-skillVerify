import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Eye,
  EyeOff,
  GitBranch,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import verixaIcon from "../../assets/verixa-icon.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message || "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    try {
      const user = await login(
        normalizedEmail,
        password
      );

      if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (user.role === "recruiter") {
        navigate("/recruiter/dashboard", {
          replace: true,
        });
      } else {
        navigate("/developer/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      const responseData = err.response?.data;

      if (
        responseData?.requiresEmailVerification
      ) {
        const verificationEmail =
          responseData.email || normalizedEmail;

        sessionStorage.setItem(
          "verixa_verification_email",
          verificationEmail
        );

        navigate("/verify-email", {
          state: {
            email: verificationEmail,
          },
        });

        return;
      }

      setError(
        responseData?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5050/api/oauth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href =
      "http://localhost:5050/api/oauth/github";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 p-2 dark:bg-black">
            <img
              src={verixaIcon}
              alt="Verixa"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Sign in to your Verixa account
          </p>
        </div>

        <Card>
          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {successMessage && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  disabled={loading}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-500 transition hover:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  disabled={loading}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={handleGitHubLogin}
            >
              <GitBranch size={18} />
              Continue with GitHub
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-500 transition hover:text-blue-400"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}