import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { REGISTRATION_FEE } from "@/lib/pricing";
import { validateRegistration } from "@/lib/validation";
import { initializeTransaction } from "@/lib/paystack";
import { createPendingRegistration } from "@/lib/registrations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = (body ?? {}) as Record<string, unknown>;
  if (
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.skill !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const values = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    skill: input.skill,
  };

  const errors = validateRegistration(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check your details.", errors },
      { status: 400 }
    );
  }

  const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");
  if (!siteUrl) {
    console.error("SITE_URL is not set");
    return NextResponse.json(
      { error: "Payments are not available right now." },
      { status: 500 }
    );
  }

  const reference = `GFA-${randomUUID().replace(/-/g, "").slice(0, 20)}`;
  const amountKobo = REGISTRATION_FEE * 100;

  try {
    const transaction = await initializeTransaction({
      email: values.email,
      amountKobo,
      reference,
      callbackUrl: `${siteUrl}/join/success`,
      metadata: { name: values.name, skill: values.skill },
    });

    // Save a pending record. If this fails we carry on: the registration is
    // recreated from Paystack's own data once the payment succeeds.
    try {
      await createPendingRegistration({ reference, ...values, amountKobo });
    } catch (dbError) {
      console.error("Could not save pending registration:", dbError);
    }

    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
    });
  } catch (error) {
    console.error("Paystack initialize failed:", error);
    return NextResponse.json(
      { error: "We couldn't start your payment. Please try again." },
      { status: 502 }
    );
  }
}