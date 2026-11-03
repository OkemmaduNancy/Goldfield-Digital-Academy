import nodemailer from "nodemailer";
import { EMAIL_LOGO_BASE64 } from "@/lib/emailLogo";

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
  <div style="background:#f4f4f4;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
      <tr>
        <td align="center" style="background:#0a0a0a;padding:28px 24px">
          <img src="cid:goldfield-logo" width="80" height="80" alt="Goldfield Digital Academy"
               style="display:block;margin:0 auto 12px">
          <div style="color:#ffbd07;font-size:20px;font-weight:bold;letter-spacing:0.5px">
            Goldfield Digital Academy
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;color:#0a0a0a;font-size:15px;line-height:1.6">
          <p style="margin:0 0 16px">Hi ${escapeHtml(name)},</p>
          <p style="margin:0 0 16px">
            Thank you for registering for <strong>${escapeHtml(skill)}</strong>.
            Your payment has been confirmed.
          </p>
          <p style="margin:0 0 20px">Join your class group on Telegram:</p>
          <p style="margin:0 0 24px">
            <a href="${escapeHtml(groupLink)}"
               style="display:inline-block;background:#ffbd07;color:#0a0a0a;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold">
              Join the Telegram group
            </a>
          </p>
          <p style="margin:0 0 16px">
            Your class Google Meet links will be shared inside the group, so
            please join as soon as you can.
          </p>
          <p style="margin:24px 0 0;color:#777777;font-size:12px">
            Payment reference: ${escapeHtml(reference)}
          </p>
        </td>
      </tr>
    </table>
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
    attachments: [
      {
        filename: "goldfield-logo.png",
        content: Buffer.from(EMAIL_LOGO_BASE64, "base64"),
        cid: "goldfield-logo", // matches src="cid:goldfield-logo" above
        contentType: "image/png",
      },
    ],
  });
}
