"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { onReady } from "@/lib/store";
import { site } from "@/lib/content";

const ACRONYM = [
  ["S", "oft"],
  ["A", "lliance for"],
  ["T", "echnology,"],
  ["V", "ision &"],
  ["A", "I"],
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        if (ctx.conditions?.reduce) return;

        const split = SplitText.create("[data-hero-title]", { type: "chars,lines", linesClass: "split-line" });
        // keep one continuous gradient across the split chars of the gradient line
        const paintGradient = () => {
          root.current?.querySelectorAll<HTMLElement>("[data-grad-line]").forEach((line) => {
            line.classList.remove("text-grad");
            const w = line.offsetWidth;
            line.querySelectorAll<HTMLElement>(":scope > div, :scope div").forEach((c) => {
              if (c.classList.contains("split-line")) return;
              c.classList.add("text-grad");
              c.style.backgroundSize = `${w}px 100%`;
              c.style.backgroundPosition = `${-c.offsetLeft}px 0`;
            });
          });
        };
        paintGradient();
        window.addEventListener("resize", paintGradient);

        const intro = gsap.timeline({ paused: true });
        intro
          .from(split.chars, { yPercent: 115, rotate: 8, duration: 1.4, stagger: 0.035, ease: "expo.out" })
          .from("[data-acro-letter]", { opacity: 0, y: 20, stagger: 0.06, duration: 0.8, ease: "expo.out" }, 0.4)
          .from("[data-acro-rest]", { opacity: 0, x: -8, stagger: 0.06, duration: 0.8, ease: "expo.out" }, 0.75)
          .from("[data-hero-fade]", { opacity: 0, y: 16, stagger: 0.1, duration: 1, ease: "power3.out" }, 0.8)
          .from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" }, 0.2);
        const off = onReady(() => intro.play());

        // scroll out: title drifts, blurs and fades as the scene morphs
        gsap.to("[data-hero-inner]", {
          yPercent: -18,
          opacity: 0,
          filter: "blur(10px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-scroll-cue]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "15% top", scrub: true },
        });

        return () => {
          off();
          window.removeEventListener("resize", paintGradient);
          split.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-morph="0" data-opacity="1" className="section-pad relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28">
      <div data-hero-inner className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-10">
          <p data-hero-fade className="eyebrow flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-lime" /> Coding club · Est. 2024
          </p>
          <p data-hero-fade className="eyebrow hidden sm:block">[ scroll to compile ]</p>
        </div>

        <h1
          data-hero-title
          aria-label={`${site.name}. ${site.tagline}.`}
          className="display text-[17vw] font-extrabold uppercase leading-[0.82] md:text-[13.5vw]"
        >
          <span className="block">Code for</span>
          <span data-grad-line className="relative block w-fit text-grad">
            future
          </span>
        </h1>

        <div data-hero-line className="mt-8 h-px w-full bg-line md:mt-10" />

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-12">
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm uppercase tracking-widest md:col-span-7 md:text-base" aria-label={site.expansion}>
            {ACRONYM.map(([l, rest], i) => (
              <span key={i} className="inline-flex" aria-hidden>
                <span data-acro-letter className="text-grad font-bold">
                  {l}
                </span>
                <span data-acro-rest className="text-muted">
                  {rest}
                </span>
              </span>
            ))}
          </p>
          <p data-hero-fade className="max-w-md text-base text-muted md:col-span-5 md:justify-self-end md:text-right">
            A student alliance of builders shaping what comes next — through technology, computer vision and artificial intelligence.
          </p>
        </div>
      </div>

      <div data-scroll-cue className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" aria-hidden>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_ease-in-out_infinite]" style={{ background: "var(--grad)" }} />
        </span>
      </div>
      <style>{`@keyframes cue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
