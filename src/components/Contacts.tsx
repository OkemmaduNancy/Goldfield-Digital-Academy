import { contactItems, type ContactItem } from "@/data/contacts";
// import ContactForm from "./ContactForm";
import Student from "@/components/assets/Student.png"

function ContactIcon({ icon }: { icon: ContactItem["icon"] }) {
  const svgProps = {
    "aria-hidden": true as const,
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
  };

  switch (icon) {
    case "phone":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.06 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "email":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "x":
      return (
        <svg {...svgProps} fill="currentColor">
          <path d="M18.9 1.2h3.7l-8 9.2 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9zm-1.3 19.5h2L6.5 3.2H4.3z" />
        </svg>
      );
  }
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-fg/10 bg-page py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 ">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          
          <div className="" data-scroll-reveal>
            <img src={Student.src} alt="Student" className="rounded-2xl w-100" />
          </div>
          {/* Left: details */}
          <div data-scroll-reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Contact Us
            </p>
            <h2 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
              Have a question? Get in touch
            </h2>
            <p className="mt-5 max-w-md text-fg/70">
              Reach out through any of these channels, or send us a message and
              we will get back to you.
            </p>

            <ul className="mt-10 space-y-4">
              {contactItems.map((item) => {
                const inner = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-accent">
                      <ContactIcon icon={item.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-fg/60">
                        {item.label}
                      </span>
                      <span
                        className={`block truncate font-semibold ${
                          item.isPlaceholder ? "text-fg/50" : "text-fg"
                        }`}
                      >
                        {item.value}
                      </span>
                    </span>
                  </>
                );

                if (item.isPlaceholder || !item.href) {
                  return (
                    <li
                      key={item.label}
                      className="relative flex items-center gap-4 rounded-2xl border-2 border-dashed border-accent/40 p-4"
                    >
                      <span className="absolute -top-3 right-4 rounded-full bg-gold px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">
                        Placeholder
                      </span>
                      {inner}
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-2xl border border-fg/10 bg-fg/5 p-4 transition hover:-translate-y-0.5 hover:border-accent/60"
                    >
                      {inner}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: form */}
          {/* <div className="rounded-2xl border border-fg/10 bg-fg/5 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-fg">Send us a message</h3>
            <p className="mt-1 text-sm text-fg/60">
              We will reply as soon as we can.
            </p>
            <ContactForm />
          </div> */}
        </div>
      </div>
    </section>
  );
}
