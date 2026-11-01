"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { events, site } from "@/lib/content";

export default function Events() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-ev-head] > *", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.utils.toArray<HTMLElement>("[data-ev]").forEach((row) => {
          gsap.from(row, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
          });
          gsap.from(row.querySelector("[data-ev-line]"), {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: row, start: "top 90%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="events" data-morph="4" data-opacity="0.2" className="section-pad relative py-24 md:py-36">
      <div data-ev-head className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">( 03 ) Events</span>
          <h2 className="display mt-6 text-5xl font-extrabold uppercase md:text-[6vw]">
            Up<span className="text-grad">coming</span>
          </h2>
        </div>
        <p className="max-w-sm text-muted">Hackathons, workshops and sprints — open to every student who wants to build. No prior experience required.</p>
      </div>

      <ul className="mt-16 md:mt-24">
        {events.map((e) => (
          <li key={e.title} data-ev className="group relative">
            <div data-ev-line className="h-px origin-left bg-line" />
            <a
              href={site.joinUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="Register"
              className="relative isolate grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 overflow-hidden py-8 md:grid-cols-[140px_1fr_200px_60px] md:gap-x-10 md:py-10"
            >
              {/* hover fill */}
              <span
                aria-hidden
                className="absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100"
                style={{ background: "linear-gradient(100deg, rgba(34,211,238,.10), rgba(139,92,246,.14), rgba(163,230,53,.08))" }}
              />
              <div className="row-span-2 md:row-span-1">
                <p className="display text-5xl font-extrabold leading-none transition-colors duration-500 group-hover:text-cyan md:text-6xl">{e.date}</p>
                <p className="mt-1 font-mono text-xs tracking-widest text-muted">
                  {e.month} {e.year}
                </p>
              </div>
              <div className="transition-transform duration-700 ease-[var(--ease-out)] md:group-hover:translate-x-4">
                <span className="mb-3 inline-block rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-lime">
                  {e.type}
                </span>
                <h3 className="display text-2xl font-semibold uppercase md:text-4xl">{e.title}</h3>
                <p className="mt-3 max-h-0 max-w-xl overflow-hidden text-muted opacity-0 transition-all duration-700 ease-[var(--ease-out)] group-hover:max-h-24 group-hover:opacity-100 max-md:max-h-24 max-md:opacity-100">
                  {e.blurb}
                </p>
              </div>
              <p className="col-start-2 font-mono text-xs uppercase tracking-widest text-muted md:col-start-auto">{e.place}</p>
              <span
                aria-hidden
                className="hidden h-14 w-14 place-items-center rounded-full border border-line text-xl transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-fg group-hover:bg-fg group-hover:text-bg md:grid"
              >
                →
              </span>
            </a>
          </li>
        ))}
        <li className="h-px bg-line" aria-hidden />
      </ul>
    </section>
  );
}
