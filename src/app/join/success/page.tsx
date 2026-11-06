import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock,
  Info,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fulfillPayment, type FulfillmentResult } from "@/lib/fulfillment";
import { isValidReference } from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Payment status | Goldfield Digital Academy",
  robots: { index: false, follow: false },
};

type Outcome = FulfillmentResult | { kind: "missing" } | { kind: "error" };

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "your email";
  return `${user[0]}***@${domain}`;
}

async function getOutcome(reference?: string): Promise<Outcome> {
  if (!reference || !isValidReference(reference)) return { kind: "missing" };
  try {
    return await fulfillPayment(reference);
  } catch (error) {
    console.error("Payment check failed:", error);
    return { kind: "error" };
  }
}

const buttonClass =
  "inline-block rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark";

function StatusCard({
  icon,
  title,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icon;

  return (
    <>
      {Icon && (
        <div className="flex justify-center text-accent" aria-hidden>
          <Icon className="h-12 w-12" strokeWidth={1.7} />
        </div>
      )}
      <h1 className="mt-5 text-3xl font-bold text-fg">{title}</h1>
      <div className="mt-4 space-y-3 text-fg/70">{children}</div>
    </>
  );
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

  const showReference = reference && isValidReference(reference);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-page py-16 md:py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="rounded-2xl border border-fg/10 bg-fg/5 p-8 sm:p-10">
            {outcome.kind === "paid" && outcome.emailStatus === "sent" && (
              <StatusCard icon={BadgeCheck} title="Payment confirmed">
                <p>
                  Thank you, {outcome.name}. Your place in {outcome.skill} is
                  secured.
                </p>
                <p>
                  We&apos;ve emailed your Telegram group link to{" "}
                  {maskEmail(outcome.email)}. Join the group to get your class
                  details. If it doesn&apos;t arrive in a few minutes, check
                  your spam folder.
                </p>
              </StatusCard>
            )}

            {outcome.kind === "paid" &&
              outcome.emailStatus === "in_progress" && (
                <StatusCard icon={BadgeCheck} title="Payment confirmed">
                  <p>
                    Thank you, {outcome.name}. Your place in {outcome.skill} is
                    secured.
                  </p>
                  <p>
                    Your email is being sent. Refresh this page in a minute to
                    check.
                  </p>
                </StatusCard>
              )}

            {outcome.kind === "paid" && outcome.emailStatus === "failed" && (
              <>
                <StatusCard icon={CircleCheck} title="Payment confirmed">
                  <p>
                    Thank you, {outcome.name}. Your place in {outcome.skill} is
                    secured.
                  </p>
                  <p>
                    We couldn&apos;t send your Telegram group link just now.
                    Please refresh this page in a minute and we&apos;ll try
                    again, or contact us.
                  </p>
                  {showReference && (
                    <p className="break-all text-sm text-fg/60">
                      Reference: {reference}
                    </p>
                  )}
                </StatusCard>
                <div className="mt-8">
                  <Link href="/#contact" className={buttonClass}>
                    Contact us
                  </Link>
                </div>
              </>
            )}

            {outcome.kind === "not_paid" && outcome.reason === "pending" && (
              <StatusCard icon={Clock} title="Payment still processing">
                <p>
                  Your bank hasn&apos;t confirmed this payment yet. Please wait
                  a minute and refresh this page.
                </p>
              </StatusCard>
            )}

            {outcome.kind === "not_paid" && outcome.reason === "failed" && (
              <>
                <StatusCard icon={CircleX} title="Payment not completed">
                  <p>
                    The payment didn&apos;t go through and you haven&apos;t been
                    charged. You can try again.
                  </p>
                </StatusCard>
                <div className="mt-8">
                  <Link href="/join" className={buttonClass}>
                    Try again
                  </Link>
                </div>
              </>
            )}

            {outcome.kind === "duplicate" && (
              <>
                <StatusCard icon={Info} title="This email is already registered">
                  <p>
                    This email address already has a place at Goldfield Digital Academy,
                    so this payment wasn&apos;t registered as a second place.
                    Please contact us with the reference below so we can sort it
                    out.
                  </p>
                  {showReference && (
                    <p className="break-all text-sm text-fg/60">
                      Reference: {reference}
                    </p>
                  )}
                </StatusCard>
                <div className="mt-8">
                  <Link href="/#contact" className={buttonClass}>
                    Contact us
                  </Link>
                </div>
              </>
            )}

            {(outcome.kind === "error" || outcome.kind === "mismatch") && (
              <>
                <StatusCard
                  icon={CircleQuestionMark}
                  title="We couldn't confirm your payment"
                >
                  <p>
                    Please refresh this page in a moment. If you were charged
                    and this keeps happening, contact us and quote your payment
                    reference.
                  </p>
                  {showReference && (
                    <p className="break-all text-sm text-fg/60">
                      Reference: {reference}
                    </p>
                  )}
                </StatusCard>
                <div className="mt-8">
                  <Link href="/#contact" className={buttonClass}>
                    Contact us
                  </Link>
                </div>
              </>
            )}

            {(outcome.kind === "missing" || outcome.kind === "ignored") && (
              <>
                <StatusCard title="No payment found">
                  <p>
                    This page shows the result of a payment. To register for a
                    class, start from the join page.
                  </p>
                </StatusCard>
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
