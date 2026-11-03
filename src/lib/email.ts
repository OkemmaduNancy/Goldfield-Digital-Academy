import nodemailer from "nodemailer";

type ClassLinkEmail = {
  to: string;
  name: string;
  skill: string;
  reference: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendClassLinkEmail({
  to,
  name,
  skill,
  reference,
}: ClassLinkEmail) {
  const groupLink = process.env.TELEGRAM_GROUP_LINK;
  if (!groupLink) throw new Error("TELEGRAM_GROUP_LINK is not set");

  const subject = "Your Goldfield Digital Academy class group";

  const text = [
    `Hi ${name},`,
    "",
    `Thank you for registering for ${skill} at Goldfield Digital Academy. Your payment has been confirmed.`,
    "",
    "Join your class group on Telegram here:",
    groupLink,
    "",
    "Your class Google Meet links will be shared inside the group, so please join as soon as you can.",
    "",
    `Payment reference: ${reference}`,
    "",
    "Goldfield Digital Academy",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#0a0a0a">
      <h2 style="margin:0 0 16px">Welcome to Goldfield Digital Academy</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thank you for registering for <strong>${escapeHtml(skill)}</strong>. Your payment has been confirmed.</p>
      <p>Join your class group on Telegram:</p>
      <p>
        <a href="${escapeHtml(groupLink)}"
           style="display:inline-block;background:#ffbd07;color:#0a0a0a;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">
          Join the Telegram group
        </a>
      </p>
      <p>Your class Google Meet links will be shared inside the group, so please join as soon as you can.</p>
      <p style="color:#666;font-size:12px">Payment reference: ${escapeHtml(reference)}</p>
    </div>`;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  // Test mode: with no email account set up, print the email in the terminal.
  // In production this fails on purpose, so a missing setup is never silent.
  if (!user || !pass) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured");
    }
    console.log(
      `\n[DEV EMAIL - NOT actually sent]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`,
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Goldfield Digital Academy" <${user}>`,
    to,
    subject,
    text,
    html,
  });
}
