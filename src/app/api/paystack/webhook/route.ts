import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { fulfillPayment } from "@/lib/fulfillment";
import { isValidReference } from "@/lib/paystack";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return new NextResponse(null, { status: 500 });
  }

  // The signature is calculated from the exact raw text Paystack sent
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new NextResponse(null, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: unknown } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const reference = event.data?.reference;

  if (
    event.event === "charge.success" &&
    typeof reference === "string" &&
    isValidReference(reference)
  ) {
    try {
      await fulfillPayment(reference);
    } catch (error) {
      console.error("Webhook fulfilment failed:", reference, error);
      // A 500 makes Paystack try again later
      return new NextResponse(null, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
