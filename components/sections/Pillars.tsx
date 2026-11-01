"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { pillars } from "@/lib/content";

const ACCENTS = ["var(--cyan)", "var(--violet)", "var(--lime)"];

export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-pillar-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((card) => {
          gsap.from(card.querySelectorAll("[data-par]"), {
            xPercent: 30,
            opacity: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left 95%", end: "left 35%", scrub: true },
          });
          gsap.fromTo(
            card.querySelector("[data-glyph]"),
            { rotate: -25, scale: 0.6 },
            {
              rotate: 25,
              scale: 1.1,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });

      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="pillars" data-morph="1" data-opacity="0.3" className="relative overflow-hidden md:h-[100svh] md:motion-reduce:overflow-x-auto">
      <div ref={track} className="section-pad flex h-full flex-col gap-6 py-24 md:w-max md:flex-row md:items-center md:gap-8 md:py-0">
        <div className="flex shrink-0 flex-col justify-center md:w-[38vw] md:pr-10">
          <span className="eyebrow">( 02 ) What we do</span>
          <h2 className="display mt-6 text-5xl font-extrabold uppercase md:text-[6vw]">
            Three
            <br />
            <span className="text-grad">pillars.</span>
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            Every SATVA member picks a path — or all three. Each pillar runs its own projects, workshops and study circles.
          </p>
          <div className="mt-10 hidden h-px w-56 bg-line md:block">
            <div data-pillar-progress className="h-full origin-left scale-x-0" style={{ background: "var(--grad)" }} />
          </div>
        </div>

        {pillars.map((p, i) => (
          <article
            key={p.title}
            data-pillar
            data-cursor="Explore"
            className="glass grad-border relative flex min-h-[70svh] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-7 md:h-[78svh] md:w-[min(72vw,920px)] md:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-30 blur-3xl"
              style={{ background: ACCENTS[i] }}
            />
            <div className="relative flex items-start justify-between">
              <span data-par className="font-mono text-sm text-muted">
                {p.index} / 03
              </span>
              <span
                data-glyph
                aria-hidden
                className="display text-7xl leading-none md:text-[9rem]"
                style={{ color: ACCENTS[i], textShadow: `0 0 60px ${ACCENTS[i]}` }}
              >
                {p.glyph}
              </span>
            </div>
            <div className="relative">
              <p data-par className="font-mono text-sm uppercase tracking-widest" style={{ color: ACCENTS[i] }}>
                {p.lead}
              </p>
              <h3 data-par className="display mt-3 text-[11vw] font-extrabold uppercase md:text-[5.6vw]">
                {p.title}
              </h3>
              <p data-par className="mt-5 max-w-xl text-base text-muted md:text-lg">
                {p.body}
              </p>
              <ul data-par className="mt-8 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-fg/80">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        <div className="hidden w-[6vw] shrink-0 md:block" aria-hidden />
      </div>
    </section>
  );
}
