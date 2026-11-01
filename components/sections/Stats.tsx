"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { stats } from "@/lib/content";
import Marquee from "../ui/Marquee";

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const obj = { v: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            v: end,
            duration: 2.2,
            ease: "expo.out",
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
        gsap.from("[data-stat]", {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-stats-grid]", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-morph="4" data-opacity="0.35" className="relative py-24 md:py-36">
      <Marquee className="border-y border-line py-6 md:py-8" speed={30}>
        {["Technology", "Vision", "AI", "Open Source", "Hackathons", "Research"].map((w) => (
          <span key={w} className="display flex items-center px-6 text-4xl font-extrabold uppercase md:px-10 md:text-7xl">
            <span className={w === "AI" ? "text-grad" : "text-fg/90"}>{w}</span>
            <span className="ml-12 text-2xl text-violet md:ml-20 md:text-4xl">✦</span>
          </span>
        ))}
      </Marquee>

      <div data-stats-grid className="section-pad mt-20 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-28 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} data-stat className="border-l border-line pl-5">
            <p className="display text-5xl font-extrabold md:text-7xl">
              <span data-count={s.value}>{s.value}</span>
              <span className="text-grad">{s.suffix}</span>
            </p>
            <p className="eyebrow mt-3">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
