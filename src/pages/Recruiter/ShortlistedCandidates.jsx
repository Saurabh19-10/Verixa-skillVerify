import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { searchDevelopers } from "../../api/recruiterApi";
import { useRecruiter } from "../../context/RecruiterContext";

import {
  Search,
  BadgeCheck,
  MapPin,
  Eye,
  GitCompare,
  Star,
  X,
  SlidersHorizontal,
  Download,
  Sparkles,
  Zap,
  GitBranch,
  Code2,
  TrendingUp,
  Users,
  Filter,
} from "lucide-react";

const getId = (dev) => dev?._id || dev?.id;

const getStats = (dev) => ({
  trustScore: dev?.trustScore || 0,
  githubScore: dev?.githubScore || 0,
  projects: dev?.projectsCount || 0,
  verified: (dev?.trustScore || 0) >= 70,
});

const trustColor = (score) => {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-blue-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const trustBg = (score) => {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-blue-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const getAllSkills = (developers) => {
  const skills = new Set();

  developers.forEach((dev) => {
    dev.skills?.forEach((skill) => skills.add(skill));
  });

  return Array.from(skills).sort();
};

const downloadCSV = (developers) => {
  const header = "Name,Email,Title,Trust Score,Skills";

  const rows = developers.map((dev) =>
    [
      `"${dev.name || ""}"`,
      `"${dev.email || ""}"`,
      `"${dev.title || "Developer"}"`,
      dev.trustScore || 0,
      `"${dev.skills?.join(", ") || ""}"`,
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `verixa-developers-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

function DeveloperCard({
  dev,
  selectedSkills,
  shortlisted,
  comparing,
  compareFull,
  onView,
  onToggleShortlist,
  onToggleCompare,
}) {
  const id = getId(dev);
  const stats = getStats(dev);

  const matchedSkills =
    dev.skills?.filter((skill) => selectedSkills.includes(skill)) || [];

  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={dev.avatar || "https://i.pravatar.cc/150?img=12"}
              alt={dev.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />

            {stats.verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 dark:bg-slate-900">
                <BadgeCheck size={16} className="text-green-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {dev.name}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {dev.title || "Developer"}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={13} />
              {dev.location || "India"}
            </p>
          </div>

          <div className="text-center">
            <h4 className={`text-2xl font-black ${trustColor(stats.trustScore)}`}>
              {stats.trustScore}
            </h4>

            <p className="text-xs text-slate-500">Trust</p>

            <div className="mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full ${trustBg(stats.trustScore)}`}
                style={{ width: `${stats.trustScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
            <GitBranch size={16} className="mx-auto text-blue-400" />
            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {stats.githubScore}%
            </p>
            <p className="text-xs text-slate-500">GitHub</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
            <Code2 size={16} className="mx-auto text-green-400" />
            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {stats.projects}
            </p>
            <p className="text-xs text-slate-500">Projects</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
            <TrendingUp size={16} className="mx-auto text-purple-400" />
            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {stats.verified ? "Yes" : "No"}
            </p>
            <p className="text-xs text-slate-500">Verified</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {dev.skills?.length ? (
            dev.skills.map((skill) => {
              const active = selectedSkills.includes(skill);

              return (
                <span
                  key={skill}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    active
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {skill}
                </span>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No skills added</p>
          )}

          {matchedSkills.length > 0 && (
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
              {matchedSkills.length} matched
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onView}>
            <Eye size={16} />
            View
          </Button>

          <Button
            size="sm"
            variant={comparing ? "secondary" : "outline"}
            disabled={compareFull}
            onClick={() => onToggleCompare(id)}
          >
            <GitCompare size={16} />
            {comparing ? "Remove" : "Compare"}
          </Button>

          <Button
            size="sm"
            variant={shortlisted ? "success" : "outline"}
            onClick={() => onToggleShortlist(id)}
          >
            <Star size={16} fill={shortlisted ? "currentColor" : "none"} />
            {shortlisted ? "Saved" : "Shortlist"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function SearchDevelopers() {
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minTrust, setMinTrust] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState("");

  const {
    isShortlisted,
    toggleShortlist,
    isComparing,
    toggleCompare,
    compareIds,
    clearCompare,
  } = useRecruiter();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);

        const data = await searchDevelopers(
          search,
          selectedSkills[0] || "",
          minTrust || ""
        );

        setDevelopers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, [search, selectedSkills, minTrust]);

  const allSkills = useMemo(
    () => getAllSkills(developers),
    [developers]
  );

  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      const stats = getStats(dev);

      if (verifiedOnly && !stats.verified) return false;

      if (
        selectedSkills.length &&
        !selectedSkills.every((skill) => dev.skills?.includes(skill))
      ) {
        return false;
      }

      return true;
    });
  }, [developers, selectedSkills, verifiedOnly]);

  const recommendedDevelopers = useMemo(() => {
    return [...filteredDevelopers]
      .sort((a, b) => {
        const scoreA =
          (a.trustScore || 0) +
          (selectedSkills.filter((s) => a.skills?.includes(s)).length * 10);

        const scoreB =
          (b.trustScore || 0) +
          (selectedSkills.filter((s) => b.skills?.includes(s)).length * 10);

        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, [filteredDevelopers, selectedSkills]);

  const verifiedCount = developers.filter(
    (dev) => getStats(dev).verified
  ).length;

  const avgTrustScore =
    developers.length > 0
      ? Math.round(
          developers.reduce((sum, dev) => sum + (dev.trustScore || 0), 0) /
            developers.length
        )
      : 0;

  const activeFilterCount =
    selectedSkills.length + (verifiedOnly ? 1 : 0) + (minTrust > 0 ? 1 : 0);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedSkills([]);
    setMinTrust(0);
    setVerifiedOnly(false);
  };

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleExport = () => {
    downloadCSV(filteredDevelopers);
    flash("CSV exported successfully!");
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

  return (
    <DashboardLayout recruiter>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Search Developers
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Search verified developers by skills, trust score and profile quality.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              flash("AI report generated for visible developers!");
            }}
          >
            <Sparkles size={16} />
            AI Report
          </Button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {message}
        </div>
      )}

      {compareIds.length > 0 && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {compareIds.length === 1
                ? "1 developer selected for comparison. Pick one more."
                : "2 developers selected for comparison."}
            </p>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={clearCompare}>
                <X size={16} />
                Clear
              </Button>

              <Button
                size="sm"
                disabled={compareIds.length < 2}
                onClick={() =>
                  navigate(`/recruiter/compare?a=${compareIds[0]}&b=${compareIds[1]}`)
                }
              >
                <GitCompare size={16} />
                Compare
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search by name, title, bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button>
            <Search size={18} />
            Search
          </Button>
        </div>

        {showFilters && (
          <div className="mt-5 space-y-5 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Filter size={15} />
                Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {allSkills.length ? (
                  allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedSkills.includes(skill)
                          ? "bg-blue-500 text-white"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills available yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Minimum Trust Score:{" "}
                <span className="text-blue-400">{minTrust}%</span>
              </p>

              <input
                type="range"
                min={0}
                max={100}
                value={minTrust}
                onChange={(e) => setMinTrust(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setVerifiedOnly((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                  verifiedOnly
                    ? "bg-green-500 text-white"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                <BadgeCheck size={16} />
                Verified Only
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-slate-500 underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Total Developers
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {developers.length}
              </h3>
            </div>

            <Users className="text-blue-400" size={28} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Verified Profiles
              </p>

              <h3 className="mt-2 text-3xl font-bold text-green-400">
                {verifiedCount}
              </h3>
            </div>

            <BadgeCheck className="text-green-400" size={28} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                Average Trust Score
              </p>

              <h3 className="mt-2 text-3xl font-bold text-blue-400">
                {avgTrustScore}%
              </h3>
            </div>

            <TrendingUp className="text-blue-400" size={28} />
          </div>
        </Card>
      </div>

      {(selectedSkills.length > 0 || minTrust > 0) && (
        <Card className="mb-8 border-2 border-purple-500/30 bg-purple-500/5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Sparkles size={18} className="text-purple-400" />
            AI Recommended Candidates
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {recommendedDevelopers.map((dev) => (
              <div
                key={getId(dev)}
                onClick={() => navigate(`/recruiter/developer/${getId(dev)}`)}
                className="cursor-pointer rounded-xl border border-purple-200 bg-white p-4 transition hover:border-purple-500 dark:border-purple-900 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dev.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={dev.name}
                    className="h-10 w-10 rounded-xl"
                  />

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {dev.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Trust {dev.trustScore || 0}
                    </p>
                  </div>

                  <Zap size={16} className="ml-auto text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filteredDevelopers.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No developers found.
          </p>

          <Button className="mt-5" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredDevelopers.map((dev) => {
            const id = getId(dev);
            const shortlisted = isShortlisted(id);
            const comparing = isComparing(id);
            const compareFull = compareIds.length >= 2 && !comparing;

            return (
              <DeveloperCard
                key={id}
                dev={dev}
                selectedSkills={selectedSkills}
                shortlisted={shortlisted}
                comparing={comparing}
                compareFull={compareFull}
                onView={() => navigate(`/recruiter/developer/${id}`)}
                onToggleShortlist={toggleShortlist}
                onToggleCompare={toggleCompare}
              />
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}