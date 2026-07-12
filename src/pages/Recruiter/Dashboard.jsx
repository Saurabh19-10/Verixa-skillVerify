import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import {
  getRecruiterAnalytics,
} from "../../api/recruiterApi";

import {
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  Search,
  Star,
  Eye,
  BadgeCheck,
  FolderGit2,
  Brain,
} from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getRecruiterAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Recruiter analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout recruiter>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading recruiter analytics...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout recruiter>
        <Card className="text-center">
          <p className="text-red-400">
            Failed to load analytics.
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  const { overview, topDevelopers, recentDevelopers, charts } = analytics;

  return (
    <DashboardLayout recruiter>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Recruiter Analytics
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track verified developers, project quality and hiring signals.
          </p>
        </div>

        <Button onClick={() => navigate("/recruiter/search")}>
          <Search size={18} />
          Find Developers
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Developers"
          value={overview.totalDevelopers}
          icon={<Users className="text-blue-500" />}
        />

        <StatCard
          title="Verified Developers"
          value={overview.verifiedDevelopers}
          icon={<UserCheck className="text-green-500" />}
        />

        <StatCard
          title="Total Projects"
          value={overview.totalProjects}
          icon={<Briefcase className="text-purple-500" />}
        />

        <StatCard
          title="AI Reviews"
          value={overview.aiReviews}
          icon={<Brain className="text-cyan-500" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Developer Trust Distribution
          </h2>

          <div className="space-y-5">
            {charts.developerTrust.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={item.value}
                total={overview.totalDevelopers || 1}
                color={
                  item.label === "Verified"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Project Verification Status
          </h2>

          <div className="space-y-5">
            {charts.projectStatus.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={item.value}
                total={overview.totalProjects || 1}
                color={
                  item.label === "Verified"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Top Developers
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/recruiter/search")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {topDevelopers.length === 0 ? (
              <p className="text-slate-500">No developers yet.</p>
            ) : (
              topDevelopers.map((dev) => (
                <DeveloperRow
                  key={dev._id}
                  developer={dev}
                  onView={() =>
                    navigate(`/recruiter/developer/${dev._id}`)
                  }
                />
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Developers
            </h2>

            <FolderGit2 className="text-purple-400" />
          </div>

          <div className="space-y-4">
            {recentDevelopers.length === 0 ? (
              <p className="text-slate-500">No recent developers.</p>
            ) : (
              recentDevelopers.map((dev) => (
                <DeveloperRow
                  key={dev._id}
                  developer={dev}
                  onView={() =>
                    navigate(`/recruiter/developer/${dev._id}`)
                  }
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <InsightCard
          title="Verified Hiring Pool"
          text={`${overview.verifiedDevelopers} developers currently meet verified trust criteria.`}
          icon={<BadgeCheck className="text-green-400" />}
        />

        <InsightCard
          title="Project Quality"
          text={`${overview.verifiedProjects} projects are verified, while ${overview.pendingProjects} are pending.`}
          icon={<FolderGit2 className="text-purple-400" />}
        />

        <InsightCard
          title="Growth Opportunity"
          text={`${overview.growingDevelopers} developers can improve with assessments, GitHub and project verification.`}
          icon={<TrendingUp className="text-blue-400" />}
        />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        {icon}

        <Star className="text-yellow-400" size={18} />
      </div>

      <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {title}
      </p>
    </Card>
  );
}

function ProgressRow({ label, value, total, color }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          {label}
        </span>

        <span className="font-semibold text-slate-900 dark:text-white">
          {value} ({percentage}%)
        </span>
      </div>

      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DeveloperRow({ developer, onView }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <img
          src={
            developer.avatar ||
            "https://i.pravatar.cc/150?img=12"
          }
          alt={developer.name}
          className="h-12 w-12 rounded-full"
        />

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {developer.name}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {developer.title || "Developer"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Trust</p>

          <p className="font-bold text-green-400">
            {developer.trustScore || 0}
          </p>
        </div>

        <Button size="sm" onClick={onView}>
          <Eye size={16} />
          View
        </Button>
      </div>
    </div>
  );
}

function InsightCard({ title, text, icon }) {
  return (
    <Card>
      <div className="mb-4">{icon}</div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {text}
      </p>
    </Card>
  );
}