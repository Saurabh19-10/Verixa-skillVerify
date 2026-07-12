import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AddProjectModal from "../../components/modals/AddProjectModal";

import {
  createProject,
  deleteProject,
  getProjects,
  verifyProject,
} from "../../api/projectApi";

import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  FolderGit2,
  GitBranch,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Server,
  Trash2,
} from "lucide-react";

const getProjectStatus = (project) => {
  return (
    project.verificationStatus ||
    project.status ||
    "Pending"
  );
};

const getStatusStyles = (status) => {
  if (status === "Verified") {
    return {
      badge:
        "bg-green-500/10 text-green-500 border-green-500/20",
      bar: "bg-green-500",
      text: "text-green-500",
      icon: BadgeCheck,
    };
  }

  if (status === "Rejected") {
    return {
      badge:
        "bg-red-500/10 text-red-500 border-red-500/20",
      bar: "bg-red-500",
      text: "text-red-500",
      icon: AlertCircle,
    };
  }

  return {
    badge:
      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    bar: "bg-yellow-500",
    text: "text-yellow-500",
    icon: Clock,
  };
};

const formatDate = (value) => {
  if (!value) {
    return "Not verified yet";
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

const BreakdownItem = ({
  icon: Icon,
  label,
  value = 0,
  maximum,
}) => {
  const percentage =
    maximum > 0
      ? Math.min(
          Math.round((value / maximum) * 100),
          100
        )
      : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon
            size={16}
            className="text-blue-500"
          />

          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {label}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-900 dark:text-white">
          {value}/{maximum}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [verifyingProjectId, setVerifyingProjectId] =
    useState(null);

  const [verificationMessage, setVerificationMessage] =
    useState("");

  const [verificationError, setVerificationError] =
    useState("");

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("q") || ""
  );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  useEffect(() => {
    const query = searchParams.get("q");

    if (query !== null) {
      setSearch(query);
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (
    projectData
  ) => {
    try {
      const newProject =
        await createProject(projectData);

      setProjects((previousProjects) => [
        newProject,
        ...previousProjects,
      ]);

      setIsModalOpen(false);
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Failed to add project"
      );
    }
  };

  const handleDeleteProject = async (
    projectId
  ) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteProject(projectId);

      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) =>
            project._id !== projectId
        )
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  const handleVerifyProject = async (
    projectId
  ) => {
    try {
      setVerifyingProjectId(projectId);
      setVerificationMessage("");
      setVerificationError("");

      const response = await verifyProject(
        projectId
      );

      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          project._id === projectId
            ? response.project
            : project
        )
      );

      setVerificationMessage(
        response.message ||
          "Project verification completed"
      );
    } catch (err) {
      setVerificationError(
        err.response?.data?.message ||
          "Project verification failed"
      );
    } finally {
      setVerifyingProjectId(null);
    }
  };

  const filteredProjects = useMemo(() => {
    const term = search
      .toLowerCase()
      .trim();

    if (!term) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.title
          ?.toLowerCase()
          .includes(term) ||
        project.description
          ?.toLowerCase()
          .includes(term) ||
        project.tech?.some((technology) =>
          technology
            .toLowerCase()
            .includes(term)
        )
      );
    });
  }, [projects, search]);

  const totalProjects = projects.length;

  const verifiedProjects = projects.filter(
    (project) =>
      getProjectStatus(project) === "Verified"
  ).length;

  const pendingProjects = projects.filter(
    (project) =>
      getProjectStatus(project) === "Pending"
  ).length;

  const successRate =
    totalProjects > 0
      ? Math.round(
          (verifiedProjects /
            totalProjects) *
            100
        )
      : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-500" />

            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Loading projects...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Projects
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage, analyze and verify your
            development projects.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Project
        </Button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-500">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {verificationMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-500">
          <CheckCircle2 size={20} />
          {verificationMessage}
        </div>
      )}

      {verificationError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-500">
          <AlertCircle size={20} />
          {verificationError}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Total Projects
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {totalProjects}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Verified Projects
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-500">
            {verifiedProjects}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Pending Review
          </p>

          <h3 className="mt-2 text-3xl font-bold text-yellow-500">
            {pendingProjects}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Success Rate
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-500">
            {successRate}%
          </h3>
        </Card>
      </div>

      <Card className="mt-8">
        <Input
          icon={<Search size={18} />}
          placeholder="Search projects by name or tech stack..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </Card>

      {filteredProjects.length === 0 ? (
        <Card className="mt-8 text-center">
          <FolderGit2
            size={42}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 text-slate-600 dark:text-slate-400">
            No projects found.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {filteredProjects.map((project) => {
            const status =
              getProjectStatus(project);

            const statusStyles =
              getStatusStyles(status);

            const StatusIcon =
              statusStyles.icon;

            const breakdown =
              project.verificationBreakdown ||
              {};

            const isVerifying =
              verifyingProjectId === project._id;

            return (
              <Card key={project._id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>
                  </div>

                  <div
                    className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-3 py-1 text-sm font-medium ${statusStyles.badge}`}
                  >
                    <StatusIcon size={16} />
                    {status}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech?.map(
                    (technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-500"
                      >
                        {technology}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Verification Score
                    </span>

                    <span
                      className={`text-lg font-bold ${statusStyles.text}`}
                    >
                      {project.verificationScore ||
                        0}
                      %
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusStyles.bar}`}
                      style={{
                        width: `${Math.min(
                          project.verificationScore ||
                            0,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Last verified:{" "}
                    {formatDate(
                      project.lastVerifiedAt
                    )}
                  </p>

                  {project.verificationMessage && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {
                        project.verificationMessage
                      }
                    </p>
                  )}
                </div>

                {project.verificationScore >
                  0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <BreakdownItem
                      icon={GitBranch}
                      label="GitHub Repository"
                      value={
                        breakdown.githubRepository ||
                        0
                      }
                      maximum={30}
                    />

                    <BreakdownItem
                      icon={ExternalLink}
                      label="Live Demo"
                      value={
                        breakdown.liveDemo || 0
                      }
                      maximum={15}
                    />

                    <BreakdownItem
                      icon={FileText}
                      label="README"
                      value={
                        breakdown.readme || 0
                      }
                      maximum={10}
                    />

                    <BreakdownItem
                      icon={Code2}
                      label="Tech Stack"
                      value={
                        breakdown.technologies ||
                        0
                      }
                      maximum={10}
                    />

                    <BreakdownItem
                      icon={RefreshCw}
                      label="Recent Activity"
                      value={
                        breakdown.recentActivity ||
                        0
                      }
                      maximum={10}
                    />

                    <BreakdownItem
                      icon={Server}
                      label="Repository Quality"
                      value={
                        breakdown.repositoryQuality ||
                        0
                      }
                      maximum={15}
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-300"
                    >
                      <GitBranch size={18} />
                      GitHub
                    </a>
                  )}

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-300"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  )}

                  <Button
                    onClick={() =>
                      handleVerifyProject(
                        project._id
                      )
                    }
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        {status === "Verified" ? (
                          <RefreshCw size={18} />
                        ) : (
                          <BadgeCheck size={18} />
                        )}

                        {status === "Verified"
                          ? "Re-Verify"
                          : "Verify Project"}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
                    }
                    disabled={isVerifying}
                  >
                    <Trash2 size={18} />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </DashboardLayout>
  );
}