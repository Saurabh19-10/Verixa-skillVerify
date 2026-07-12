import { useState, useEffect, useMemo } from "react";
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
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  Trophy,
  Zap,
  GitBranch,
  Code2,
  Briefcase,
  TrendingUp,
  Users,
} from "lucide-react";

function getId(dev) {
  return dev._id || dev.id;
}

function getStats(dev) {
  return {
    trustScore: dev.trustScore || 0,
    githubScore: dev.githubScore || 0,
    verified: (dev.trustScore || 0) >= 70,
  };
}

function getAllSkills(devs) {
  const set = new Set();
  devs.forEach((d) => d.skills?.forEach((s) => set.add(s)));
  return [...set].sort();
}

function recommendCandidates(devs, selectedSkills, count = 3) {
  return [...devs]
    .map((d) => {
      const match =
        d.skills?.filter((s) => selectedSkills.includes(s)).length || 0;

      return {
        ...d,
        _score: (d.trustScore || 0) + match * 10,
      };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, count)
    .map((d) => getId(d));
}

function buildCSV(devs) {
  const header =
    "Name,Title,Email,Trust Score,GitHub Score,Verified,Skills";

  const rows = devs.map((dev) => {
    const stats = getStats(dev);

    return [
      `"${dev.name || ""}"`,
      `"${dev.title || "Developer"}"`,
      `"${dev.email || ""}"`,
      stats.trustScore,
      stats.githubScore,
      stats.verified ? "Yes" : "No",
      `"${dev.skills?.join(", ") || ""}"`,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

function downloadFile(content, filename, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function trustColor(score) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-blue-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function trustBg(score) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-blue-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function DeveloperCard({
  dev,
  stats,
  isRecommended,
  selectedSkills,
  shortlisted,
  onToggleShortlist,
  comparing,
  compareFull,
  onToggleCompare,
  onView,
}) {
  const devId = getId(dev);

  const skillMatchCount =
    dev.skills?.filter((s) => selectedSkills.includes(s)).length || 0;

  return (
    <div
      className={`
        relative rounded-2xl border bg-white transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-xl
        dark:bg-slate-900
        ${
          isRecommended && selectedSkills.length > 0
            ? "border-purple-400/50 dark:border-purple-700"
            : "border-slate-200 dark:border-slate-800"
        }
      `}
    >
      {isRecommended && selectedSkills.length > 0 && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/30">
          <Zap size={10} />
          AI Pick
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={
                dev.avatar ||
                "https://i.pravatar.cc/150?img=12"
              }
              alt={dev.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />

            {stats.verified && (
              <div className="absolute -bottom-1.5 -right-1.5 rounded-full bg-white p-0.5 dark:bg-slate-900">
                <BadgeCheck size={16} className="text-emerald-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                {dev.name}
              </h3>

              {stats.verified && (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                  Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {dev.title || "Developer"}
            </p>

            <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {dev.location || "India"}
              </span>

              <span className="flex items-center gap-1">
                <Briefcase size={11} />
                {dev.experience || "Fresher"}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-center">
            <div className={`text-2xl font-black ${trustColor(stats.trustScore)}`}>
              {stats.trustScore}
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Trust
            </p>

            <div className="mt-1 h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${trustBg(stats.trustScore)}`}
                style={{ width: `${stats.trustScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <GitBranch size={13} className="mx-auto mb-1 text-blue-400" />
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {dev.githubRepos || 0}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Repos
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <Code2 size={13} className="mx-auto mb-1 text-green-400" />
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {dev.projectsCount || 0}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Projects
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <TrendingUp size={13} className="mx-auto mb-1 text-purple-400" />
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {stats.githubScore}%
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              GitHub
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {dev.skills?.length ? (
            dev.skills.map((skill) => {
              const highlighted = selectedSkills.includes(skill);

              return (
                <span
                  key={skill}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    highlighted
                      ? "bg-blue-500 text-white"
                      : "border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {skill}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-slate-500">
              No skills added
            </span>
          )}

          {selectedSkills.length > 0 && skillMatchCount > 0 && (
            <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
              {skillMatchCount}/{selectedSkills.length} match
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1" onClick={onView}>
            <Eye size={15} />
            View
          </Button>

          <Button
            size="sm"
            variant={comparing ? "secondary" : "outline"}
            disabled={compareFull}
            onClick={() => onToggleCompare(devId)}
            className="flex-1"
          >
            <GitCompare size={15} />
            {comparing ? "Remove" : "Compare"}
          </Button>

          <Button
            size="sm"
            variant={shortlisted ? "success" : "outline"}
            onClick={() => onToggleShortlist(devId)}
            className="flex-1"
          >
            <Star size={15} fill={shortlisted ? "currentColor" : "none"} />
            {shortlisted ? "Saved" : "Shortlist"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SearchDevelopers() {
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minTrust, setMinTrust] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [exportSuccess, setExportSuccess] = useState("");

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
        console.error("Developer search error:", error);
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
      const isVerified = (dev.trustScore || 0) >= 70;

      if (statusFilter === "verified" && !isVerified) {
        return false;
      }

      return true;
    });
  }, [developers, statusFilter]);

  const recommendedIds = useMemo(
    () => recommendCandidates(filteredDevelopers, selectedSkills),
    [filteredDevelopers, selectedSkills]
  );

  const verifiedCount = developers.filter(
    (d) => (d.trustScore || 0) >= 70
  ).length;

  const avgTrustScore =
    developers.length > 0
      ? Math.round(
          developers.reduce((sum, d) => sum + (d.trustScore || 0), 0) /
            developers.length
        )
      : 0;

  const activeFilterCount =
    selectedSkills.length +
    (statusFilter ? 1 : 0) +
    (minTrust > 0 ? 1 : 0);

  const targets = filteredDevelopers;

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setSelectedSkills([]);
    setMinTrust(0);
    setStatusFilter(null);
    setSearch("");
  };

  const flash = (msg) => {
    setExportSuccess(msg);
    setTimeout(() => setExportSuccess(""), 3000);
  };

  const handleExport = () => {
    downloadFile(
      buildCSV(targets),
      `verixa-candidates-${new Date().toISOString().slice(0, 10)}.csv`
    );

    flash("CSV exported successfully!");
  };

  const handleDownloadReport = () => {
    const lines = [
      "Verixa Candidate Report",
      `Generated: ${new Date().toLocaleString()}`,
      `Candidates: ${targets.length}`,
      "",
      ...targets.map((dev) => {
        const stats = getStats(dev);

        return [
          `Name      : ${dev.name}`,
          `Title     : ${dev.title || "Developer"}`,
          `Email     : ${dev.email || ""}`,
          `Trust     : ${stats.trustScore}%`,
          `Verified  : ${stats.verified ? "Yes" : "No"}`,
          `Skills    : ${dev.skills?.join(", ") || "None"}`,
          "",
        ].join("\n");
      }),
    ];

    downloadFile(
      lines.join("\n"),
      `verixa-report-${new Date().toISOString().slice(0, 10)}.txt`,
      "text/plain"
    );

    flash("Report downloaded!");
  };

  const handleGenerateReport = () => {
    const content = [
      "VERIXA - AI GENERATED RECRUITMENT REPORT",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Top Candidates:",
      ...recommendedIds.map((id) => {
        const dev = developers.find((d) => getId(d) === id);

        return dev
          ? `- ${dev.name} | ${dev.title || "Developer"} | Trust ${
              dev.trustScore || 0
            }`
          : "";
      }),
    ].join("\n");

    downloadFile(
      content,
      `verixa-ai-report-${new Date().toISOString().slice(0, 10)}.txt`,
      "text/plain"
    );

    flash("AI Report generated!");
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
            Filter by skills, trust score, and verified profiles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <FileText size={16} />
            Download Report
          </Button>

          <Button size="sm" onClick={handleGenerateReport}>
            <Sparkles size={16} />
            Generate AI Report
          </Button>
        </div>
      </div>

      {exportSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          <BadgeCheck size={16} />
          {exportSuccess}
        </div>
      )}

      {compareIds.length > 0 && (
        <Card className="mb-6 !py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <GitCompare size={18} className="text-blue-500" />
              {compareIds.length === 1
                ? "1 developer selected for comparison. Pick one more."
                : "2 developers selected for comparison."}
            </div>

            <div className="flex gap-3">
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
                Compare Selected
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
            onClick={() => setShowFilters((prev) => !prev)}
            variant="outline"
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          <Button>
            <Search size={18} />
            Search
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-5 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div>
              <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Filter size={14} />
                Filter by Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => {
                  const active = selectedSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        active
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-transparent bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Min Trust Score:{" "}
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

            <button
              onClick={() =>
                setStatusFilter((prev) =>
                  prev === "verified" ? null : "verified"
                )
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                statusFilter === "verified"
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-transparent bg-green-500/10 text-green-400"
              }`}
            >
              <BadgeCheck size={14} />
              Verified Only
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-slate-500 underline"
              >
                Reset all filters
              </button>
            )}
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

              <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                {verifiedCount}
              </h3>
            </div>

            <BadgeCheck className="text-emerald-400" size={28} />
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
        <Card className="mb-6 border-2 border-purple-500/30 bg-purple-500/5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Sparkles size={18} className="text-purple-400" />
            AI-Recommended Candidates
          </h2>

          <div className="flex flex-wrap gap-3">
            {recommendedIds.map((id) => {
              const dev = developers.find((d) => getId(d) === id);
              if (!dev) return null;

              const stats = getStats(dev);

              return (
                <div
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-purple-200 bg-white px-4 py-3 transition hover:border-purple-400 dark:border-purple-900 dark:bg-slate-900"
                  onClick={() => navigate(`/recruiter/developer/${getId(dev)}`)}
                >
                  <img
                    src={
                      dev.avatar ||
                      "https://i.pravatar.cc/150?img=12"
                    }
                    alt={dev.name}
                    className="h-10 w-10 rounded-xl"
                  />

                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {dev.name}
                      {stats.verified && (
                        <BadgeCheck size={14} className="text-emerald-400" />
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      {dev.title || "Developer"}
                    </p>

                    <p className="mt-0.5 text-xs text-purple-400">
                      Trust {stats.trustScore}%
                    </p>
                  </div>

                  <Trophy size={16} className="ml-2 text-yellow-400" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {filteredDevelopers.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No developers match your current filters.{" "}
            <button onClick={resetFilters} className="text-blue-500 underline">
              Reset filters
            </button>
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredDevelopers.map((dev) => {
            const devId = getId(dev);
            const stats = getStats(dev);

            const shortlisted = isShortlisted(devId);
            const comparing = isComparing(devId);
            const compareFull = compareIds.length >= 2 && !comparing;
            const isRecommended = recommendedIds.includes(devId);

            return (
              <DeveloperCard
                key={devId}
                dev={dev}
                stats={stats}
                isRecommended={isRecommended}
                selectedSkills={selectedSkills}
                shortlisted={shortlisted}
                onToggleShortlist={toggleShortlist}
                comparing={comparing}
                compareFull={compareFull}
                onToggleCompare={toggleCompare}
                onView={() => navigate(`/recruiter/developer/${devId}`)}
              />
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}