export type ContactItem = {
  label: string;
  value: string;
  href?: string;
  icon: "phone" | "instagram" | "email" | "x";
  isPlaceholder?: boolean;
};

// TODO: Replace the placeholders with real details from the client.
// When you do, add an `href`, and delete `isPlaceholder: true`.
export const contactItems: ContactItem[] = [
  {
    label: "Phone / WhatsApp",
    value: "+234 904 630 2127",
    href: "https://wa.me/2349046302127",
    icon: "phone",
  },
  {
    label: "Instagram",
    value: "@goldfield_groups",
    href: "https://instagram.com/goldfield_groups",
    icon: "instagram",
  },
  {
    label: "Email",
    value: "@goldfieldgroups.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@goldfieldgroups.com",
    icon: "email",
  },
  {
    label: "Twitter",
    value: "@goldfieldgroups",
    href: "https://x.com/goldfieldgroups?s=11",
    icon: "x",
  }
];
