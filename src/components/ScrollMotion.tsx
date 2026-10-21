"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function ScrollMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>(
      "[data-scroll-reveal]",
    );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-scroll-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    document.documentElement.dataset.scrollMotion = "true";
    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.scrollMotion;
    };
  }, [pathname]);

  return children;
}
