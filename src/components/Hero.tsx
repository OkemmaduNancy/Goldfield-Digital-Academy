export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-ink">
      {/* Soft gold glow behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
      />

      <div data-scroll-reveal className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-36">
        <span className="mb-6 rounded-full border border-gold/40 px-4 py-1 text-xs font-medium uppercase tracking-widest text-gold">
          Digital Skills Academy
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl">
          Ready to Start Your<span className="text-gold"> Journey?</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-cream/70 md:text-lg">
          Take the next step toward building the valuable skills and creating
          new opportunities for yourself. Join Goldfield Digital Academy and
          learn practical digital skills in live classes.
          Pick your skill and start learning.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/join"
            className="rounded-full bg-gold px-8 py-3 text-center font-semibold text-ink transition hover:bg-gold-dark"
          >
            Join Now
          </a>
          <a
            href="/#skills"
            className="rounded-full border border-gold/50 px-8 py-3 text-center font-semibold text-gold transition hover:bg-gold/10"
          >
            Explore Skills
          </a>
        </div>

        {/* Quick facts */}
        {/* <dl className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 border-t border-gold/20 pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-cream/60">Class format</dt>
            <dd className="mt-1 text-lg font-semibold text-cream">
              Live on Google Meet
            </dd>
          </div>
          <div>
            <dt className="text-sm text-cream/60">Registration fee</dt>
            <dd className="mt-1 text-lg font-semibold text-gold">₦8,000</dd>
          </div>
          <div>
            <dt className="text-sm text-cream/60">Get started</dt>
            <dd className="mt-1 text-lg font-semibold text-cream">
              Pay and join in minutes
            </dd>
          </div>
        </dl> */}
      </div>
    </section>
  );
}
