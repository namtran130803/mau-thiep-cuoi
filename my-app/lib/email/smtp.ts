import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "Gmail",
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  if (!transporter || !from) {
    console.info("[email:skipped]", { to, subject });
    return { ok: true, skipped: true };
  }

  await transporter.sendMail({ from, to, subject, html });
  return { ok: true, skipped: false };
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
