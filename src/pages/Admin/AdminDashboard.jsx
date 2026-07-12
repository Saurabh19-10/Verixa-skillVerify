import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import {
  getAdminAnalytics,
  getAdminUsers,
  deleteAdminUser,
  getAdminProjects,
  getAdminAssessments,
  getAdminAIReviews,
} from "../../api/adminApi";

import {
  Users,
  UserCheck,
  Briefcase,
  FileCheck,
  Brain,
  Trash2,
  ShieldCheck,
  FolderGit2,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [
        analyticsData,
        usersData,
        projectsData,
        assessmentsData,
        reviewsData,
      ] = await Promise.all([
        getAdminAnalytics(),
        getAdminUsers(),
        getAdminProjects(),
        getAdminAssessments(),
        getAdminAIReviews(),
      ]);

      setAnalytics(analyticsData);
      setUsers(usersData);
      setProjects(projectsData);
      setAssessments(assessmentsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Panel" subtitle="Platform management">
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading admin dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Panel" subtitle="Manage Verixa platform">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="text-blue-500" />
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor users, projects, assessments and AI reviews.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={<Users className="text-blue-500" />}
        />

        <StatCard
          title="Developers"
          value={analytics?.developers || 0}
          icon={<UserCheck className="text-green-500" />}
        />

        <StatCard
          title="Projects"
          value={analytics?.totalProjects || 0}
          icon={<Briefcase className="text-purple-500" />}
        />

        <StatCard
          title="AI Reviews"
          value={analytics?.totalAIReviews || 0}
          icon={<Brain className="text-cyan-500" />}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <MiniCard
          label="Recruiters"
          value={analytics?.recruiters || 0}
        />

        <MiniCard
          label="Verified Projects"
          value={analytics?.verifiedProjects || 0}
        />

        <MiniCard
          label="Assessments"
          value={analytics?.totalAssessments || 0}
        />

        <MiniCard
          label="Assessment Results"
          value={analytics?.totalResults || 0}
        />
      </div>

      <Card className="mt-8">
        <div className="flex flex-wrap gap-3">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </TabButton>

          <TabButton
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </TabButton>

          <TabButton
            active={activeTab === "assessments"}
            onClick={() => setActiveTab("assessments")}
          >
            Assessments
          </TabButton>

          <TabButton
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
          >
            AI Reviews
          </TabButton>
        </div>
      </Card>

      <div className="mt-8">
        {activeTab === "users" && (
          <UsersTable
            users={users}
            onDelete={handleDeleteUser}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTable projects={projects} />
        )}

        {activeTab === "assessments" && (
          <AssessmentsTable assessments={assessments} />
        )}

        {activeTab === "reviews" && (
          <ReviewsTable reviews={reviews} />
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        {icon}
        <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
          Live
        </span>
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

function MiniCard({ label, value }) {
  return (
    <Card>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>
    </Card>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-500 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function UsersTable({ users, onDelete }) {
  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Manage Users
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 text-slate-500">User</th>
              <th className="py-3 text-slate-500">Email</th>
              <th className="py-3 text-slate-500">Role</th>
              <th className="py-3 text-slate-500">Trust</th>
              <th className="py-3 text-slate-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar ||
                        "https://i.pravatar.cc/150?img=12"
                      }
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />

                    <span className="font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-400">
                  {user.email}
                </td>

                <td className="py-4">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                    {user.role}
                  </span>
                </td>

                <td className="py-4 text-slate-900 dark:text-white">
                  {user.trustScore || 0}
                </td>

                <td className="py-4">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={user.role === "admin"}
                    onClick={() => onDelete(user._id)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            No users found.
          </p>
        )}
      </div>
    </Card>
  );
}

function ProjectsTable({ projects }) {
  return (
    <Card>
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <FolderGit2 className="text-purple-400" />
        All Projects
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Owner: {project.owner?.name || "Unknown"} •{" "}
                  {project.owner?.email || "No email"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  project.status === "Verified"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-slate-500">No projects found.</p>
        )}
      </div>
    </Card>
  );
}

function AssessmentsTable({ assessments }) {
  return (
    <Card>
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <FileCheck className="text-green-400" />
        Assessments
      </h2>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div
            key={assessment._id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {assessment.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {assessment.category} • {assessment.level} •{" "}
              {assessment.duration} min
            </p>
          </div>
        ))}

        {assessments.length === 0 && (
          <p className="text-slate-500">
            No assessments found.
          </p>
        )}
      </div>
    </Card>
  );
}

function ReviewsTable({ reviews }) {
  return (
    <Card>
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Brain className="text-blue-400" />
        AI Reviews
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {review.user?.name || "Unknown User"}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {review.user?.email || "No email"}
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                Overall {review.overallScore || 0}%
              </span>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-slate-500">No AI reviews found.</p>
        )}
      </div>
    </Card>
  );
}