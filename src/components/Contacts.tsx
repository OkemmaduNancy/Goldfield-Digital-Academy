import { contactItems } from "@/data/contacts";
// import ContactForm from "./ContactForm";
import Student from "@/components/assets/Student.png"

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-fg/10 bg-page py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-scroll-reveal>
            <img src={Student.src} alt="Student" className="rounded-2xl" />
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
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-2xl">
                      {item.icon}
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
