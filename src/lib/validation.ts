import { skills } from "@/data/skills";

export type RegistrationValues = {
  name: string;
  email: string;
  skill: string;
};

export type RegistrationErrors = Partial<
  Record<keyof RegistrationValues, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(
  values: RegistrationValues,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (name.length < 2) {
    errors.name = "Please enter your full name.";
  } else if (name.length > 100) {
    errors.name = "That name is too long.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.skill) {
    errors.skill = "Please choose a skill.";
  } else if (!skills.some((skill) => skill.name === values.skill)) {
    errors.skill = "Please choose a skill from the list.";
  }

  return errors;
}
