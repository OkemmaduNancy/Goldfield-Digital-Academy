"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import Popup from "@/components/Popup";

type Spots = { total: number; remaining: number };

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SpotsPopup() {
  const [spots, setSpots] = useState<Spots | null>(null);
  const [open, setOpen] = useState(false);
  const [filled, setFilled] = useState(false); // starts the ring animation

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    fetch("/api/spots")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (
          typeof data.total === "number" &&
          typeof data.remaining === "number"
        ) {
          setSpots({ total: data.total, remaining: data.remaining });
          setOpen(true);
          timer = setTimeout(() => setFilled(true), 150);
        }
      })
      .catch(() => {
        // If the count can't be loaded, show nothing rather than a wrong number
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!spots) return null;

  const taken = Math.max(0, spots.total - spots.remaining);
  const fraction = spots.total > 0 ? Math.min(1, taken / spots.total) : 0;
  const full = spots.remaining <= 0;
  const almostFull = !full && spots.remaining <= 20;
  const offset = CIRCUMFERENCE * (1 - (filled ? fraction : 0));

  return (
    <Popup
      open={open}
      onClose={() => setOpen(false)}
      title={full ? "Registration is full" : "Limited spots available"}
      bare
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gold/15 bg-ink px-6 pb-16 pt-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl"
        />
        <div className="relative flex flex-col items-center">
          <Image src="/logo.png" alt="" width={52} height={52} />
          <span className="mt-4 rounded-full border border-gold/40 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-gold">
            {full ? "Enrolment closed" : "Limited enrolment"}
          </span>
        </div>
      </div>

      {/* Counter ring, overlapping the header */}
      <div className="relative -mt-14 flex justify-center">
        <div className="relative h-32 w-32 rounded-full bg-page shadow-xl">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`${taken} of ${spots.total} spots taken`}
          >
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="9"
              className="stroke-fg/10"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="stroke-gold transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {full ? (
              <span className="text-2xl font-bold text-fg">FULL</span>
            ) : (
              <>
                <span className="text-4xl font-bold leading-none text-fg">
                  {spots.remaining}
                </span>
                <span className="mt-1 text-xs text-fg/60">
                  {spots.remaining === 1 ? "spot" : "spots"} left
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-8 pt-4 text-center">
        {almostFull && (
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            Almost full
          </p>
        )}

        <h2 className="text-2xl font-bold text-fg">
          {full ? "All seats are taken" : "Secure your seat"}
        </h2>
        <p className="mt-2 text-sm text-fg/70">
          {full
            ? `All ${spots.total} spots at Goldfield Digital Academy have been filled. Thank you for your interest.`
            : `Goldfield Digital Academy is admitting ${spots.total} students in total. Choose your skill and register in minutes.`}
        </p>

        {!full && taken > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-fg/10 bg-fg/5 py-3">
              <p className="text-xl font-bold text-fg">{taken}</p>
              <p className="text-xs text-fg/60">Registered</p>
            </div>
            <div className="rounded-xl border border-gold/40 bg-gold/10 py-3">
              <p className="text-xl font-bold text-accent">{spots.remaining}</p>
              <p className="text-xs text-fg/60">Remaining</p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {full ? (
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark"
            >
              Contact us
            </Link> 
          ) : (
            <Link
              href="/join"
              className="block w-full rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark"
            >
              Join Now
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block w-full text-sm font-medium text-fg/60 transition hover:text-fg"
          >
            {full ? "Close" : "Maybe later"}
          </button>
        </div>

        {!full && (
          <p className="mt-5 inline-flex items-center gap-1 text-xs text-fg/50">
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
            Secure payment by Paystack
          </p>
        )}
      </div>
    </Popup>
  );
}
