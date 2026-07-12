import { useEffect, useState } from "react";
import {
  Award,
  Download,
  ExternalLink,
  QrCode,
  Search,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { getMyCertificates } from "../../api/certificateApi";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost:5050";

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getMyCertificates();
        setCertificates(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter((cert) =>
    cert.skill?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Certificates"
      subtitle="Your verified Verixa skill certificates"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
            <Award className="text-yellow-400" />
            Certificates
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Certificates are generated automatically after passing assessments.
          </p>
        </div>

        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill..."
          />
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Total Certificates
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {certificates.length}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Highest Score
          </p>
          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {certificates.length
              ? Math.max(...certificates.map((c) => c.percentage || 0))
              : 0}
            %
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">
            Verified Skills
          </p>
          <h3 className="mt-2 text-3xl font-bold text-blue-400">
            {new Set(certificates.map((c) => c.skill)).size}
          </h3>
        </Card>
      </div>

      {loading ? (
        <Card className="text-center">
          <p className="text-slate-500">Loading certificates...</p>
        </Card>
      ) : filteredCertificates.length === 0 ? (
        <Card className="py-12 text-center">
          <Award className="mx-auto text-slate-500" size={56} />

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            No Certificates Yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Pass an assessment to automatically generate a verified Verixa
            certificate with PDF and QR verification.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCertificates.map((cert) => (
            <Card key={cert._id} className="overflow-hidden">
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-yellow-500/10 p-3 text-yellow-400">
                        <Award size={30} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {cert.skill} Certified
                        </h2>

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {cert.assessment?.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-slate-500">Score</p>
                        <h3 className="text-2xl font-bold text-blue-400">
                          {cert.score}/20
                        </h3>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Percentage</p>
                        <h3 className="text-2xl font-bold text-green-400">
                          {cert.percentage}%
                        </h3>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Issued</p>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-5 text-xs text-slate-500">
                      Certificate ID: {cert.certificateId}
                    </p>
                  </div>

                  {cert.qrCode && (
                    <div className="rounded-xl bg-white p-3">
                      <img
                        src={cert.qrCode}
                        alt="QR Code"
                        className="h-28 w-28"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {cert.pdfUrl && (
                    <a
                      href={`${backendUrl}${cert.pdfUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button>
                        <Download size={18} />
                        Download PDF
                      </Button>
                    </a>
                  )}

                  <a
                    href={`/certificate/${cert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="secondary">
                      <ExternalLink size={18} />
                      View Certificate
                    </Button>
                  </a>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/certificate/${cert.certificateId}`
                      )
                    }
                  >
                    <QrCode size={18} />
                    Copy Verify Link
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}