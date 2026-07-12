import nodemailer from "nodemailer";

const getEmailConfig = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword =
    process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASSWORD are required in backend/.env"
    );
  }

  return {
    emailUser,
    emailPassword,
  };
};

const createTransporter = () => {
  const { emailUser, emailPassword } = getEmailConfig();

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: emailUser,
      pass: emailPassword,
    },

    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
};

const getSender = () => {
  const senderEmail =
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER;

  const senderName =
    process.env.EMAIL_FROM_NAME || "Verixa";

  return `"${senderName}" <${senderEmail}>`;
};

/**
 * Generic email sender.
 *
 * @param {object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  if (!to?.trim()) {
    throw new Error("Recipient email is required");
  }

  if (!subject?.trim()) {
    throw new Error("Email subject is required");
  }

  if (!html?.trim() && !text?.trim()) {
    throw new Error("Email content is required");
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: getSender(),
    to: to.trim(),
    subject: subject.trim(),
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
};

/**
 * Send account verification OTP.
 */
export const sendVerificationOTPEmail = async ({
  email,
  name = "Developer",
  otp,
  expiresInMinutes = 10,
}) => {
  if (!otp) {
    throw new Error("Verification OTP is required");
  }

  const safeName = name?.trim() || "Developer";

  const subject = "Verify your Verixa account";

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
          style="background-color: #f1f5f9; padding: 32px 16px;"
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
                  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.1);
                "
              >
                <tr>
                  <td
                    style="
                      padding: 32px;
                      text-align: center;
                      background: linear-gradient(
                        135deg,
                        #0f172a,
                        #1d4ed8,
                        #4338ca
                      );
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
                        color: #bfdbfe;
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
                      Enter the following OTP to verify your
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
                      <strong>${expiresInMinutes} minutes</strong>.
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #64748b;
                        font-size: 14px;
                        line-height: 1.7;
                      "
                    >
                      Do not share this code with anyone. If you
                      did not create a Verixa account, you can
                      safely ignore this email.
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
                      © ${new Date().getFullYear()} Verixa. All
                      rights reserved.
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

/**
 * Send password reset link.
 */
export const sendPasswordResetEmail = async ({
  email,
  name = "Developer",
  resetUrl,
  expiresInMinutes = 15,
}) => {
  if (!resetUrl?.trim()) {
    throw new Error("Password reset URL is required");
  }

  const safeName = name?.trim() || "Developer";

  const subject = "Reset your Verixa password";

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
          style="background-color: #f1f5f9; padding: 32px 16px;"
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
                  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.1);
                "
              >
                <tr>
                  <td
                    style="
                      padding: 32px;
                      text-align: center;
                      background: linear-gradient(
                        135deg,
                        #0f172a,
                        #1d4ed8,
                        #4338ca
                      );
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
                        color: #bfdbfe;
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
                      Reset your password
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
                        margin: 0 0 26px;
                        color: #475569;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      We received a request to reset your Verixa
                      password. Click the button below to choose
                      a new password.
                    </p>

                    <div style="text-align: center; margin-bottom: 28px;">
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
                        margin: 0 0 16px;
                        color: #475569;
                        font-size: 14px;
                        line-height: 1.7;
                      "
                    >
                      This link expires in
                      <strong>${expiresInMinutes} minutes</strong>.
                    </p>

                    <p
                      style="
                        margin: 0 0 8px;
                        color: #64748b;
                        font-size: 13px;
                        line-height: 1.7;
                      "
                    >
                      If the button does not work, copy and paste
                      this link into your browser:
                    </p>

                    <p
                      style="
                        margin: 0 0 18px;
                        color: #2563eb;
                        font-size: 12px;
                        line-height: 1.6;
                        word-break: break-all;
                      "
                    >
                      ${resetUrl}
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #64748b;
                        font-size: 14px;
                        line-height: 1.7;
                      "
                    >
                      If you did not request this reset, ignore
                      this email. Your password will remain
                      unchanged.
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
                      © ${new Date().getFullYear()} Verixa. All
                      rights reserved.
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

/**
 * Test whether current SMTP configuration can connect.
 */
export const verifyEmailConnection = async () => {
  const transporter = createTransporter();

  await transporter.verify();

  return true;
};