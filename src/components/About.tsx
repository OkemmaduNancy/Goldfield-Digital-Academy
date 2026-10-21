const highlights = [
  {
    icon: "🎥",
    title: "Live online classes",
    text: "Learn in real time on Google Meet, with a tutor you can ask questions.",
  },
  {
    icon: "🛠️",
    title: "Practical skills",
    text: "Focus on skills you can use right away, not just theory.",
  },
  {
    icon: "⚡",
    title: "Simple registration",
    text: "Choose your skill, pay securely, and receive your class link by email.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div data-scroll-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            About Us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Building skills, one class at a time
          </h2>
          <p className="mt-5 text-ink/70">
            We help people and businesses grow in the digital world. Goldfield
            Digital Academy is a practical learning platform committed to
            equipping aspiring creators, entrepreneurs, and professionals with
            relevant digital skills for today's economy.
          </p>
        </div>

        <div data-scroll-reveal className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-xl">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
