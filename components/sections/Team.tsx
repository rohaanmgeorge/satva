"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { team } from "@/lib/content";

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

export default function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-tm-head] > *", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from("[data-member]", {
          clipPath: "inset(100% 0 0 0)",
          y: 40,
          stagger: { each: 0.08, grid: "auto", from: "start" },
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-team-grid]", start: "top 85%" },
        });
      });
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        // columns drift at different speeds for depth
        gsap.utils.toArray<HTMLElement>("[data-member]").forEach((m, i) => {
          gsap.to(m, {
            yPercent: i % 2 ? -12 : 6,
            ease: "none",
            scrollTrigger: { trigger: "[data-team-grid]", start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="team" data-morph="4" data-opacity="0.2" className="section-pad relative py-24 md:py-36">
      <div data-tm-head className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">( 05 ) Team</span>
          <h2 className="display mt-6 text-5xl font-extrabold uppercase md:text-[6vw]">
            The <span className="text-grad">core</span>
          </h2>
        </div>
        <p className="max-w-sm text-muted">The people who keep the servers running, the events happening and the ideas flowing.</p>
      </div>

      <div data-team-grid className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-5">
        {team.map((m, i) => (
          <article key={m.name} data-member className="group grad-border relative aspect-[3/4] overflow-hidden rounded-2xl bg-bg-2">
            <div
              aria-hidden
              className="absolute inset-0 opacity-70 transition-all duration-700 ease-[var(--ease-out)] group-hover:scale-110 group-hover:opacity-100"
              style={{
                background: `conic-gradient(from ${i * 45}deg at 50% 60%, #22d3ee, #8b5cf6, #a3e635, #22d3ee)`,
                filter: "blur(40px) saturate(120%)",
              }}
            />
            <div className="absolute inset-0 bg-bg/40" aria-hidden />
            <span
              aria-hidden
              className="display absolute inset-0 grid place-items-center text-6xl font-extrabold text-fg/90 mix-blend-overlay transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-125 md:text-8xl"
            >
              {initials(m.name)}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-fg/70">{m.role}</p>
              <h3 className="display mt-1 text-base font-semibold md:text-xl">{m.name}</h3>
              <p className="mt-1 max-h-0 overflow-hidden font-mono text-xs text-fg/60 opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:opacity-100">
                {m.handle}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
