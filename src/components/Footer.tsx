import Image from "next/image";
import Link from "next/link";
import { contactItems } from "@/data/contacts";

const quickLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const liveContacts = contactItems.filter(
    (item) => !item.isPlaceholder && item.href,
  );

  return (
    <footer className="border-t border-gold/30 bg-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Brand */}
        <div data-scroll-reveal>
          <Link href="#home" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Goldfield Academy logo"
              width={44}
              height={44}
            />
            <span className="text-lg font-semibold text-cream">
              Goldfield <span className="text-gold"> Digital </span> Academy
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-cream/60">
            Live, online classes in practical digital skills.
          </p>
        </div>

        {/* Quick links */}
        <div data-scroll-reveal>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-cream/70 transition-colors hover:text-gold focus-visible:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/join"
                className="text-sm font-semibold text-gold transition-colors hover:text-gold-dark hover:underline focus-visible:text-gold-dark"
              >
                Join Now
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div data-scroll-reveal>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-2">
            {liveContacts.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/70 transition-colors hover:text-gold focus-visible:text-gold"
                >
                  {item.label}: {item.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-scroll-reveal className="border-t border-gold/30 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Goldfield Digital Academy. All rights reserved.
      </div>
    </footer>
  );
}
