import { neon } from "@neondatabase/serverless";

export type Registration = {
  reference: string;
  name: string;
  email: string;
  skill: string;
  status: "pending" | "paid";
  email_status: "not_sent" | "sending" | "sent" | "failed";
};

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

type NewRegistration = {
  reference: string;
  name: string;
  email: string;
  skill: string;
  amountKobo: number;
};

// Saved when the student clicks Pay Now (before they pay)
export async function createPendingRegistration(input: NewRegistration) {
  const db = getDb();
  await db`
    INSERT INTO registrations (reference, name, email, skill, amount_kobo)
    VALUES (${input.reference}, ${input.name}, ${input.email}, ${input.skill}, ${input.amountKobo})
    ON CONFLICT (reference) DO NOTHING`;
}

// Called once Paystack has confirmed the payment. Works even if the pending
// record was never saved, because the details come from Paystack itself.
export async function markPaid(input: NewRegistration) {
  const db = getDb();
  const rows = await db`
    INSERT INTO registrations (reference, name, email, skill, amount_kobo, status, paid_at)
    VALUES (${input.reference}, ${input.name}, ${input.email}, ${input.skill}, ${input.amountKobo}, 'paid', now())
    ON CONFLICT (reference) DO UPDATE
      SET status = 'paid', paid_at = COALESCE(registrations.paid_at, now())
    RETURNING reference, name, email, skill, status, email_status`;
  return rows[0] as Registration;
}

// Only ONE caller can claim the email job, which prevents duplicate emails.
// A claim older than 5 minutes is treated as abandoned and can be retried.
export async function claimEmailSend(reference: string) {
  const db = getDb();
  const rows = await db`
    UPDATE registrations
    SET email_status = 'sending',
        email_attempts = email_attempts + 1,
        email_claimed_at = now()
    WHERE reference = ${reference}
      AND status = 'paid'
      AND (
        email_status IN ('not_sent', 'failed')
        OR (email_status = 'sending' AND email_claimed_at < now() - interval '5 minutes')
      )
    RETURNING reference, name, email, skill, status, email_status`;
  return (rows[0] as Registration | undefined) ?? null;
}

export async function markEmailSent(reference: string) {
  const db = getDb();
  await db`
    UPDATE registrations
    SET email_status = 'sent', email_sent_at = now()
    WHERE reference = ${reference}`;
}

export async function markEmailFailed(reference: string) {
  const db = getDb();
  await db`
    UPDATE registrations
    SET email_status = 'failed'
    WHERE reference = ${reference}`;
}
