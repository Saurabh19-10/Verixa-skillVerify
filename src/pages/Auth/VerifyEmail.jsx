import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  resendVerificationOTP,
  verifyEmailOTP,
} from "../../api/authApi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail =
    location.state?.email ||
    sessionStorage.getItem("verixa_verification_email") ||
    "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(
    initialEmail ? RESEND_SECONDS : 0
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (initialEmail) {
      sessionStorage.setItem(
        "verixa_verification_email",
        initialEmail
      );
    }
  }, [initialEmail]);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) {
      return email;
    }

    const [name, domain] = email.split("@");

    if (name.length <= 2) {
      return `${name[0] || ""}***@${domain}`;
    }

    return `${name.slice(0, 2)}***@${domain}`;
  }, [email]);

  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    setOtp(value);
    setError("");
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyEmailOTP(
        normalizedEmail,
        otp
      );

      setSuccess(
        response.message || "Email verified successfully."
      );

      sessionStorage.removeItem(
        "verixa_verification_email"
      );

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Email verified successfully. You can now log in.",
            email: normalizedEmail,
          },
        });
      }, 1200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to verify email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    setError("");
    setSuccess("");

    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }

    if (countdown > 0 || resending) {
      return;
    }

    try {
      setResending(true);

      const response = await resendVerificationOTP(
        normalizedEmail
      );

      setSuccess(
        response.message || "A new OTP has been sent."
      );

      setCountdown(
        response.resendAfterSeconds || RESEND_SECONDS
      );

      sessionStorage.setItem(
        "verixa_verification_email",
        normalizedEmail
      );
    } catch (requestError) {
      const retryAfter =
        requestError.response?.data?.retryAfter;

      if (retryAfter) {
        setCountdown(Number(retryAfter));
      }

      setError(
        requestError.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
                <ShieldCheck size={18} />
                Secure account verification
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight text-white">
                Verify your email to unlock Verixa.
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-8 text-blue-100">
                We sent a secure six-digit code to your email.
                Verification protects your profile, assessments
                and certificates.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <MailCheck
                  size={28}
                  className="mt-1 text-yellow-300"
                />

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Proof starts with trust
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Verified email accounts help recruiters trust
                    the identity behind every skill result.
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
                <MailCheck size={29} />
              </div>

              <h2 className="mt-6 text-3xl font-black text-white">
                Verify your email
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Enter the OTP sent to{" "}
                <span className="font-semibold text-slate-200">
                  {maskedEmail || "your email address"}
                </span>
                .
              </p>
            </div>

            <form
              onSubmit={handleVerify}
              className="mt-8 space-y-5"
            >
              {!initialEmail && (
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Six-digit OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-3xl font-black tracking-[0.55em] text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-500">
                  OTP is valid for 10 minutes.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
                  <CheckCircle2 size={18} />
                  {success}
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={19} />
                    Verify Email
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row">
              <p className="text-sm text-slate-400">
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:text-slate-600"
              >
                {resending ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw size={16} />
                )}

                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}