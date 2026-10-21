"use client";

import { useState } from "react";
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
  const [ready, setReady] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setReady(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateRegistration(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setReady(false);
      return;
    }

    // Part 2: this is where we will start the Paystack payment.
    setReady(true);
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

      <button
        type="submit"
        className="w-full rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark"
      >
        Pay Now
      </button>

      <p className="text-center text-xs text-fg/60">
        Secure payment by Paystack. After payment is confirmed, your Google Meet
        class link is sent to your email.
      </p>

      {/* Temporary message: remove in Part 2 */}
      {ready && (
        <p
          role="status"
          className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-sm text-fg"
        >
          ✅ Your details look good. Payment isn&apos;t connected yet.
          We&apos;ll add Paystack in Part 2.
        </p>
      )}
    </form>
  );
}
