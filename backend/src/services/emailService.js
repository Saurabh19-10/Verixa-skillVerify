import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");
// =========================================
// Email Configuration
// =========================================

const getEmailConfig = () => {
  const emailUser =
    process.env.EMAIL_USER?.trim();

  const emailPassword = (
    process.env.EMAIL_PASSWORD ||
    process.env.EMAIL_PASS ||
    ""
  )
    .replace(/\s+/g, "")
    .trim();

  const emailHost =
    process.env.EMAIL_HOST?.trim() ||
    "smtp.gmail.com";

  const emailPort =
    Number(process.env.EMAIL_PORT) || 465;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASSWORD are required"
    );
  }

  return {
    emailUser,
    emailPassword,
    emailHost,
    emailPort,
  };
};

// =========================================
// SMTP Transporter
// =========================================

const createTransporter = () => {
  const {
    emailUser,
    emailPassword,
    emailHost,
    emailPort,
  } = getEmailConfig();

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,

    // Port 465 uses SSL.
    // Port 587 uses STARTTLS.
    secure: emailPort === 465,

    auth: {
      user: emailUser,
      pass: emailPassword,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,

    tls: {
      minVersion: "TLSv1.2",
      servername: emailHost,
    },
  });
};

const getSender = () => {
  const senderEmail =
    process.env.EMAIL_FROM?.trim() ||
    process.env.EMAIL_USER?.trim();

  const senderName =
    process.env.EMAIL_FROM_NAME?.trim() ||
    "Verixa";

  return `"${senderName}" <${senderEmail}>`;
};

// =========================================
// Generic Email Sender
// =========================================

export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  const recipient = to?.trim();
  const emailSubject = subject?.trim();

  if (!recipient) {
    throw new Error(
      "Recipient email is required"
    );
  }

  if (!emailSubject) {
    throw new Error(
      "Email subject is required"
    );
  }

  if (!html?.trim() && !text?.trim()) {
    throw new Error(
      "Email content is required"
    );
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: getSender(),
      to: recipient,
      subject: emailSubject,
      text,
      html,
    });

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    if (
      !Array.isArray(info.accepted) ||
      info.accepted.length === 0
    ) {
      throw new Error(
        "SMTP server did not accept the recipient"
      );
    }

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    console.error("Email sending failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    throw error;
  } finally {
    transporter.close();
  }
};

// =========================================
// Verification OTP Email
// =========================================

export const sendVerificationOTPEmail =
  async ({
    email,
    name = "Developer",
    otp,
    expiresInMinutes = 10,
  }) => {
    if (!email?.trim()) {
      throw new Error(
        "Recipient email is required"
      );
    }

    if (!otp) {
      throw new Error(
        "Verification OTP is required"
      );
    }

    const safeName =
      name?.toString().trim() ||
      "Developer";

    const subject =
      "Verify your Verixa account";

    const text = `
Hello ${safeName},

Your Verixa email verification OTP is: ${otp}

This OTP will expire in ${expiresInMinutes} minutes.

Do not share this OTP with anyone.

Verixa
Proof of Skills, Not Just Claims.
    `.trim();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Verify your Verixa account</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              background-color: #f1f5f9;
              padding: 32px 16px;
            "
          >
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 32px;
                        text-align: center;
                        background-color: #1d4ed8;
                      "
                    >
                      <h1
                        style="
                          margin: 0;
                          color: #ffffff;
                          font-size: 32px;
                          letter-spacing: 1px;
                        "
                      >
                        VERIXA
                      </h1>

                      <p
                        style="
                          margin: 8px 0 0;
                          color: #dbeafe;
                          font-size: 14px;
                        "
                      >
                        Proof of Skills, Not Just Claims.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 32px;">
                      <h2
                        style="
                          margin: 0 0 18px;
                          color: #0f172a;
                          font-size: 26px;
                        "
                      >
                        Verify your email
                      </h2>

                      <p
                        style="
                          margin: 0 0 14px;
                          color: #475569;
                          font-size: 16px;
                          line-height: 1.7;
                        "
                      >
                        Hello ${safeName},
                      </p>

                      <p
                        style="
                          margin: 0 0 24px;
                          color: #475569;
                          font-size: 16px;
                          line-height: 1.7;
                        "
                      >
                        Enter this OTP to verify your
                        Verixa account:
                      </p>

                      <div
                        style="
                          margin: 0 auto 24px;
                          padding: 20px;
                          text-align: center;
                          background-color: #eff6ff;
                          border: 1px solid #bfdbfe;
                          border-radius: 16px;
                        "
                      >
                        <span
                          style="
                            color: #1d4ed8;
                            font-size: 36px;
                            font-weight: 700;
                            letter-spacing: 10px;
                          "
                        >
                          ${otp}
                        </span>
                      </div>

                      <p
                        style="
                          margin: 0 0 12px;
                          color: #475569;
                          font-size: 15px;
                          line-height: 1.7;
                        "
                      >
                        This OTP is valid for
                        <strong>
                          ${expiresInMinutes} minutes
                        </strong>.
                      </p>

                      <p
                        style="
                          margin: 0;
                          color: #64748b;
                          font-size: 14px;
                          line-height: 1.7;
                        "
                      >
                        Do not share this code with anyone.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 22px 32px;
                        text-align: center;
                        background-color: #f8fafc;
                        border-top: 1px solid #e2e8f0;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #94a3b8;
                          font-size: 12px;
                        "
                      >
                        © ${new Date().getFullYear()}
                        Verixa. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  };

// =========================================
// Password Reset Email
// =========================================

export const sendPasswordResetEmail =
  async ({
    email,
    name = "Developer",
    resetUrl,
    expiresInMinutes = 15,
  }) => {
    if (!email?.trim()) {
      throw new Error(
        "Recipient email is required"
      );
    }

    if (!resetUrl?.trim()) {
      throw new Error(
        "Password reset URL is required"
      );
    }

    const safeName =
      name?.toString().trim() ||
      "Developer";

    const subject =
      "Reset your Verixa password";

    const text = `
Hello ${safeName},

We received a request to reset your Verixa password.

Reset your password using this link:
${resetUrl}

This link will expire in ${expiresInMinutes} minutes.

If you did not request a password reset, ignore this email.

Verixa
Proof of Skills, Not Just Claims.
    `.trim();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Reset your Verixa password</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              background-color: #f1f5f9;
              padding: 32px 16px;
            "
          >
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 32px;
                        text-align: center;
                        background-color: #1d4ed8;
                      "
                    >
                      <h1
                        style="
                          margin: 0;
                          color: #ffffff;
                          font-size: 32px;
                        "
                      >
                        VERIXA
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 32px;">
                      <h2
                        style="
                          margin: 0 0 18px;
                          color: #0f172a;
                          font-size: 26px;
                        "
                      >
                        Reset your password
                      </h2>

                      <p
                        style="
                          color: #475569;
                          font-size: 16px;
                          line-height: 1.7;
                        "
                      >
                        Hello ${safeName},
                      </p>

                      <p
                        style="
                          color: #475569;
                          font-size: 16px;
                          line-height: 1.7;
                        "
                      >
                        Click the button below to choose
                        a new password.
                      </p>

                      <div
                        style="
                          margin: 28px 0;
                          text-align: center;
                        "
                      >
                        <a
                          href="${resetUrl}"
                          target="_blank"
                          rel="noopener noreferrer"
                          style="
                            display: inline-block;
                            padding: 14px 28px;
                            background-color: #2563eb;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 12px;
                            font-size: 16px;
                            font-weight: 700;
                          "
                        >
                          Reset Password
                        </a>
                      </div>

                      <p
                        style="
                          color: #475569;
                          font-size: 14px;
                          line-height: 1.7;
                        "
                      >
                        This link expires in
                        <strong>
                          ${expiresInMinutes} minutes
                        </strong>.
                      </p>

                      <p
                        style="
                          color: #2563eb;
                          font-size: 12px;
                          word-break: break-all;
                        "
                      >
                        ${resetUrl}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  };

// =========================================
// SMTP Connection Test
// =========================================

export const verifyEmailConnection =
  async () => {
    const transporter =
      createTransporter();

    try {
      await transporter.verify();
      console.log(
        "SMTP connection verified successfully"
      );

      return true;
    } finally {
      transporter.close();
    }
  };