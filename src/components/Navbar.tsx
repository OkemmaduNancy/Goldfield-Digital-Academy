"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Goldfield Academy logo"
            width={44}
            height={44}
            priority
          />
          <span className="text-lg font-semibold tracking-wide text-cream">
            Goldfield <span className="text-gold"> Digital </span> Academy
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-cream/80 transition hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#join"
              className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition hover:bg-gold-dark"
            >
              Join Now
            </a>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/40 text-gold md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <ul className="space-y-1 border-t border-gold/20 bg-ink px-6 py-4 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-cream/90 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold px-5 py-2 text-center font-semibold text-ink"
            >
              Join Now
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
