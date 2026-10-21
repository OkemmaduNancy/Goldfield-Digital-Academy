"use client";

import { reviews } from "@/data/Reviews";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  function showReview(index: number) {
    setActiveIndex((index + reviews.length) % reviews.length);
  }

  return (
    <section id="reviews" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div data-scroll-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            Student Reviews
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            What our students say
          </h2>
        </div>

        <div
          data-scroll-reveal
          className="mt-4"
          role="region"
          aria-roledescription="carousel"
          aria-label="Student reviews"
        >
          <div className="overflow-hidden" aria-live="off">
            <div
              className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <figure
                  key={review.name}
                  className="min-w-full rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
                  aria-roledescription="slide"
                  aria-label={`Review ${index + 1} of ${reviews.length}`}
                  aria-hidden={index !== activeIndex}
                >
                  <div className="text-3xl leading-none text-gold-dark" aria-hidden>
                    “
                  </div>
                  <blockquote className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-ink/10 pt-4">
                    <p className="font-semibold text-ink">{review.name}</p>
                    <p className="text-sm text-ink/60">{review.skill}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark"
              aria-label="Previous review"
              onClick={() => showReview(activeIndex - 1)}
            >
              Previous
            </button>
            <p className="text-sm text-ink/60" aria-live="polite">
              {activeIndex + 1} / {reviews.length}
            </p>
            <button
              type="button"
              className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark"
              aria-label="Next review"
              onClick={() => showReview(activeIndex + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
