import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  GitFork,
  Loader2,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import {
  connectGitHub,
  getGitHubProfile,
  refreshGitHub,
} from "../../api/githubApi";

const formatDate = (value) => {
  if (!value) {
    return "Not synced yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getScoreLabel = (score = 0) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Growing";
  if (score >= 20) return "Early Stage";

  return "Getting Started";
};

const calculateScoreFromBreakdown = (
  scoreBreakdown = {}
) => {
  return Object.values(scoreBreakdown).reduce(
    (total, value) =>
      total + (Number(value) || 0),
    0
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const MessageBox = ({
  type = "error",
  message,
}) => {
  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
        isSuccess
          ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
          : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2
          className="mt-0.5 shrink-0"
          size={18}
        />
      ) : (
        <AlertCircle
          className="mt-0.5 shrink-0"
          size={18}
        />
      )}

      <span>{message}</span>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-500" />

        <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
          Loading GitHub profile...
        </p>
      </div>
    </div>
  );
};

export default function GitHubCard({
  initialUsername = "",
  onVerified,
}) {
  const [username, setUsername] =
    useState(initialUsername);

  const [github, setGithub] = useState(null);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] =
    useState(false);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadGithubProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getGitHubProfile();

        if (response?.github) {
          setGithub(response.github);

          setUsername(
            response.github.username || ""
          );
        }
      } catch (err) {
        const status = err.response?.status;

        if (status !== 404) {
          setError(
            err.response?.data?.message ||
              "Unable to load GitHub profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadGithubProfile();
  }, []);

  const handleVerify = async (event) => {
    event.preventDefault();

    const normalizedUsername =
      username.trim();

    if (!normalizedUsername) {
      setError(
        "Please enter a GitHub username."
      );

      return;
    }

    try {
      setVerifying(true);
      setError("");
      setSuccess("");

      const response = await connectGitHub(
        normalizedUsername
      );

      setGithub(response.github);

      setUsername(
        response.github?.username ||
          normalizedUsername
      );

      setSuccess(
        response.message ||
          "GitHub profile verified successfully."
      );

      onVerified?.(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify GitHub profile."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      const response =
        await refreshGitHub();

      setGithub(response.github);

      setSuccess(
        response.message ||
          "GitHub profile refreshed successfully."
      );

      onVerified?.(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to refresh GitHub profile."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const score = useMemo(() => {
    if (!github?.scoreBreakdown) {
      return 0;
    }

    return calculateScoreFromBreakdown(
      github.scoreBreakdown
    );
  }, [github]);

  const topLanguages = useMemo(() => {
    if (!Array.isArray(github?.languages)) {
      return [];
    }

    return github.languages.slice(0, 5);
  }, [github]);

  const topRepositories = useMemo(() => {
    if (
      !Array.isArray(
        github?.topRepositories
      )
    ) {
      return [];
    }

    return github.topRepositories.slice(0, 5);
  }, [github]);

  if (loading) {
    return <LoadingState />;
  }

  if (!github?.verified) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-3">
              <FaGithub size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                GitHub Verification
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Verify your GitHub account and
                strengthen your Verixa Trust Score.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <MessageBox
            type="error"
            message={error}
          />

          <div className={error ? "mt-5" : ""}>
            <MessageBox
              type="success"
              message={success}
            />
          </div>

          <form
            onSubmit={handleVerify}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                GitHub username
              </label>

              <div className="relative">
                <FaGithub
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Saurabh19-10"
                  autoComplete="off"
                  disabled={verifying}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {verifying ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Verifying...
                </>
              ) : (
                <>
                  <FaGithub size={18} />
                  Verify GitHub
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white dark:border-slate-800">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img
              src={
                github.avatar ||
                "https://github.com/identicons/app.png"
              }
              alt={
                github.username ||
                "GitHub profile"
              }
              className="h-16 w-16 rounded-2xl border-2 border-white/20 object-cover"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">
                  @{github.username}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                  <CheckCircle2 size={14} />
                  Verified
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-300">
                {github.bio ||
                  "Verified GitHub developer profile"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              GitHub Score
            </p>

            <p className="mt-1 text-4xl font-black">
              {score}

              <span className="text-base font-medium text-slate-400">
                /100
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-300">
              {getScoreLabel(score)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        <MessageBox
          type="error"
          message={error}
        />

        <MessageBox
          type="success"
          message={success}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Followers"
            value={github.followers || 0}
          />

          <StatCard
            icon={Users}
            label="Following"
            value={github.following || 0}
          />

          <StatCard
            icon={BookOpen}
            label="Repositories"
            value={github.publicRepos || 0}
          />

          <StatCard
            icon={Code2}
            label="Languages"
            value={topLanguages.length}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Top Languages
              </h3>

              <Code2
                size={20}
                className="text-blue-500"
              />
            </div>

            {topLanguages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No language data available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {topLanguages.map((item) => (
                  <div key={item.language}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.language}
                      </span>

                      <span className="text-slate-500 dark:text-slate-400">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            Number(
                              item.percentage
                            ) || 0,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Top Repositories
              </h3>

              <BookOpen
                size={20}
                className="text-violet-500"
              />
            </div>

            {topRepositories.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No repositories available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topRepositories.map(
                  (repository) => (
                    <a
                      key={
                        repository.githubId ||
                        repository.fullName ||
                        repository.name
                      }
                      href={repository.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {repository.name}
                          </h4>

                          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                            {repository.description ||
                              "No repository description available."}
                          </p>
                        </div>

                        <ExternalLink
                          size={17}
                          className="shrink-0 text-slate-400"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Code2 size={14} />

                          {repository.language ||
                            "Unknown"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {repository.stars || 0}
                        </span>

                        <span className="flex items-center gap-1">
                          <GitFork size={14} />
                          {repository.forks || 0}
                        </span>
                      </div>
                    </a>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-200 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Last synced
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(
                  github.lastSyncedAt
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <a
              href={github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <FaGithub size={18} />
              View GitHub
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}