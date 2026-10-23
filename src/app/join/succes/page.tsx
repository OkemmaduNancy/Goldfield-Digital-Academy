import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  isPaymentValid,
  isValidReference,
  verifyTransaction,
} from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Payment status | Goldfield Academy",
  robots: { index: false, follow: false },
};

type Outcome =
  | { kind: "success"; name?: string; skill?: string }
  | { kind: "pending" }
  | { kind: "failed" }
  | { kind: "error" }
  | { kind: "missing" };

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

async function getOutcome(reference?: string): Promise<Outcome> {
  if (!reference || !isValidReference(reference)) return { kind: "missing" };

  try {
    const tx = await verifyTransaction(reference);

    if (tx.status === "success") {
      if (!isPaymentValid(tx)) {
        console.error("Payment amount or currency mismatch:", reference);
        return { kind: "error" };
      }
      return {
        kind: "success",
        name: typeof tx.metadata?.name === "string" ? tx.metadata.name : undefined,
        skill:
          typeof tx.metadata?.skill === "string" ? tx.metadata.skill : undefined,
      };
    }

    if (tx.status === "failed" || tx.status === "abandoned") {
      return { kind: "failed" };
    }
    return { kind: "pending" };
  } catch (error) {
    console.error("Payment verification failed:", error);
    return { kind: "error" };
  }
}

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    reference?: string | string[];
    trxref?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const reference = first(params.reference) ?? first(params.trxref);
  const outcome = await getOutcome(reference);

  const buttonClass =
    "inline-block rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark";

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-page py-16 md:py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="rounded-2xl border border-fg/10 bg-fg/5 p-8 sm:p-10">
            {outcome.kind === "success" && (
              <>
                <div className="text-5xl" aria-hidden>
                  🎉
                </div>
                <h1 className="mt-5 text-3xl font-bold text-fg">
                  Payment confirmed
                </h1>
                <p className="mt-4 text-fg/70">
                  Thank you{outcome.name ? `, ${outcome.name}` : ""}.
                  {outcome.skill
                    ? ` Your place in ${outcome.skill} is secured.`
                    : " Your place is secured."}
                </p>
                <p className="mt-3 text-fg/70">
                  Your Google Meet class link will be sent to the email you
                  registered with.
                </p>
                {/* Temporary note: remove in Part 2b */}
                <p className="mt-5 rounded-lg border border-accent/50 bg-accent/10 p-3 text-sm text-fg">
                  Developer note: the class-link email is added in the next
                  step.
                </p>
              </>
            )}

            {outcome.kind === "pending" && (
              <>
                <div className="text-5xl" aria-hidden>
                  ⏳
                </div>
                <h1 className="mt-5 text-3xl font-bold text-fg">
                  Payment still processing
                </h1>
                <p className="mt-4 text-fg/70">
                  Your bank hasn&apos;t confirmed this payment yet. Please wait
                  a minute and refresh this page.
                </p>
              </>
            )}

            {outcome.kind === "failed" && (
              <>
                <div className="text-5xl" aria-hidden>
                  ❌
                </div>
                <h1 className="mt-5 text-3xl font-bold text-fg">
                  Payment not completed
                </h1>
                <p className="mt-4 text-fg/70">
                  The payment didn&apos;t go through and you haven&apos;t been
                  charged. You can try again.
                </p>
                <div className="mt-8">
                  <Link href="/join" className={buttonClass}>
                    Try again
                  </Link>
                </div>
              </>
            )}

            {outcome.kind === "error" && (
              <>
                <div className="text-5xl" aria-hidden>
                  ⚠️
                </div>
                <h1 className="mt-5 text-3xl font-bold text-fg">
                  We couldn&apos;t confirm your payment
                </h1>
                <p className="mt-4 text-fg/70">
                  Please refresh this page in a moment. If you were charged and
                  this keeps happening, contact us and quote your payment
                  reference.
                </p>
                {reference && isValidReference(reference) && (
                  <p className="mt-3 break-all text-sm text-fg/60">
                    Reference: {reference}
                  </p>
                )}
                <div className="mt-8">
                  <Link href="/#contact" className={buttonClass}>
                    Contact us
                  </Link>
                </div>
              </>
            )}

            {outcome.kind === "missing" && (
              <>
                <h1 className="text-3xl font-bold text-fg">
                  No payment found
                </h1>
                <p className="mt-4 text-fg/70">
                  This page shows the result of a payment. To register for a
                  class, start from the join page.
                </p>
                <div className="mt-8">
                  <Link href="/join" className={buttonClass}>
                    Go to registration
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}