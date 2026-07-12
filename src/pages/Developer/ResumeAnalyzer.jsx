import { Upload, FileText, Brain } from "lucide-react";
import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);

  return (
    <DashboardLayout
      title="Resume Analyzer"
      subtitle="AI-powered ATS & Resume Analysis"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/40 p-12">
            <Upload size={60} className="text-blue-500" />

            <h2 className="mt-4 text-2xl font-bold text-white">
              Upload Resume
            </h2>

            <p className="mt-2 text-slate-400">
              PDF or DOCX • Max 5MB
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-6"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <Button className="mt-6">
              Analyze Resume
            </Button>
          </div>
        </Card>

        {/* ATS Score */}
        <Card>
          <div className="text-center">
            <Brain
              size={50}
              className="mx-auto text-blue-500"
            />

            <h2 className="mt-4 text-5xl font-bold text-blue-500">
              0%
            </h2>

            <p className="mt-2 text-slate-400">
              ATS Score
            </p>

            <div className="mt-8 space-y-4 text-left">
              <div>
                ✅ Keywords
              </div>

              <div>
                ✅ Skills Match
              </div>

              <div>
                ✅ Formatting
              </div>

              <div>
                ✅ Projects
              </div>

              <div>
                ✅ Experience
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis */}
      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-500" />

          <h2 className="text-2xl font-bold text-white">
            AI Suggestions
          </h2>
        </div>

        <div className="mt-6 rounded-xl bg-slate-900 p-6">
          <p className="text-slate-400">
            Upload your resume to receive:
          </p>

          <ul className="mt-4 space-y-3 text-slate-300">
            <li>✔ ATS Score</li>
            <li>✔ Missing Keywords</li>
            <li>✔ Resume Improvements</li>
            <li>✔ Grammar Suggestions</li>
            <li>✔ Recruiter Readiness</li>
            <li>✔ AI Summary</li>
          </ul>
        </div>
      </Card>
    </DashboardLayout>
  );
}