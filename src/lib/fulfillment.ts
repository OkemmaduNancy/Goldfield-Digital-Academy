import { skills } from "@/data/skills";
import { sendClassLinkEmail } from "@/lib/email";
import {
  isOurReference,
  isPaymentValid,
  verifyTransaction,
} from "@/lib/paystack";
import {
  claimEmailSend,
  markEmailFailed,
  markEmailSent,
  markPaid,
} from "@/lib/registrations";

export type FulfillmentResult =
  | {
      kind: "paid";
      name: string;
      skill: string;
      email: string;
      emailStatus: "sent" | "failed" | "in_progress";
    }
  | { kind: "not_paid"; reason: "failed" | "pending" }
  | { kind: "mismatch" }
  | { kind: "ignored" }
  | { kind: "duplicate" };

export async function fulfillPayment(
  reference: string,
): Promise<FulfillmentResult> {
  if (!isOurReference(reference)) return { kind: "ignored" };

  // Always ask Paystack directly. Never trust the URL or the webhook body alone.
  const tx = await verifyTransaction(reference);

  if (tx.status !== "success") {
    const failed = tx.status === "failed" || tx.status === "abandoned";
    return { kind: "not_paid", reason: failed ? "failed" : "pending" };
  }

  if (!isPaymentValid(tx)) {
    console.error("Payment amount or currency mismatch:", reference);
    return { kind: "mismatch" };
  }

  const name =
    typeof tx.metadata?.name === "string" ? tx.metadata.name.trim() : "";
  const skill = typeof tx.metadata?.skill === "string" ? tx.metadata.skill : "";
  const email = tx.customer?.email?.trim().toLowerCase() ?? "";

  if (!name || !email || !skills.some((s) => s.name === skill)) {
    console.error(
      "Paid transaction is missing registration details:",
      reference,
    );
    return { kind: "ignored" };
  }

  const registration = await markPaid({
    reference,
    name,
    email,
    skill,
    amountKobo: tx.amount,
  });
    if (registration.status === "duplicate") {
    console.error("Duplicate payment for an already registered email:", reference);
    return { kind: "duplicate" };
  }

  const claimed = await claimEmailSend(reference);

  if (!claimed) {
    // Already sent, or another request is sending it right now
    return {
      kind: "paid",
      name: registration.name,
      skill: registration.skill,
      email: registration.email,
      emailStatus:
        registration.email_status === "sent" ? "sent" : "in_progress",
    };
  }

  try {
    await sendClassLinkEmail({
      to: claimed.email,
      name: claimed.name,
      skill: claimed.skill,
      reference,
    });
    await markEmailSent(reference);
  } catch (error) {
    console.error("Class link email failed:", reference, error);
    await markEmailFailed(reference);
    return {
      kind: "paid",
      name: claimed.name,
      skill: claimed.skill,
      email: claimed.email,
      emailStatus: "failed",
    };
  }

  return {
    kind: "paid",
    name: claimed.name,
    skill: claimed.skill,
    email: claimed.email,
    emailStatus: "sent",
  };
}
