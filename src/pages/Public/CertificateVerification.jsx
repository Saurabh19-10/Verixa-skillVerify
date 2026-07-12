import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Award, CheckCircle, XCircle, Download } from "lucide-react";

import { verifyCertificate } from "../../api/certificateApi";
import Button from "../../components/ui/Button";

export default function CertificateVerification() {
  const { certificateId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = "http://localhost:5050";

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await verifyCertificate(certificateId);
        setCertificate(data);
      } catch (err) {
        setError("Certificate not found or invalid.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading certificate...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="text-center">
          <XCircle className="mx-auto text-red-500" size={70} />
          <h1 className="mt-4 text-3xl font-bold text-white">
            Invalid Certificate
          </h1>
          <p className="mt-2 text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <Award className="mx-auto text-yellow-400" size={70} />

        <h1 className="mt-4 text-4xl font-bold">
          Verixa Verified Certificate
        </h1>

        <p className="mt-3 flex items-center justify-center gap-2 text-green-400">
          <CheckCircle size={20} />
          Certificate Verified
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-3xl font-bold">
            {certificate.user?.name}
          </h2>

          <p className="mt-2 text-slate-400">
            {certificate.user?.title || "Verified Developer"}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Info label="Skill" value={certificate.skill} />
            <Info label="Assessment" value={certificate.assessment?.title} />
            <Info label="Score" value={`${certificate.score}/20`} />
            <Info label="Percentage" value={`${certificate.percentage}%`} />
            <Info
              label="Issued"
              value={new Date(certificate.issuedAt).toLocaleDateString()}
            />
            <Info label="Certificate ID" value={certificate.certificateId} />
          </div>

          {certificate.qrCode && (
            <div className="mt-8 flex justify-center">
              <div className="rounded-xl bg-white p-3">
                <img
                  src={certificate.qrCode}
                  alt="Certificate QR"
                  className="h-32 w-32"
                />
              </div>
            </div>
          )}

          {certificate.pdfUrl && (
            <a
              href={`${backendUrl}${certificate.pdfUrl}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block"
            >
              <Button>
                <Download size={18} />
                Download PDF
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-1 font-semibold text-white">
        {value || "N/A"}
      </h3>
    </div>
  );
}