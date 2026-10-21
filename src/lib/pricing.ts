// The registration fee in naira. This is the single source of truth.
export const REGISTRATION_FEE = 8000;

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
