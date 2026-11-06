import { neon } from "@neondatabase/serverless";
import { TOTAL_SPOTS } from "@/lib/capacity"

export type Registration = {
  reference: string;
  name: string;
  email: string;
  skill: string;
  status: "pending" | "paid" | "duplicate"| "full";
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

  // Two attempts: if two payments land at the exact same moment, the database
  // may reject one, and the retry sees the other and flags this one.
  for (let attempt = 1; ; attempt++) {
    try {
      const rows = await db`
        INSERT INTO registrations (reference, name, email, skill, amount_kobo, status, paid_at)
        VALUES (
          ${input.reference}, ${input.name}, ${input.email}, ${input.skill}, ${input.amountKobo},
          CASE
            WHEN EXISTS (
              SELECT 1 FROM registrations
              WHERE lower(email) = lower(${input.email}) AND status = 'paid'
            ) THEN 'duplicate'
            WHEN (SELECT count(*) FROM registrations WHERE status = 'paid') >= ${TOTAL_SPOTS}
              THEN 'full'
            ELSE 'paid'
          END,
          now()
        )
        ON CONFLICT (reference) DO UPDATE
          SET status = CASE
                WHEN registrations.status = 'paid' THEN 'paid'
                WHEN EXISTS (
                  SELECT 1 FROM registrations r
                  WHERE lower(r.email) = lower(registrations.email)
                    AND r.status = 'paid'
                    AND r.reference <> registrations.reference
                ) THEN 'duplicate'
                WHEN (SELECT count(*) FROM registrations r WHERE r.status = 'paid') >= ${TOTAL_SPOTS}
                  THEN 'full'
                ELSE 'paid'
              END,
              paid_at = COALESCE(registrations.paid_at, now())
        RETURNING reference, name, email, skill, status, email_status`;
      return rows[0] as Registration;
    } catch (error) {
      if (attempt >= 2) throw error;
    }
  }
}

// True if this email has already registered AND paid
export async function isEmailRegistered(email: string) {
  const db = getDb();
  const rows = await db`
    SELECT 1 FROM registrations
    WHERE lower(email) = lower(${email}) AND status = 'paid'
    LIMIT 1`;
  return rows.length > 0;
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

// Number of students who have paid and secured a place
export async function countPaidRegistrations() {
  const db = getDb();
  const rows = await db`
    SELECT count(*)::int AS count FROM registrations WHERE status = 'paid'`;
  return rows[0].count as number;
}