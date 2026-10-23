import { REGISTRATION_FEE } from "@/lib/pricing";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

type PaystackResponse<T> = { status: boolean; message: string; data: T };

export type VerifiedTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: { name?: unknown; skill?: unknown } | null;
};

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

async function paystackFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<PaystackResponse<T>> {
  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.status) {
    throw new Error(
      `Paystack request failed (${res.status}): ${body?.message ?? "no message"}`,
    );
  }
  return body as PaystackResponse<T>;
}

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}) {
  const res = await paystackFetch<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: String(params.amountKobo),
      currency: "NGN",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });
  return res.data;
}

export async function verifyTransaction(reference: string) {
  const res = await paystackFetch<VerifiedTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
  return res.data;
}

// References we create look like GFA-xxxxxxxxxxxxxxxxxxxx
export function isValidReference(reference: string) {
  return /^[A-Za-z0-9_.=-]{6,100}$/.test(reference);
}

// "success" alone isn't enough: the amount and currency must match too
export function isPaymentValid(tx: VerifiedTransaction) {
  return (
    tx.status === "success" &&
    tx.currency === "NGN" &&
    tx.amount === REGISTRATION_FEE * 100
  );
}
