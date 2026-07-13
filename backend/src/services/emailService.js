import { Resend } from "resend";

const getEmailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  const senderEmail =
    process.env.EMAIL_FROM?.trim() ||
    "onboarding@resend.dev";

  const senderName =
    process.env.EMAIL_FROM_NAME?.trim() ||
    "Verixa";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is required"
    );
  }

  return {
    apiKey,
    senderEmail,
    senderName,
  };
};

const getResendClient = () => {
  const { apiKey } = getEmailConfig();

  return new Resend(apiKey);
};

const getSender = () => {
  const { senderEmail, senderName } =
    getEmailConfig();

  return `${senderName} <${senderEmail}>`;
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

  const resend = getResendClient();

  const { data, error } =
    await resend.emails.send({
      from: getSender(),
      to: [recipient],
      subject: emailSubject,
      html,
      text,
    });

  if (error) {
    console.error(
      "Resend email error:",
      error
    );

    throw new Error(
      error.message ||
        "Email could not be sent"
    );
  }

  console.log(
    "Email sent through Resend:",
    data?.id
  );

  return {
    messageId: data?.id,
    accepted: [recipient],
    rejected: [],
  };
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

                      <p
                        style="
                          margin: 8px 0 0;
                          color: #dbeafe;
                        "
                      >
                        Proof of Skills, Not Just Claims.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 32px;">
                      <h2>
                        Verify your email
                      </h2>

                      <p>
                        Hello ${safeName},
                      </p>

                      <p>
                        Enter this OTP to verify your
                        Verixa account:
                      </p>

                      <div
                        style="
                          margin: 24px 0;
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

                      <p>
                        This OTP is valid for
                        <strong>
                          ${expiresInMinutes} minutes
                        </strong>.
                      </p>

                      <p>
                        Do not share this code with anyone.
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

Reset your Verixa password using this link:

${resetUrl}

This link expires in ${expiresInMinutes} minutes.

If you did not request this reset, ignore this email.
    `.trim();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <body
          style="
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f1f5f9;
            padding: 32px;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: auto;
              background-color: #ffffff;
              padding: 32px;
              border-radius: 16px;
            "
          >
            <h1 style="color: #1d4ed8;">
              VERIXA
            </h1>

            <h2>Reset your password</h2>

            <p>Hello ${safeName},</p>

            <p>
              Click the button below to reset your
              password.
            </p>

            <p style="margin: 28px 0;">
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  color: #ffffff;
                  background-color: #2563eb;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: 700;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              This link expires in
              ${expiresInMinutes} minutes.
            </p>

            <p style="word-break: break-all;">
              ${resetUrl}
            </p>
          </div>
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

// Kept for compatibility with existing imports.
export const verifyEmailConnection =
  async () => {
    getEmailConfig();
    return true;
  };