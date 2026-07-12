import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { resetPassword } from "../../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        token,
        password,
        confirmPassword
      );

      setSuccess(
        response.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Password updated successfully. Please login.",
          },
        });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <ShieldCheck
                size={34}
                className="text-blue-500"
              />
            </div>
          </div>

          <h1 className="text-3xl font-black text-center text-white mt-6">
            Reset Password
          </h1>

          <p className="text-center text-slate-400 mt-3">
            Create a strong password for your Verixa
            account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 mt-8"
          >
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-11 pr-12 py-3 text-white outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-11 pr-12 py-3 text-white outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm flex items-center gap-2">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold text-white transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}