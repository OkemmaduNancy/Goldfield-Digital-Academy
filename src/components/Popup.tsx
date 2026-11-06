"use client";

import { useEffect } from "react";

export default function Popup({
  open,
  onClose,
  title,
  children,
  bare = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // bare: no built-in title or padding, so the content controls its own layout
  bare?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={bare ? title : undefined}
        aria-labelledby={bare ? undefined : "popup-title"}
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-fg/10 bg-page shadow-2xl ${
          bare ? "" : "p-8 text-center"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition ${
            bare
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-fg/60 hover:bg-fg/10 hover:text-fg"
          }`}
        >
          ✕
        </button>

        {bare ? (
          children
        ) : (
          <>
            <h2 id="popup-title" className="text-2xl font-bold text-fg">
              {title}
            </h2>
            <div className="mt-4 space-y-3 text-fg/70">{children}</div>
          </>
        )}
      </div>
    </div>
  );
}
