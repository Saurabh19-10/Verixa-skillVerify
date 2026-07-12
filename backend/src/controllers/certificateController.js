import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

import Certificate from "../models/Certificate.js";
import AssessmentResult from "../models/AssessmentResult.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesDirectory = path.join(
  __dirname,
  "../../uploads/certificates"
);

/**
 * Make sure certificate upload directory exists.
 */
const ensureCertificateDirectory = async () => {
  await fs.promises.mkdir(certificatesDirectory, {
    recursive: true,
  });
};

/**
 * Generate a unique, readable certificate ID.
 *
 * Example:
 * VERIXA-JAVA-2026-A1B2C3D4
 */
const createUniqueCertificateId = async (skill = "SKILL") => {
  const normalizedSkill = skill
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);

  const year = new Date().getFullYear();

  let certificateId;
  let alreadyExists = true;

  while (alreadyExists) {
    const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();

    certificateId = `VERIXA-${normalizedSkill || "SKILL"}-${year}-${randomPart}`;

    alreadyExists = await Certificate.exists({
      certificateId,
    });
  }

  return certificateId;
};

/**
 * Escape values before writing them to the PDF.
 */
const getSafeText = (value, fallback = "N/A") => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value);
};

/**
 * Draw a decorative border around the certificate.
 */
const drawCertificateBorder = (doc) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc
    .lineWidth(4)
    .strokeColor("#1D4ED8")
    .rect(22, 22, pageWidth - 44, pageHeight - 44)
    .stroke();

  doc
    .lineWidth(1.5)
    .strokeColor("#94A3B8")
    .rect(32, 32, pageWidth - 64, pageHeight - 64)
    .stroke();
};

/**
 * Generate the physical PDF certificate.
 */
const generateCertificatePdf = async ({
  certificateId,
  candidateName,
  skill,
  score,
  percentage,
  issuedAt,
  qrCodeBuffer,
  verificationUrl,
}) => {
  await ensureCertificateDirectory();

  const fileName = `${certificateId}.pdf`;
  const absoluteFilePath = path.join(certificatesDirectory, fileName);
  const publicPdfPath = `/uploads/certificates/${fileName}`;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: {
        top: 40,
        bottom: 40,
        left: 50,
        right: 50,
      },
      info: {
        Title: `Verixa Certificate - ${certificateId}`,
        Author: "Verixa",
        Subject: `Skill certificate for ${skill}`,
        Keywords: "Verixa, Certificate, Skills, Assessment",
        CreationDate: issuedAt,
      },
    });

    const outputStream = fs.createWriteStream(absoluteFilePath);

    doc.pipe(outputStream);

    drawCertificateBorder(doc);

    const pageWidth = doc.page.width;
    const centerX = pageWidth / 2;

    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(32)
      .text("VERIXA", 0, 65, {
        align: "center",
      });

    doc
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(11)
      .text("Proof of Skills, Not Just Claims.", 0, 105, {
        align: "center",
      });

    doc
      .moveTo(centerX - 120, 130)
      .lineTo(centerX + 120, 130)
      .lineWidth(1.5)
      .strokeColor("#2563EB")
      .stroke();

    doc
      .fillColor("#1E3A8A")
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("CERTIFICATE OF ACHIEVEMENT", 0, 155, {
        align: "center",
      });

    doc
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(14)
      .text("This certificate is proudly presented to", 0, 210, {
        align: "center",
      });

    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(30)
      .text(getSafeText(candidateName), 100, 245, {
        width: pageWidth - 200,
        align: "center",
      });

    doc
      .moveTo(centerX - 190, 287)
      .lineTo(centerX + 190, 287)
      .lineWidth(1)
      .strokeColor("#94A3B8")
      .stroke();

    doc
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(14)
      .text(
        "for successfully completing the verified skill assessment in",
        0,
        310,
        {
          align: "center",
        }
      );

    doc
      .fillColor("#2563EB")
      .font("Helvetica-Bold")
      .fontSize(25)
      .text(getSafeText(skill), 0, 342, {
        align: "center",
      });

    doc
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(13)
      .text(
        `Assessment Score: ${getSafeText(score, "0")} | Percentage: ${getSafeText(
          percentage,
          "0"
        )}%`,
        0,
        387,
        {
          align: "center",
        }
      );

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(issuedAt);

    doc
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(11)
      .text(`Issued On: ${formattedDate}`, 85, 455);

    doc
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(11)
      .text(`Certificate ID: ${certificateId}`, 85, 475);

    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Verixa Certification Authority", pageWidth - 340, 455, {
        width: 230,
        align: "center",
      });

    doc
      .moveTo(pageWidth - 315, 450)
      .lineTo(pageWidth - 135, 450)
      .lineWidth(1)
      .strokeColor("#64748B")
      .stroke();

    if (qrCodeBuffer) {
      doc.image(qrCodeBuffer, pageWidth - 128, 62, {
        fit: [75, 75],
        align: "center",
      });

      doc
        .fillColor("#475569")
        .font("Helvetica")
        .fontSize(7)
        .text("Scan to verify", pageWidth - 135, 140, {
          width: 90,
          align: "center",
        });
    }

    doc
      .fillColor("#64748B")
      .font("Helvetica")
      .fontSize(7)
      .text(verificationUrl, 120, doc.page.height - 55, {
        width: pageWidth - 240,
        align: "center",
        link: verificationUrl,
        underline: true,
      });

    doc.end();

    outputStream.on("finish", () => {
      resolve({
        absoluteFilePath,
        publicPdfPath,
        fileName,
      });
    });

    outputStream.on("error", async (error) => {
      try {
        await fs.promises.unlink(absoluteFilePath);
      } catch {
        // Ignore cleanup error because the main stream error is more important.
      }

      reject(error);
    });

    doc.on("error", reject);
  });
};

/**
 * Internal certificate-generation service.
 *
 * Call this function after a user passes an assessment:
 *
 * await generateCertificateForAssessment({
 *   assessmentResultId: result._id,
 *   userId: user._id,
 * });
 */
export const generateCertificateForAssessment = async ({
  assessmentResultId,
  userId,
}) => {
  if (!assessmentResultId) {
    throw new Error("Assessment result ID is required.");
  }

  const assessmentResult = await AssessmentResult.findById(
    assessmentResultId
  ).populate("user", "name fullName email");

  if (!assessmentResult) {
    throw new Error("Assessment result not found.");
  }

  const resultUserId =
    assessmentResult.user?._id?.toString() ||
    assessmentResult.user?.toString();

  if (userId && resultUserId !== userId.toString()) {
    throw new Error(
      "The assessment result does not belong to the specified user."
    );
  }

  const passed =
    assessmentResult.passed === true ||
    assessmentResult.isPassed === true ||
    Number(assessmentResult.percentage) >= 70;

  if (!passed) {
    throw new Error(
      "A certificate can only be generated for a passed assessment."
    );
  }

  const existingCertificate = await Certificate.findOne({
    assessmentResult: assessmentResult._id,
  });

  if (existingCertificate) {
    return existingCertificate;
  }

  const user =
    assessmentResult.user?._id
      ? assessmentResult.user
      : await User.findById(resultUserId).select(
          "name fullName email"
        );

  if (!user) {
    throw new Error("Certificate owner not found.");
  }

  const candidateName =
    user.fullName || user.name || user.email || "Verixa Developer";

  const skill =
    assessmentResult.skill ||
    assessmentResult.assessmentSkill ||
    assessmentResult.category ||
    "Skill Assessment";

  const score = Number(
    assessmentResult.score ??
      assessmentResult.correctAnswers ??
      assessmentResult.totalScore ??
      0
  );

  const totalQuestions = Number(
    assessmentResult.totalQuestions ??
      assessmentResult.questionCount ??
      15
  );

  const calculatedPercentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  const percentage = Number(
    assessmentResult.percentage ?? calculatedPercentage
  );

  const certificateId = await createUniqueCertificateId(skill);
  const issuedAt = new Date();

  const clientUrl = (
    process.env.CLIENT_URL || "http://localhost:5173"
  ).replace(/\/$/, "");

  const verificationUrl = `${clientUrl}/verify-certificate/${certificateId}`;

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });

  const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
  });

  let generatedPdf;

  try {
    generatedPdf = await generateCertificatePdf({
      certificateId,
      candidateName,
      skill,
      score,
      percentage,
      issuedAt,
      qrCodeBuffer,
      verificationUrl,
    });
    const certificate = await Certificate.create({
      certificateId,
      user: user._id,
      assessmentResult: assessmentResult._id,
      candidateName,
      skill,
      score,
      totalQuestions,
      percentage,
      issuedAt,
      verificationUrl,
      qrCode: qrCodeDataUrl,
      pdfPath: generatedPdf.publicPdfPath,
      pdfFileName: generatedPdf.fileName,
      status: "active",
    });
    assessmentResult.certificate = certificate._id;
    assessmentResult.certificateId = certificate.certificateId;

    await assessmentResult.save();

    return certificate;
  } catch (error) {
    if (generatedPdf?.absoluteFilePath) {
      try {
        await fs.promises.unlink(generatedPdf.absoluteFilePath);
      } catch {
        // Ignore cleanup failure.
      }
    }

    throw error;
  }
};

/**
 * POST /api/certificates/generate/:assessmentResultId
 *
 * Generate a certificate manually for the logged-in developer.
 */
export const generateCertificate = async (req, res, next) => {
  try {
    const { assessmentResultId } = req.params;

    const certificate = await generateCertificateForAssessment({
      assessmentResultId,
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully.",
      certificate,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("owner not found")
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message.includes("passed assessment") ||
      error.message.includes("does not belong")
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

/**
 * GET /api/certificates/my-certificates
 *
 * Return certificates belonging to the logged-in developer.
 */
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({
      user: req.user._id,
    })
      .populate(
        "assessmentResult",
        "skill score percentage passed isPassed createdAt"
      )
      .sort({
        issuedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/certificates/:certificateId
 *
 * Return certificate details to its owner, recruiter or admin.
 */
export const getCertificateById = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
    })
      .populate("user", "name fullName email avatar githubUsername")
      .populate(
        "assessmentResult",
        "skill score percentage totalQuestions passed isPassed createdAt"
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    const certificateOwnerId =
      certificate.user?._id?.toString() ||
      certificate.user?.toString();

    const currentUserId = req.user?._id?.toString();
    const currentUserRole = req.user?.role;

    const allowed =
      certificateOwnerId === currentUserId ||
      currentUserRole === "recruiter" ||
      currentUserRole === "admin";

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this certificate.",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/certificates/verify/:certificateId
 *
 * Public certificate-verification endpoint.
 * No authentication required.
 */
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId?.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Certificate ID is required.",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase(),
    })
      .populate("user", "name fullName avatar githubUsername")
      .populate(
        "assessmentResult",
        "skill score percentage totalQuestions passed isPassed createdAt"
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Certificate is invalid or does not exist.",
      });
    }

    if (certificate.status !== "active") {
      return res.status(200).json({
        success: true,
        verified: false,
        message: `This certificate is ${certificate.status}.`,
        certificate: {
          certificateId: certificate.certificateId,
          status: certificate.status,
        },
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Certificate verified successfully.",
      certificate: {
        certificateId: certificate.certificateId,
        candidateName:
          certificate.candidateName ||
          certificate.user?.fullName ||
          certificate.user?.name,
        skill: certificate.skill,
        score: certificate.score,
        percentage: certificate.percentage,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
        verificationUrl: certificate.verificationUrl,
        user: certificate.user,
        assessmentResult: certificate.assessmentResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/certificates/:certificateId/download
 *
 * Download the generated PDF.
 */
export const downloadCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    if (certificate.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `This certificate is ${certificate.status} and cannot be downloaded.`,
      });
    }

    const certificateOwnerId = certificate.user.toString();
    const currentUserId = req.user?._id?.toString();
    const currentUserRole = req.user?.role;

    const allowed =
      certificateOwnerId === currentUserId ||
      currentUserRole === "recruiter" ||
      currentUserRole === "admin";

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to download this certificate.",
      });
    }

    const pdfFileName =
      certificate.pdfFileName || `${certificate.certificateId}.pdf`;

    const absoluteFilePath = path.join(
      certificatesDirectory,
      path.basename(pdfFileName)
    );

    try {
      await fs.promises.access(absoluteFilePath, fs.constants.R_OK);
    } catch {
      return res.status(404).json({
        success: false,
        message: "Certificate PDF file was not found on the server.",
      });
    }

    return res.download(
      absoluteFilePath,
      `${certificate.certificateId}.pdf`,
      (error) => {
        if (error && !res.headersSent) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/certificates/:certificateId/status
 *
 * Admin can revoke or reactivate a certificate.
 */
export const updateCertificateStatus = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "revoked"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either active or revoked.",
      });
    }

    const certificate = await Certificate.findOneAndUpdate(
      {
        certificateId: certificateId.toUpperCase(),
      },
      {
        status,
        revokedAt: status === "revoked" ? new Date() : null,
        revokedBy: status === "revoked" ? req.user._id : null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "revoked"
          ? "Certificate revoked successfully."
          : "Certificate activated successfully.",
      certificate,
    });
  } catch (error) {
    next(error);
  }
};