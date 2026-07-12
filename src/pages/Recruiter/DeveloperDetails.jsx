import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { getDeveloperDetails } from "../../api/recruiterApi";

import {
    BadgeCheck,
    Mail,
    MapPin,
    GitBranch,
    Globe,
    Brain,
    FolderGit2,
    Star,
    AlertTriangle,
    CheckCircle,
  } from "lucide-react";
  import { FaGithub } from "react-icons/fa";
export default function DeveloperDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const result = await getDeveloperDetails(id);
        setData(result);
      } catch (error) {
        console.error("Developer details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout recruiter>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading developer profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.developer) {
    return (
      <DashboardLayout recruiter>
        <Card className="text-center">
          <p className="text-red-400">Developer not found.</p>
        </Card>
      </DashboardLayout>
    );
  }

  const { developer, projects = [], aiReview } = data;

  return (
    <DashboardLayout recruiter>
      <Card className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <img
              src={developer.avatar || "https://i.pravatar.cc/200?img=12"}
              alt={developer.name}
              className="h-28 w-28 rounded-full border-4 border-blue-500"
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {developer.name}
                </h1>

                {(developer.trustScore || 0) >= 70 && (
                  <BadgeCheck size={24} className="text-green-400" />
                )}
              </div>

              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                {developer.title || "Developer"}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  India
                </span>

                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {developer.email}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">Trust Score</p>
            <h2 className="text-6xl font-bold text-blue-500">
              {developer.trustScore || 0}
            </h2>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            About
          </h2>

          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {developer.bio || "No bio added yet."}
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Links
          </h2>

          <div className="space-y-3">
            {developer.github && (
              <a
                href={developer.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-400"
              >
               <FaGithub size={18} />
                GitHub
              </a>
            )}

            {developer.portfolio && (
              <a
                href={developer.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-400"
              >
                <Globe size={18} />
                Portfolio
              </a>
            )}

            {!developer.github && !developer.portfolio && (
              <p className="text-slate-500">No links added.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {developer.skills?.length ? (
            developer.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-slate-500">No skills added yet.</p>
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <FolderGit2 className="text-purple-400" />
          Verified Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-slate-500">No projects found.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {project.description}
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech?.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="mb-1 text-sm text-slate-500">
                    Verification Score: {project.verificationScore || 0}%
                  </p>

                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${project.verificationScore || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Brain className="text-blue-400" />
          AI Review
        </h2>

        {!aiReview ? (
          <p className="text-slate-500">
            AI review not generated yet.
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <MiniScore label="Overall" value={aiReview.overallScore} />
              <MiniScore label="Projects" value={aiReview.projectScore} />
              <MiniScore label="GitHub" value={aiReview.githubScore} />
              <MiniScore label="Coding" value={aiReview.codingScore} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <CheckCircle className="text-green-400" />
                  Strengths
                </h3>

                <div className="space-y-2">
                  {aiReview.strengths?.map((item) => (
                    <p
                      key={item}
                      className="rounded-xl bg-green-500/10 p-3 text-sm text-green-400"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <AlertTriangle className="text-yellow-400" />
                  Weaknesses
                </h3>

                <div className="space-y-2">
                  {aiReview.weaknesses?.map((item) => (
                    <p
                      key={item}
                      className="rounded-xl bg-yellow-500/10 p-3 text-sm text-yellow-400"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button>
          <Star size={18} />
          Shortlist Candidate
        </Button>

        <Button variant="secondary">
          Download Report
        </Button>
      </div>
    </DashboardLayout>
  );
}

function MiniScore({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
      <p className="text-sm text-slate-500">{label}</p>

      <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {value || 0}%
      </h3>
    </div>
  );
}