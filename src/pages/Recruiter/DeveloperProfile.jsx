import { useParams, useNavigate, Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import developers from "../../data/developers";
import {
  getDeveloperById,
  getDeveloperStats,
} from "../../utils/developerStats";
import {
  useRecruiter,
  PIPELINE_STAGES,
} from "../../context/RecruiterContext";

import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Mail,
  GitBranch,
  Star,
  GitCompare,
  ShieldCheck,
  FolderGit2,
  ClipboardCheck,
} from "lucide-react";

export default function DeveloperProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isShortlisted,
    toggleShortlist,
    isComparing,
    toggleCompare,
    compareIds,
    getStage,
    setStage,
  } = useRecruiter();

  const dev = getDeveloperById(developers, id);

  if (!dev) {
    return (
      <DashboardLayout recruiter>
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Developer not found.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/recruiter/search")}>
              <ArrowLeft size={18} />
              Back To Search
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const stats = getDeveloperStats(dev);
  const shortlisted = isShortlisted(dev.id);
  const comparing = isComparing(dev.id);
  const compareFull =
    compareIds.length >= 2 && !comparing;

  return (
    <DashboardLayout recruiter>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-500"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <Card className="mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={dev.avatar}
              alt={dev.name}
              className="h-24 w-24 rounded-full border border-slate-300 dark:border-slate-700"
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dev.name}
                </h1>

                {stats.verified && (
                  <BadgeCheck
                    size={20}
                    className="text-green-400"
                  />
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400">
                {dev.role}
              </p>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {dev.location}
                </span>

                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  {dev.email}
                </span>
              </div>

              {shortlisted && (
                <div className="mt-3 flex items-center gap-3">
                  <Badge variant="purple">
                    Pipeline: {getStage(dev.id)}
                  </Badge>

                  <select
                    value={getStage(dev.id)}
                    onChange={(e) =>
                      setStage(dev.id, e.target.value)
                    }
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                  >
                    {PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={shortlisted ? "secondary" : "primary"}
              onClick={() => toggleShortlist(dev.id)}
            >
              <Star size={18} />
              {shortlisted ? "Shortlisted" : "Shortlist"}
            </Button>

            <Button
              variant={comparing ? "secondary" : "outline"}
              disabled={compareFull}
              onClick={() => toggleCompare(dev.id)}
            >
              <GitCompare size={18} />
              {comparing ? "Remove From Compare" : "Add To Compare"}
            </Button>

            {compareIds.length === 2 && (
              <Button
                variant="success"
                onClick={() =>
                  navigate(
                    `/recruiter/compare?a=${compareIds[0]}&b=${compareIds[1]}`
                  )
                }
              >
                Compare Now
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Trust Score
          </p>
          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {stats.trustScore}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            GitHub Score
          </p>
          <h3 className="mt-2 text-3xl font-bold text-blue-400">
            {stats.githubScore}%
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Projects
          </p>
          <h3 className="mt-2 text-3xl font-bold text-purple-400">
            {stats.projects}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Assessment Avg
          </p>
          <h3 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats.assessmentScore}%
          </h3>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* GitHub */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <GitBranch size={20} className="text-blue-500" />
            GitHub Activity
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Repos
              </p>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {dev.github.repos}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Commits
              </p>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {dev.github.commits}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Stars
              </p>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {dev.github.stars}
              </h4>
            </div>
          </div>

          <a
            href={`https://github.com/${dev.github.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:underline"
          >
            <GitBranch size={16} />
            github.com/{dev.github.username}
          </a>
        </Card>

        {/* Assessments & Experience */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <ClipboardCheck size={20} className="text-purple-500" />
            Assessments & Experience
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Experience
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {dev.experience}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Assessments Completed
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {dev.assessments.completed}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Average Score
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {dev.assessments.averageScore}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Verification
              </span>
              <span className="flex items-center gap-1 font-semibold text-green-400">
                <ShieldCheck size={16} />
                {stats.verified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills */}
      <Card className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
          <FolderGit2 size={20} className="text-blue-500" />
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {dev.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {shortlisted && (
        <div className="mt-8 text-center">
          <Link
            to="/recruiter/shortlist"
            className="text-sm font-medium text-blue-500 hover:underline"
          >
            View in Shortlisted Candidates →
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
