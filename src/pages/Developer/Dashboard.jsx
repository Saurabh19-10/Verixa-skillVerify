import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";

import { getProfile } from "../../api/userApi";
import { getProjects } from "../../api/projectApi";
import { getMySkillResults } from "../../api/skillAssessmentApi";

import {
  ShieldCheck,
  Award,
  FolderGit2,
  GitBranch,
  CheckCircle2,
} from "lucide-react";

export default function Dashboard() {
  const location = useLocation();

  const assessmentMessage = location.state?.message;
  const assessmentResult = location.state?.assessmentResult;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [userData, projectsData, resultsData] =
          await Promise.all([
            getProfile(),
            getProjects(),
            getMySkillResults().catch(() => []),
          ]);

        setProfile(userData);
        setProjects(projectsData || []);
        setResults(resultsData || []);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }
  const verifiedProjects = projects.filter(
    (project) =>
      (project.verificationStatus || project.status) ===
      "Verified"
  ).length;
  
  const averageAssessmentScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) => sum + (result.percentage || 0),
            0
          ) / results.length
        )
      : 0;

  const stats = [
    {
      title: "Trust Score",
      value: profile?.trustScore || 0,
      icon: <ShieldCheck size={24} />,
    },
    {
      title: "Verified Projects",
      value: verifiedProjects,
      icon: <FolderGit2 size={24} />,
    },
    {
      title: "Avg Assessment",
      value: `${averageAssessmentScore}%`,
      icon: <Award size={24} />,
    },
    {
      title: "GitHub Score",
      value: profile?.githubScore || 0,
      icon: <GitBranch size={24} />,
    },
  ];

  const skills = profile?.skills || [];

  const progressItems = [
    {
      name: "GitHub Verification",
      progress: profile?.github ? 100 : 0,
    },
    {
      name: "Project Verification",
      progress:
        projects.length > 0
          ? Math.round((verifiedProjects / projects.length) * 100)
          : 0,
    },
    {
      name: "Skill Assessment",
      progress: averageAssessmentScore,
    },
    {
      name: "Portfolio Review",
      progress: profile?.bio ? 80 : 20,
    },
  ];

  return (
    <DashboardLayout>
      {assessmentMessage && (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500" />

            <div>
              <h3 className="font-semibold text-green-500">
                {assessmentMessage}
              </h3>

              {assessmentResult && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Score: {assessmentResult.score}/
                  {assessmentResult.totalQuestions || 15} • Percentage:{" "}
                  {assessmentResult.percentage}% • Status:{" "}
                  {assessmentResult.passed ? "Passed" : "Failed"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Here's an overview of your developer profile.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </h3>
              </div>

              <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-500">
                {item.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            Profile Overview
          </h3>

          <div className="flex items-center gap-5">
            <img
              src={profile?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt="profile"
              className="h-20 w-20 rounded-full object-cover"
            />

            <div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                {profile?.name || "Developer"}
              </h4>

              <p className="text-slate-600 dark:text-slate-400">
                {profile?.title || "Developer"}
              </p>

              <p className="mt-2 text-sm text-green-400">
                {profile?.trustScore >= 70
                  ? "✓ Verified Developer"
                  : "Growing Developer"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            Trust Score
          </h3>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-blue-500">
                {profile?.trustScore || 0}
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {profile?.trustScore >= 90
                  ? "Excellent"
                  : profile?.trustScore >= 70
                  ? "Good"
                  : "Growing"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
            Top Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500">No skills added yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {results.slice(0, 3).map((result) => (
              <div
                key={result._id}
                className={`border-l-2 pl-4 ${
                  result.passed ? "border-green-500" : "border-red-500"
                }`}
              >
                <p className="text-slate-900 dark:text-white">
                  {result.skill} Assessment{" "}
                  {result.passed ? "Passed" : "Failed"}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Score {result.score}/{result.totalQuestions || 15} •{" "}
                  {result.percentage}%
                </p>
              </div>
            ))}

            {results.length === 0 && (
              <>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-slate-900 dark:text-white">
                    Profile Loaded
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Current account: {profile?.email}
                  </p>
                </div>

                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-slate-900 dark:text-white">
                    Projects Synced
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {projects.length} project(s) found
                  </p>
                </div>

                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-slate-900 dark:text-white">
                    Assessments Ready
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Complete your first skill assessment.
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            Verification Progress
          </h3>

          <div className="space-y-5">
            {progressItems.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>

                  <span className="text-blue-400">
                    {item.progress}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-blue-500"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}