import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email address is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(
        normalizedEmail
      );

      setSubmittedEmail(normalizedEmail);

      setSuccess(
        response.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to send the password reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
                <ShieldCheck size={18} />
                Secure password recovery
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight text-white">
                Recover your Verixa account securely.
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-8 text-blue-100">
                Enter the email linked to your account. We will
                send a secure reset link that expires after a
                short time.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <KeyRound
                  size={28}
                  className="mt-1 text-yellow-300"
                />

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Protected recovery
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Reset links are one-time, time-limited and
                    stored securely in hashed form.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to login
            </Link>

            <div className="mt-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <KeyRound size={29} />
              </div>

              <h2 className="mt-6 text-3xl font-black text-white">
                Forgot your password?
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Enter your registered email address and we will
                send you a secure password reset link.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-300">
                        {success}
                      </p>

                      {submittedEmail && (
                        <p className="mt-2 text-xs leading-5 text-green-200/80">
                          Check the inbox and spam folder for{" "}
                          <span className="font-semibold">
                            {submittedEmail}
                          </span>
                          .
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Mail size={19} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-400">
              For security, the same response is shown whether
              or not an account exists for the entered email.
            </div>

            <p className="mt-8 text-center text-sm text-slate-400">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-400 transition hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}