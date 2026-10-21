import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div data-scroll-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Skills We Teach
          </p>
          <h2 className="mt-3 text-3xl font-bold text-cream md:text-4xl">
            Choose the skill you want to learn
          </h2>
          <p className="mt-5 text-cream/70">
            Pick one skill when you register and join a live class.
          </p>
        </div>

        <div data-scroll-reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-2xl border border-gold/20 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-gold/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-2xl">
                {skill.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-cream">
                {skill.name}
              </h3>
              <p className="mt-2 text-sm text-cream/70">{skill.description}</p>
            </div>
          ))}
        </div>

        <div data-scroll-reveal className="mt-12 text-center">
          <a
            href="/join"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-ink transition hover:bg-gold-dark"
          >
            Join Now
          </a>
        </div>
      </div>
    </section>
  );
}
