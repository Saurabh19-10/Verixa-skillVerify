import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { searchDevelopers } from "../../api/recruiterApi";
import { useRecruiter } from "../../context/RecruiterContext";

import {
  BadgeCheck,
  Trophy,
  GitCompare,
  Star,
  CheckCircle2,
} from "lucide-react";

function getId(dev) {
  return dev?._id || dev?.id;
}

function getStats(dev) {
  return {
    trustScore: dev?.trustScore || 0,
    githubScore: dev?.githubScore || 0,
    assessmentScore: dev?.assessmentScore || 0,
    projects: dev?.projectsCount || 0,
    verified: (dev?.trustScore || 0) >= 70,
  };
}

export default function CompareDevelopers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { compareIds, addToShortlist, isShortlisted } =
    useRecruiter();

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idA, setIdA] = useState(searchParams.get("a") || "");
  const [idB, setIdB] = useState(searchParams.get("b") || "");

  const [justShortlisted, setJustShortlisted] = useState(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const data = await searchDevelopers();
        setDevelopers(data);

        if (!idA && data[0]) {
          setIdA(getId(data[0]));
        }

        if (!idB && data[1]) {
          setIdB(getId(data[1]));
        }
      } catch (error) {
        console.error("Compare developers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  useEffect(() => {
    if (!idA && compareIds[0]) setIdA(compareIds[0]);
    if (!idB && compareIds[1]) setIdB(compareIds[1]);
  }, [compareIds, idA, idB]);

  useEffect(() => {
    if (idA && idB) {
      setSearchParams({ a: idA, b: idB }, { replace: true });
      setJustShortlisted(null);
    }
  }, [idA, idB, setSearchParams]);

  const developerA = useMemo(
    () =>
      developers.find(
        (dev) => String(getId(dev)) === String(idA)
      ),
    [developers, idA]
  );

  const developerB = useMemo(
    () =>
      developers.find(
        (dev) => String(getId(dev)) === String(idB)
      ),
    [developers, idB]
  );

  const statsA = getStats(developerA);
  const statsB = getStats(developerB);

  const comparisonMetrics = [
    {
      label: "Trust Score",
      a: statsA.trustScore,
      b: statsB.trustScore,
    },
    {
      label: "GitHub Score",
      a: statsA.githubScore,
      b: statsB.githubScore,
    },
    {
      label: "Assessment Score",
      a: statsA.assessmentScore,
      b: statsB.assessmentScore,
    },
    {
      label: "Projects",
      a: statsA.projects,
      b: statsB.projects,
    },
  ];

  const scoreA =
    statsA.trustScore +
    statsA.githubScore +
    statsA.assessmentScore +
    statsA.projects * 5;

  const scoreB =
    statsB.trustScore +
    statsB.githubScore +
    statsB.assessmentScore +
    statsB.projects * 5;

  const recommended =
    scoreA >= scoreB ? developerA : developerB;

  const handleShortlistRecommended = () => {
    if (!recommended) return;

    const id = getId(recommended);

    addToShortlist(id);
    setJustShortlisted(id);
  };

  if (loading) {
    return (
      <DashboardLayout recruiter>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Loading developers...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!developerA || !developerB) {
    return (
      <DashboardLayout recruiter>
        <Card className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Need at least two developers to compare.
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout recruiter>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
          <GitCompare className="text-blue-500" />
          Compare Developers
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Compare developers side-by-side using trust scores,
          AI signals, skills and project quality.
        </p>
      </div>

      <Card className="mb-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
              Developer A
            </label>

            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {developers.map((dev) => (
                <option key={getId(dev)} value={getId(dev)}>
                  {dev.name} — {dev.title || "Developer"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
              Developer B
            </label>

            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {developers.map((dev) => (
                <option key={getId(dev)} value={getId(dev)}>
                  {dev.name} — {dev.title || "Developer"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeveloperCompareCard
          developer={developerA}
          stats={statsA}
          color="blue"
          shortlisted={
            isShortlisted(getId(developerA)) ||
            justShortlisted === getId(developerA)
          }
        />

        <DeveloperCompareCard
          developer={developerB}
          stats={statsB}
          color="purple"
          shortlisted={
            isShortlisted(getId(developerB)) ||
            justShortlisted === getId(developerB)
          }
        />
      </div>

      <Card className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Performance Comparison
        </h2>

        <div className="space-y-5">
          {comparisonMetrics.map((metric) => (
            <div
              key={metric.label}
              className="grid grid-cols-3 items-center gap-4"
            >
              <div
                className={`text-center font-bold ${
                  metric.a > metric.b
                    ? "text-green-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {metric.a}
              </div>

              <div className="text-center text-slate-600 dark:text-slate-400">
                {metric.label}
              </div>

              <div
                className={`text-center font-bold ${
                  metric.b > metric.a
                    ? "text-green-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {metric.b}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SkillsCard developer={developerA} color="blue" />
        <SkillsCard developer={developerB} color="purple" />
      </div>

      <Card className="mt-8">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-400" />

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Recommendation
          </h2>
        </div>

        <p className="mt-4 text-slate-700 dark:text-slate-300">
          Based on trust score, GitHub score, assessment
          performance and verified projects,
          <span className="font-semibold text-green-400">
            {" "}
            {recommended?.name}
          </span>{" "}
          currently demonstrates a stronger overall profile
          for hiring consideration.
        </p>

        <div className="mt-6">
          {isShortlisted(getId(recommended)) ||
          justShortlisted === getId(recommended) ? (
            <Button variant="secondary" disabled>
              <CheckCircle2 size={18} />
              Shortlisted
            </Button>
          ) : (
            <Button onClick={handleShortlistRecommended}>
              <Star size={18} />
              Shortlist Recommended Candidate
            </Button>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

function DeveloperCompareCard({
  developer,
  stats,
  color,
  shortlisted,
}) {
  const borderColor =
    color === "blue"
      ? "border-blue-500"
      : "border-purple-500";

  return (
    <Card>
      <div className="flex flex-col items-center text-center">
        <img
          src={
            developer.avatar ||
            "https://i.pravatar.cc/150?img=12"
          }
          alt={developer.name}
          className={`h-24 w-24 rounded-full border-4 ${borderColor}`}
        />

        <div className="mt-4 flex items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {developer.name}
          </h2>

          {stats.verified && (
            <BadgeCheck size={20} className="text-green-400" />
          )}
        </div>

        <p className="text-slate-600 dark:text-slate-400">
          {developer.title || "Developer"}
        </p>

        {shortlisted && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-500">
            <Star size={14} />
            Shortlisted
          </span>
        )}

        <div className="mt-6 grid w-full grid-cols-2 gap-4">
          <MiniStat label="Trust" value={stats.trustScore} />
          <MiniStat label="GitHub" value={stats.githubScore} />
          <MiniStat label="Assessment" value={stats.assessmentScore} />
          <MiniStat label="Projects" value={stats.projects} />
        </div>
      </div>
    </Card>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
      <p className="text-sm text-slate-500">{label}</p>

      <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

function SkillsCard({ developer, color }) {
  const colorClass =
    color === "blue"
      ? "bg-blue-500/10 text-blue-400"
      : "bg-purple-500/10 text-purple-400";

  return (
    <Card>
      <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
        {developer.name} Skills
      </h3>

      {developer.skills?.length ? (
        <div className="flex flex-wrap gap-2">
          {developer.skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-full px-3 py-1 text-sm ${colorClass}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          No skills added yet.
        </p>
      )}
    </Card>
  );
}