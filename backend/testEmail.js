import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

try {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "Verixa"}" <${
      process.env.EMAIL_FROM || process.env.EMAIL_USER
    }>`,
    to: process.env.EMAIL_USER,
    subject: "Verixa SMTP Test",
    text: "Verixa email configuration is working.",
  });

  console.log("Email sent successfully:", info.messageId);
} catch (error) {
  console.error("SMTP ERROR:", error.message);
  console.error(error);
  process.exit(1);
}
