"use client";

import { useEffect, useState } from "react";
import { skills } from "@/data/skills";
import { REGISTRATION_FEE, formatNaira } from "@/lib/pricing";
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationValues,
} from "@/lib/validation";

const emptyValues: RegistrationValues = { name: "", email: "", skill: "" };

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-page px-4 py-3 text-fg placeholder:text-fg/40 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
    hasError ? "border-red-500" : "border-fg/20 focus:border-accent"
  }`;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegistrationForm() {
  const [values, setValues] = useState<RegistrationValues>(emptyValues);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [setShowDuplicate] = useState(false);

  // If the student presses Back from Paystack, make the button usable again
  useEffect(() => {
    function reset(e: PageTransitionEvent) {
      if (e.persisted) setSubmitting(false);
    }
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const found = validateRegistration(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 409 && data?.code === "EMAIL_ALREADY_REGISTERED") {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
        setSubmitting(false);
        return;
      }

      if (!res.ok || !data?.authorizationUrl) {
        if (data?.errors) setErrors(data.errors);
        setSubmitError(
          data?.error ?? "Something went wrong. Please try again."
        );
        setSubmitting(false);
        return;
      }

      // Send the student to Paystack's secure checkout page
      window.location.href = data.authorizationUrl;
    } catch {
      setSubmitError("Network problem. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id="name" label="Full name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Ada Okafor"
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field id="email" label="Email address" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass(Boolean(errors.email))}
        />
        <p className="mt-2 text-xs text-fg/60">
          Your class link will be sent to this email.
        </p>
      </Field>

      <Field id="skill" label="Skill you want to learn" error={errors.skill}>
        <select
          id="skill"
          name="skill"
          value={values.skill}
          onChange={handleChange}
          aria-invalid={Boolean(errors.skill)}
          aria-describedby={errors.skill ? "skill-error" : undefined}
          className={inputClass(Boolean(errors.skill))}
        >
          <option value="" className="bg-page text-black text-xl font-bold">
            Choose a skill
          </option>
          {skills.map((skill) => (
            <option
              key={skill.name}
              value={skill.name}
              className="bg-page text-black"
            >
              {skill.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Fee */}
      <div className="flex items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
        <span className="text-sm text-fg/80">Registration fee</span>
        <span className="text-lg font-bold text-accent">
          {formatNaira(REGISTRATION_FEE)}
        </span>
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
        >
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Redirecting to Paystack…" : "Pay Now"}
      </button>

      <p className="text-center text-xs text-fg/60">
        Secure payment by Paystack. After payment is confirmed, the Telegram link will be sent to your email.
      </p>
    </form>
  );
}