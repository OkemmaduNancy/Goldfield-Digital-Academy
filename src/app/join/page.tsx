import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";
import Student from "@/components/assets/Student.png";

export const metadata: Metadata = {
  title: "Join Goldfield Digital Academy",
  description:
    "Register for a live class and pay the registration fee to secure your place.",
};

export default function JoinPage() {
  return (
    <>
      <Navbar />
      <main className="relative isolate min-h-[70vh] overflow-hidden bg-ink py-16 md:py-24">
        <Image
          src={Student}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[35%_15%] opacity-100"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/80 to-ink/85"
        />
        <div className="relative z-10 mx-auto max-w-xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Join Now
            </p>
            <h1 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
              Register for a class
            </h1>
            <p className="mt-5 text-fg/70">
              Enter your details, choose your skill and pay the registration fee
              to secure your place.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-fg/10 bg-fg/5 p-6 sm:p-8">
            <RegistrationForm />
          </div>

          <p className="mt-8 text-center text-sm">
            <Link href="/#home" className="text-fg/70 transition hover:text-accent">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
