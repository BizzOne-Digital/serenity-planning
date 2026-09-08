/**
 * Optional SMTP notification helper.
 * No-ops gracefully when SMTP env vars are not configured, and never blocks
 * or fails the calling database write. Nodemailer is intentionally not a
 * dependency — wiring one in later is a drop-in change inside sendViaSmtp().
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

async function sendViaSmtp(_options: {
  subject: string;
  text: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  from: string;
  to: string;
}): Promise<void> {
  // Placeholder: no email transport is bundled by default. Install and wire
  // up `nodemailer` (or a preferred provider SDK) here if SMTP notifications
  // are needed in production.
  return;
}
