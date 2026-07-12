import { useState, useRef, useEffect } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import developers from "../../data/developers";
import { getDeveloperStats } from "../../utils/developerStats";

import {
  Download,
  FileText,
  Users,
  BadgeCheck,
  TrendingUp,
  BarChart3,
  Trophy,
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  Bot,
  CheckSquare,
  Square,
  X,
  Check,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function buildCSV(devs) {
  const header =
    "Name,Role,Location,Trust Score,GitHub Score,Verified,Skills,Experience,Projects,Avg Assessment";
  const rows = devs.map((dev) => {
    const stats = getDeveloperStats(dev);
    return [
      `"${dev.name}"`,
      `"${dev.role}"`,
      `"${dev.location}"`,
      stats.trustScore,
      stats.githubScore,
      stats.verified ? "Yes" : "No",
      `"${dev.skills.join(", ")}"`,
      `"${dev.experience}"`,
      dev.projects,
      dev.assessments?.averageScore ?? 0,
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

function downloadFile(content, filename, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const today = new Date();
const dateStr = today.toISOString().slice(0, 10);
const dateLabel = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
});

const verifiedDevs = developers.filter((d) => d.github?.verified);
const avgTrust = Math.round(
  developers.reduce((s, d) => s + d.trustScore, 0) / developers.length
);

// ── Dropdown Button Component ─────────────────────────────────────────────────

function DropdownMenu({ label, icon: Icon, variant = "primary", items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant={variant}
        onClick={() => setOpen(!open)}
      >
        {Icon && <Icon size={18} />}
        {label}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <div className="
          absolute right-0 mt-2 z-50
          w-56
          rounded-2xl
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          shadow-2xl overflow-hidden
        ">
          {items.map((item, i) => (
            item === "divider" ? (
              <div key={i} className="border-t border-slate-200 dark:border-slate-800 my-1" />
            ) : (
              <button
                key={i}
                onClick={() => { item.onClick(); setOpen(false); }}
                className="
                  flex items-center gap-3 w-full px-4 py-3
                  text-sm text-slate-700 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  hover:text-slate-900 dark:hover:text-white
                  transition-colors text-left
                "
              >
                {item.icon && <item.icon size={16} className={item.iconClass || "text-slate-500"} />}
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>}
                </div>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Report Modal ───────────────────────────────────────────────────────────

function AIReportModal({ onClose }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState([]);

  const insights = [
    "📊 Analyzing developer pool of " + developers.length + " profiles...",
    "🔍 Cross-referencing GitHub activity and commit history...",
    "🧠 Running ML model on trust score distribution...",
    "✅ Verified developers: " + verifiedDevs.length + " (" + Math.round(verifiedDevs.length / developers.length * 100) + "%)",
    "📈 Average trust score: " + avgTrust + "% — Above industry benchmark",
    "🏆 Top skill demand: React + Node.js (67% of job postings)",
    "⚡ AI Recommendation: Focus on MERN stack developers for Q3 hiring",
    "💡 Insight: Developers with Trust Score > 90 close 2.4x faster",
    "🎯 Predicted hire success rate: 78% with current shortlist",
    "✨ AI Report generation complete.",
  ];

  const start = () => {
    setGenerating(true);
    setLines([]);
    insights.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === insights.length - 1) {
          setDone(true);
          setGenerating(false);
        }
      }, i * 400);
    });
  };

  const download = () => {
    const content = [
      "VERIXA — AI-GENERATED RECRUITMENT REPORT",
      `Generated: ${today.toLocaleString()}`,
      "=".repeat(55),
      "",
      ...insights.map((l) => l.replace(/^[^\s]+\s/, "")),
      "",
      "=".repeat(55),
      "END OF AI REPORT",
    ].join("\n");
    downloadFile(content, `ai-report-${dateStr}.txt`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bot size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">AI Report Generator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Verixa AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {!generating && !done && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🤖</div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                AI will analyze your developer pool, trust scores, GitHub data, and hiring metrics to generate a comprehensive report.
              </p>
              <Button onClick={start}>
                <Sparkles size={18} />
                Generate AI Report
              </Button>
            </div>
          )}

          {(generating || done) && (
            <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
              {lines.map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-300">
                  <span>{line}</span>
                </div>
              ))}
              {generating && (
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-1.5 h-4 bg-purple-400 rounded animate-pulse" />
                </div>
              )}
            </div>
          )}

          {done && (
            <div className="mt-5 flex gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
              <Button onClick={download} className="flex-1">
                <Download size={16} />
                Download Report
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── component ────────────────────────────────────────────────────────────────

export default function Reports() {
  const [flash, setFlash] = useState("");
  const [generatingIdx, setGeneratingIdx] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3000);
  };

  // Export options
  const handleExportCSV = () => {
    downloadFile(buildCSV(developers), `verixa-all-developers-${dateStr}.csv`, "text/csv");
    showFlash("All developers exported as CSV!");
  };

  const handleExportJSON = () => {
    downloadFile(
      JSON.stringify(developers.map((d) => ({ ...d, stats: getDeveloperStats(d) })), null, 2),
      `verixa-all-developers-${dateStr}.json`,
      "application/json"
    );
    showFlash("Data exported as JSON!");
  };

  const handleExportSummary = () => {
    const lines = [
      "VERIXA PLATFORM SUMMARY",
      `Exported: ${today.toLocaleString()}`,
      "=".repeat(40),
      `Total Developers: ${developers.length}`,
      `Verified: ${verifiedDevs.length}`,
      `Avg Trust Score: ${avgTrust}%`,
      "=".repeat(40),
    ];
    downloadFile(lines.join("\n"), `verixa-summary-${dateStr}.txt`);
    showFlash("Summary exported!");
  };

  // Pre-built report definitions
  const reports = [
    {
      title: "Hiring Performance Report",
      date: dateLabel,
      status: "Generated",
      category: "Performance",
      generate: () => {
        const lines = [
          "VERIXA — HIRING PERFORMANCE REPORT",
          `Generated: ${today.toLocaleString()}`,
          "=".repeat(50),
          "",
          `Total Developers    : ${developers.length}`,
          `Verified Profiles   : ${verifiedDevs.length}`,
          `Average Trust Score : ${avgTrust}%`,
          `Successful Hires    : 152 (platform total)`,
          `Avg Time To Hire    : 12 days`,
          `Interview Success   : 72%`,
          `Offer Acceptance    : 84%`,
          "",
          "HIRING FUNNEL",
          "-".repeat(30),
          "  Applications : 100%",
          "  Shortlisted  : 75%",
          "  Interviews   : 45%",
          "  Offers       : 20%",
          "  Hired        : 15%",
          "",
          "=".repeat(50),
          "END OF REPORT",
        ];
        downloadFile(lines.join("\n"), `hiring-performance-${dateStr}.txt`);
        showFlash("Hiring Performance Report downloaded!");
      },
    },
    {
      title: "Developer Verification Report",
      date: dateLabel,
      status: "Generated",
      category: "Verification",
      generate: () => {
        const lines = [
          "VERIXA — DEVELOPER VERIFICATION REPORT",
          `Generated: ${today.toLocaleString()}`,
          "=".repeat(60),
          "",
          `Total Developers  : ${developers.length}`,
          `Verified          : ${verifiedDevs.length}`,
          `Pending           : ${developers.length - verifiedDevs.length}`,
          "",
          "VERIFIED DEVELOPERS",
          "-".repeat(40),
          ...verifiedDevs.map(
            (d) =>
              `  ${d.name.padEnd(20)} | ${d.role.padEnd(28)} | Trust: ${d.trustScore}%`
          ),
          "",
          "=".repeat(60),
          "END OF REPORT",
        ];
        downloadFile(lines.join("\n"), `verification-report-${dateStr}.txt`);
        showFlash("Developer Verification Report downloaded!");
      },
    },
    {
      title: "Assessment Analytics",
      date: "May 2026",
      status: "Generated",
      category: "Analytics",
      generate: () => {
        const lines = [
          "VERIXA — ASSESSMENT ANALYTICS REPORT",
          `Generated: ${today.toLocaleString()}`,
          "=".repeat(60),
          "",
          "DEVELOPER ASSESSMENT SCORES",
          "-".repeat(40),
          ...developers.map((d) => {
            const s = d.assessments;
            return `  ${d.name.padEnd(20)} | Completed: ${String(s?.completed ?? 0).padStart(3)} | Avg Score: ${s?.averageScore ?? 0}%`;
          }),
          "",
          `Overall Avg Assessment Score: ${Math.round(
            developers.reduce((s, d) => s + (d.assessments?.averageScore ?? 0), 0) /
              developers.length
          )}%`,
          "",
          "=".repeat(60),
          "END OF REPORT",
        ];
        downloadFile(lines.join("\n"), `assessment-analytics-${dateStr}.txt`);
        showFlash("Assessment Analytics downloaded!");
      },
    },
  ];

  const handleGenerate = (idx) => {
    setGeneratingIdx(idx);
    setTimeout(() => {
      reports[idx].generate();
      setGeneratingIdx(null);
    }, 600);
  };

  const toggleSelect = (idx) => {
    setSelectedReports((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedReports.size === reports.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(reports.map((_, i) => i)));
    }
  };

  const downloadSelected = () => {
    if (selectedReports.size === 0) {
      showFlash("Please select at least one report.");
      return;
    }
    selectedReports.forEach((idx) => reports[idx].generate());
    showFlash(`${selectedReports.size} report(s) downloaded!`);
    setSelectedReports(new Set());
    setSelectMode(false);
  };

  return (
    <DashboardLayout recruiter>
      {/* AI Modal */}
      {showAIModal && <AIReportModal onClose={() => setShowAIModal(false)} />}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track hiring performance, developer quality, and recruitment analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Download Report Dropdown */}
          <DropdownMenu
            label="Download Report"
            icon={Download}
            variant="primary"
            items={[
              {
                label: "Hiring Performance",
                desc: "Full funnel + metrics",
                icon: BarChart3,
                iconClass: "text-blue-400",
                onClick: () => handleGenerate(0),
              },
              {
                label: "Verification Report",
                desc: "All verified developers",
                icon: BadgeCheck,
                iconClass: "text-green-400",
                onClick: () => handleGenerate(1),
              },
              {
                label: "Assessment Analytics",
                desc: "Scores & completion rates",
                icon: Trophy,
                iconClass: "text-yellow-400",
                onClick: () => handleGenerate(2),
              },
              "divider",
              {
                label: "Download All Reports",
                desc: "All 3 reports at once",
                icon: FileText,
                iconClass: "text-purple-400",
                onClick: () => {
                  reports.forEach((r) => r.generate());
                  showFlash("All reports downloaded!");
                },
              },
            ]}
          />

          {/* Export CSV Dropdown */}
          <DropdownMenu
            label="Export CSV"
            icon={FileSpreadsheet}
            variant="secondary"
            items={[
              {
                label: "Export as CSV",
                desc: "Spreadsheet-ready format",
                icon: FileSpreadsheet,
                iconClass: "text-green-400",
                onClick: handleExportCSV,
              },
              {
                label: "Export as JSON",
                desc: "Developer data with stats",
                icon: FileText,
                iconClass: "text-blue-400",
                onClick: handleExportJSON,
              },
              {
                label: "Export Summary",
                desc: "Quick overview text file",
                icon: Download,
                iconClass: "text-slate-400",
                onClick: handleExportSummary,
              },
            ]}
          />

          {/* Gen AI Report */}
          <Button variant="outline" onClick={() => setShowAIModal(true)}>
            <Bot size={18} />
            Gen AI Report
          </Button>

          {/* Select Button */}
          <Button
            variant={selectMode ? "danger" : "secondary"}
            onClick={() => {
              setSelectMode(!selectMode);
              setSelectedReports(new Set());
            }}
          >
            {selectMode ? <X size={18} /> : <CheckSquare size={18} />}
            {selectMode ? "Cancel" : "Select"}
          </Button>
        </div>
      </div>

      {/* Flash */}
      {flash && (
        <div className="mb-6 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 px-4 py-3 text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
          <BadgeCheck size={16} />
          {flash}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Total Developers</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {developers.length}
              </h3>
            </div>
            <Users className="text-blue-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Verified Profiles</p>
              <h3 className="mt-2 text-3xl font-bold text-green-400">{verifiedDevs.length}</h3>
            </div>
            <BadgeCheck className="text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Average Trust Score</p>
              <h3 className="mt-2 text-3xl font-bold text-purple-400">{avgTrust}%</h3>
            </div>
            <TrendingUp className="text-purple-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Successful Hires</p>
              <h3 className="mt-2 text-3xl font-bold text-yellow-400">152</h3>
            </div>
            <Trophy className="text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Analytics */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <BarChart3 className="text-blue-400" />
            Hiring Funnel
          </h2>
          <div className="space-y-5">
            {[
              { label: "Applications", value: 100 },
              { label: "Shortlisted", value: 75 },
              { label: "Interviews", value: 45 },
              { label: "Offers", value: 20 },
              { label: "Hired", value: 15 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="text-blue-400">{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-blue-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Top Hiring Metrics
          </h2>
          <div className="space-y-5">
            <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">Average Time To Hire</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">12 Days</h3>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">Interview Success Rate</p>
              <h3 className="mt-2 text-2xl font-bold text-green-400">72%</h3>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">Offer Acceptance Rate</p>
              <h3 className="mt-2 text-2xl font-bold text-purple-400">84%</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Generated Reports */}
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <FileText className="text-green-400" />
            Generated Reports
          </h2>
          {selectMode && (
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
              >
                {selectedReports.size === reports.length ? <CheckSquare size={15} /> : <Square size={15} />}
                {selectedReports.size === reports.length ? "Deselect All" : "Select All"}
              </button>
              {selectedReports.size > 0 && (
                <Button size="sm" onClick={downloadSelected}>
                  <Download size={14} />
                  Download {selectedReports.size} Selected
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {reports.map((report, index) => (
            <div
              key={index}
              onClick={() => selectMode && toggleSelect(index)}
              className={`
                flex flex-col gap-4 rounded-xl border p-5
                md:flex-row md:items-center md:justify-between
                transition-all duration-200
                ${selectMode ? "cursor-pointer" : ""}
                ${selectedReports.has(index)
                  ? "border-blue-500 bg-blue-500/5"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {selectMode && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedReports.has(index)
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-400 dark:border-slate-600"
                  }`}>
                    {selectedReports.has(index) && <Check size={12} className="text-white" />}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{report.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                  {report.status}
                </span>
                {!selectMode && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerate(index)}
                      disabled={generatingIdx === index}
                    >
                      <Sparkles size={16} />
                      {generatingIdx === index ? "Generating…" : "Generate"}
                    </Button>
                    <Button size="sm" onClick={() => report.generate()}>
                      <Download size={16} />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="mt-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
          AI Recruitment Insights
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl bg-green-500/10 p-4 text-green-400">
            ✓ Developers with Trust Score above 90% have 65% higher hiring success.
          </div>
          <div className="rounded-xl bg-blue-500/10 p-4 text-blue-400">
            ✓ Verified GitHub profiles receive 40% more recruiter attention.
          </div>
          <div className="rounded-xl bg-purple-500/10 p-4 text-purple-400">
            ✓ React + Node.js remains the most requested skill combination.
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
