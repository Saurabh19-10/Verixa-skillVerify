import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import {
  getAIReview,
  generateAIReview,
} from "../../api/aiApi";

import {
  Brain,
  FileText,
  GitBranch,
  FolderGit2,
  Code2,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";

export default function AIReview() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchReview = async () => {
    try {
      setError("");
      const data = await getAIReview();
      setReview(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No AI review found. Generate one first."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const handleGenerateReview = async () => {
    try {
      setGenerating(true);
      setError("");

      const data = await generateAIReview();
      setReview(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate AI review."
      );
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const scores = review
    ? [
        {
          title: "Resume Score",
          score: review.resumeScore,
          icon: <FileText size={22} />,
          color: "text-blue-400",
        },
        {
          title: "GitHub Score",
          score: review.githubScore,
          icon: <GitBranch size={22} />,
          color: "text-green-400",
        },
        {
          title: "Project Quality",
          score: review.projectScore,
          icon: <FolderGit2 size={22} />,
          color: "text-purple-400",
        },
        {
          title: "Coding Skills",
          score: review.codingScore,
          icon: <Code2 size={22} />,
          color: "text-yellow-400",
        },
      ]
    : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading AI review...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
            <Brain className="text-blue-500" />
            AI Review
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            AI-powered analysis of your profile, projects, coding skills, and
            recruiter readiness.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">
            <Download size={18} />
            Download Report
          </Button>

          <Button onClick={handleGenerateReview} disabled={generating}>
            <RefreshCw size={18} />
            {generating ? "Generating..." : "Generate Review"}
          </Button>
        </div>
      </div>

      {error && !review && (
        <Card className="mb-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">{error}</p>

          <div className="mt-6">
            <Button onClick={handleGenerateReview} disabled={generating}>
              <RefreshCw size={18} />
              {generating ? "Generating..." : "Generate AI Review"}
            </Button>
          </div>
        </Card>
      )}

      {review && (
        <>
          <Card className="mb-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  AI Trust Analysis
                </h2>

                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  Based on your GitHub activity, assessments, verified projects
                  and profile quality.
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Overall AI Score
                    </span>

                    <span className="font-semibold text-green-400">
                      {review.overallScore}%
                    </span>
                  </div>

                  <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-4 rounded-full bg-green-500"
                      style={{
                        width: `${review.overallScore}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full border-8 border-green-500 p-8">
                  <h2 className="text-6xl font-bold text-green-400">
                    {review.overallScore}
                  </h2>
                </div>

                <p className="mt-4 text-green-400">
                  {review.overallScore >= 85
                    ? "Excellent Developer Profile"
                    : review.overallScore >= 70
                    ? "Good Developer Profile"
                    : "Improving Developer Profile"}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {scores.map((item) => (
              <Card key={item.title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {item.title}
                    </p>

                    <h3 className={`mt-2 text-3xl font-bold ${item.color}`}>
                      {item.score}%
                    </h3>
                  </div>

                  <div className={item.color}>{item.icon}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                <CheckCircle className="text-green-400" />
                Strengths
              </h2>

              <div className="space-y-4">
                {review.strengths?.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-green-500/10 p-4 text-green-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="text-yellow-400" />
                Areas to Improve
              </h2>

              <div className="space-y-4">
                {review.weaknesses?.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-yellow-500/10 p-4 text-yellow-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="mt-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Recruiter Readiness
            </h2>

            <div className="mb-3 flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Hiring Readiness Score
              </span>

              <span className="font-semibold text-blue-400">
                {review.recruiterReadiness}%
              </span>
            </div>

            <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-4 rounded-full bg-blue-500"
                style={{
                  width: `${review.recruiterReadiness}%`,
                }}
              />
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              This score is calculated from your profile quality, verified
              projects, skills, and developer readiness.
            </p>
          </Card>

          <Card className="mt-8">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              <TrendingUp className="text-blue-400" />
              AI Recommendations
            </h2>

            <div className="space-y-4">
              {review.recommendations?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}