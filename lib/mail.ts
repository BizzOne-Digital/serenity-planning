import nodemailer, { type Transporter } from "nodemailer";

/**
 * Optional SMTP notification helper.
 * No-ops gracefully when SMTP env vars are not configured, and never blocks
 * or fails the calling database write.
 */
export async function sendNotificationEmail(subject: string, text: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM || !MAIL_TO) {
    // Email notifications are not configured; silently skip.
    return;
  }

  try {
    await sendViaSmtp({ subject, text, host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, pass: SMTP_PASS, from: MAIL_FROM, to: MAIL_TO });
  } catch (err) {
    console.error("Email notification failed (non-blocking):", err);
  }
}

let cachedTransporter: Transporter | null = null;

function getTransporter(host: string, port: string, user: string, pass: string): Transporter {
  if (cachedTransporter) return cachedTransporter;
  const portNum = Number(port);
  cachedTransporter = nodemailer.createTransport({
    host,
    port: portNum,
    secure: portNum === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

async function sendViaSmtp(options: {
  subject: string;
  text: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  from: string;
  to: string;
}): Promise<void> {
  const transporter = getTransporter(options.host, options.port, options.user, options.pass);
  await transporter.sendMail({
    from: `"Serenity Planning Website" <${options.from}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
}
