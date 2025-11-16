// backend/services/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const ALLOWED_TEMPLATES = ["template1", "template2", "template3", "template4"];

function safeFilename(name = "resume") {
  return String(name)
    .replace(/[^\w\s\-\.]/g, "")
    .replace(/\s+/g, "_");
}

function buildTransportOptions() {
  // Prefer explicit SMTP settings (for production)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE || "false").toLowerCase() === "true", // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  }

  // Fallback to Gmail (App Password)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  // No config found
  return null;
}

/**
 * Send resume email with attachment.
 * @param {string} to - recipient email
 * @param {string} pdfPath - absolute path to PDF file
 * @param {string} name - recipient name (used in subject & filename)
 * @param {string} [template='template1'] - template name (template1..template4)
 * @returns {Promise<{ok:boolean, info?:any, error?:string}>}
 */
export async function sendResumeEmail(to, pdfPath, name, template = "template1") {
  try {
    if (!to) {
      console.warn("⚠️ No email provided — skipping sending.");
      return { ok: false, error: "no-recipient" };
    }

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      console.warn("⚠️ PDF not found — cannot attach:", pdfPath);
      return { ok: false, error: "pdf-not-found" };
    }

    if (!ALLOWED_TEMPLATES.includes(template)) {
      console.warn("⚠️ Unknown template, defaulting to template1:", template);
      template = "template1";
    }

    const transportOptions = buildTransportOptions();
    if (!transportOptions) {
      console.error("❌ No SMTP or Gmail config found in environment. Set SMTP_HOST/SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS.");
      return { ok: false, error: "no-mail-config" };
    }

    const transporter = nodemailer.createTransport(transportOptions);

    // optional verify (can be noisy in logs; comment out if undesired)
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.warn("⚠️ Mail transporter verification failed:", verifyErr && verifyErr.message || verifyErr);
      // continue — sometimes verification fails on some providers but sendMail can still work
    }

    const safeName = safeFilename(name || "resume");
    const filename = `${safeName}_${template}_Resume.pdf`;

    const subject = `Your Resume ( ${template} ) — ${name || "Resume"}`;
    const plainText = `Hi ${name || ""},

Attached is your resume (template: ${template}).

Thanks for using Resume Builder!
`;
    const htmlBody = `<p>Hi ${name || ""},</p>
<p>Attached is your resume (template: <strong>${template}</strong>).</p>
<p>Thanks for using <strong>Resume Builder</strong>!</p>`;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.EMAIL_USER || `"Resume Builder" <no-reply@resume-builder.local>`,
      to,
      subject,
      text: plainText,
      html: htmlBody,
      attachments: [
        {
          filename,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info && info.messageId ? info.messageId : info);
    return { ok: true, info };
  } catch (err) {
    console.error("❌ Email failed:", err && err.message ? err.message : err);
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}
