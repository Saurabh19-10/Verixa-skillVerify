import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { getProfile } from "../../api/userApi";
import { getProjects } from "../../api/projectApi";
import { getMyResults } from "../../api/assessmentApi";
import { calculateTrustScore } from "../../api/trustApi";

import {
  ShieldCheck,
  GitBranch,
  BadgeCheck,
  ClipboardCheck,
  FolderGit2,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function Verification() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerificationData = async () => {
    try {
      setLoading(true);

      const [userData, projectsData, resultsData] =
        await Promise.all([
          getProfile(),
          getProjects(),
          getMyResults().catch(() => []),
        ]);

      setProfile(userData);
      setProjects(projectsData || []);
      setResults(resultsData || []);
    } catch (error) {
      console.error("Verification load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const handleReVerify = async () => {
    try {
      const data = await calculateTrustScore();

      setProfile((prev) => ({
        ...prev,
        trustScore: data.trustScore,
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to re-verify profile");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading verification...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const trustScore = profile?.trustScore || 0;

  const verifiedProjects = projects.filter(
    (project) => project.status === "Verified"
  ).length;

  const projectScore =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (sum, project) =>
              sum + (project.verificationScore || 0),
            0
          ) / projects.length
        )
      : 0;

  const passedAssessments = results.filter(
    (result) => result.passed
  ).length;

  const assessmentScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum + (result.percentage || 0),
            0
          ) / results.length
        )
      : 0;

  const githubScore = profile?.githubScore || 0;

  const verificationItems = [
    {
      title: "GitHub Verification",
      score: githubScore,
      icon: <GitBranch size={22} />,
      status: profile?.github ? "Verified" : "Pending",
      description: profile?.github
        ? "GitHub profile connected and developer identity verified."
        : "Connect GitHub to verify repository and coding activity.",
    },
    {
      title: "Skill Assessments",
      score: assessmentScore,
      icon: <ClipboardCheck size={22} />,
      status: passedAssessments > 0 ? "Verified" : "Pending",
      description:
        passedAssessments > 0
          ? "Technical assessments completed successfully."
          : "Complete skill assessments to improve verification.",
    },
    {
      title: "Project Verification",
      score: projectScore,
      icon: <FolderGit2 size={22} />,
      status: verifiedProjects > 0 ? "Verified" : "Pending",
      description:
        verifiedProjects > 0
          ? "Projects validated through repository and deployment checks."
          : "Verify at least one project to improve trust score.",
    },
  ];

  const timeline = [
    {
      title: profile?.github
        ? "GitHub Connected"
        : "GitHub Not Connected",
      date: profile?.github || "Pending",
      status: profile?.github ? "completed" : "pending",
    },
    {
      title:
        passedAssessments > 0
          ? `${passedAssessments} Assessment(s) Passed`
          : "No Assessment Passed Yet",
      date:
        results.length > 0
          ? "Assessment records found"
          : "Pending",
      status: passedAssessments > 0 ? "completed" : "pending",
    },
    {
      title:
        verifiedProjects > 0
          ? `${verifiedProjects} Project(s) Verified`
          : "No Project Verified Yet",
      date:
        projects.length > 0
          ? `${projects.length} project(s) submitted`
          : "Pending",
      status: verifiedProjects > 0 ? "completed" : "pending",
    },
    {
      title: "Trust Score Generated",
      date: `${trustScore}%`,
      status: trustScore > 0 ? "completed" : "pending",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Verification Center
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track your real verification progress and trust score.
          </p>
        </div>

        <Button onClick={handleReVerify}>
          <ShieldCheck size={18} />
          Re-Verify Profile
        </Button>
      </div>

      <Card className="mb-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Developer Trust Score
            </h2>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Your profile is evaluated using GitHub activity, verified
              projects and assessment performance.
            </p>

            <div className="mt-6">
              <div className="mb-2 flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Overall Score
                </span>

                <span className="font-semibold text-green-400">
                  {trustScore}%
                </span>
              </div>

              <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-4 rounded-full bg-green-500"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div
              className={`rounded-full border-8 p-8 ${
                trustScore >= 70
                  ? "border-green-500"
                  : "border-yellow-500"
              }`}
            >
              <h2
                className={`text-6xl font-bold ${
                  trustScore >= 70
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {trustScore}
              </h2>
            </div>

            <p
              className={`mt-4 flex items-center gap-2 ${
                trustScore >= 70
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              <BadgeCheck size={18} />
              {trustScore >= 70
                ? "Verified Developer"
                : "Growing Developer"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {verificationItems.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                {item.icon}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  item.status === "Verified"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h3>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {item.description}
            </p>

            <div className="mt-5">
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Verification Score
                </span>

                <span className="font-semibold text-green-400">
                  {item.score}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Verified Projects
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {verifiedProjects}
              </h3>
            </div>

            <FolderGit2 className="text-blue-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Assessments Passed
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {passedAssessments}
              </h3>
            </div>

            <ClipboardCheck className="text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Ranking
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {trustScore >= 90
                  ? "Top 5%"
                  : trustScore >= 70
                  ? "Top 25%"
                  : "Growing"}
              </h3>
            </div>

            <TrendingUp className="text-yellow-400" />
          </div>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
          Verification Timeline
        </h2>

        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="mt-1">
                {item.status === "completed" ? (
                  <CheckCircle2
                    size={24}
                    className="text-green-400"
                  />
                ) : (
                  <Clock
                    size={24}
                    className="text-yellow-400"
                  />
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}