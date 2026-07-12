import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GitBranch,
  LockKeyhole,
  Mail,
  User,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import verixaIcon from "../../assets/verixa-icon.png";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    };

    if (!payload.name) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    if (!payload.email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    if (payload.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await register(payload);

      if (response?.requiresEmailVerification) {
        const verificationEmail =
          response.email || payload.email;

        sessionStorage.setItem(
          "verixa_verification_email",
          verificationEmail
        );

        navigate("/verify-email", {
          state: {
            email: verificationEmail,
            message:
              response.message ||
              "Verification OTP sent successfully.",
          },
        });

        return;
      }

      if (response?.user?.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (
        response?.user?.role === "recruiter"
      ) {
        navigate("/recruiter/dashboard", {
          replace: true,
        });
      } else if (response?.user) {
        navigate("/developer/dashboard", {
          replace: true,
        });
      } else {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Registration completed. Please sign in.",
            email: payload.email,
          },
        });
      }
    } catch (requestError) {
      const responseData =
        requestError.response?.data;

      if (
        responseData?.requiresEmailVerification
      ) {
        const verificationEmail =
          responseData.email || payload.email;

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
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href =
      "http://localhost:5050/api/oauth/google";
  };

  const handleGitHubRegister = () => {
    window.location.href =
      "http://localhost:5050/api/oauth/github";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 p-2 dark:bg-black">
            <img
              src={verixaIcon}
              alt="Verixa"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Join Verixa and start verifying your skills
          </p>
        </div>

        <Card>
          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

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
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>

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
                  name="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={6}
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

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Account Type
              </label>

              <div className="relative">
                <Users
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="developer">
                    Developer
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
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
              onClick={handleGoogleRegister}
            >
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={handleGitHubRegister}
            >
              <GitBranch size={18} />
              Continue with GitHub
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 transition hover:text-blue-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}