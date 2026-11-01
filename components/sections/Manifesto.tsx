"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { manifesto, manifestoHighlights } from "@/lib/content";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = manifesto.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12, filter: "blur(4px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-para]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.from("[data-about-meta] > *", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-morph="1" data-opacity="0.75" className="section-pad relative py-32 md:py-48">
      <div data-about-meta className="mb-10 flex items-center gap-4 md:mb-16">
        <span className="eyebrow">( 01 ) About</span>
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow">Manifesto</span>
      </div>
      <p data-para className="display max-w-[22ch] text-[8.5vw] font-semibold leading-[1.02] md:text-[5.2vw]">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span data-word className={`inline-block ${manifestoHighlights.includes(w) ? "text-grad" : ""}`}>
              {w}
            </span>{" "}
          </Fragment>
        ))}
      </p>
      <div data-about-meta className="mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
        {[
          ["Learn", "Peer-led workshops, study circles and mentorship from seniors and alumni."],
          ["Build", "Real projects, hackathon teams and open-source contributions — not just tutorials."],
          ["Lead", "Run events, teach what you know, and grow the alliance for the next batch."],
        ].map(([t, d], i) => (
          <div key={t} className="border-t border-line pt-6">
            <p className="font-mono text-xs text-muted">0{i + 1}</p>
            <h3 className="display mt-3 text-2xl">{t}</h3>
            <p className="mt-3 max-w-sm text-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
