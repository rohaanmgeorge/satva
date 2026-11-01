"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/store";

const LINES = [
  "> boot satva.core --future",
  "> loading modules: technology · vision · ai",
  "> compiling alliance … ok",
  "> code for future_",
];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { v: 0 };
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");

    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    if (reduce) {
      tl.to(el, { autoAlpha: 0, duration: 0.3, onStart: markReady });
      return () => {
        tl.kill();
      };
    }

    tl.to(counter, {
      v: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
      },
    })
      .from(lines, { opacity: 0, x: -12, stagger: 0.42, duration: 0.3, ease: "power2.out" }, 0.1)
      .to("[data-pre-content]", { opacity: 0, y: -30, duration: 0.5, ease: "power3.in" }, "+=0.15")
      .to("[data-panel]", {
        yPercent: -100,
        duration: 1.1,
        ease: "expo.inOut",
        stagger: 0.07,
      }, "-=0.1")
      .call(markReady, [], "-=0.75");

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90]" role="status" aria-label="Loading SATVA">
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} data-panel className="h-full flex-1 bg-bg-2" style={{ marginLeft: i ? -1 : 0 }} />
        ))}
      </div>
      <div data-pre-content className="section-pad relative flex h-full flex-col justify-between py-8 font-mono text-xs text-muted sm:text-sm">
        <div className="flex justify-between">
          <span>SATVA©2026</span>
          <span>Code for future</span>
        </div>
        <div className="space-y-1.5">
          {LINES.map((l, i) => (
            <p key={i} data-line className={i === LINES.length - 1 ? "text-grad" : ""}>
              {l}
            </p>
          ))}
        </div>
        <div>
          <div className="flex items-end justify-between">
            <span className="display text-6xl text-fg sm:text-8xl md:text-[10rem]">
              <span ref={count}>000</span>
            </span>
            <span className="pb-2">%</span>
          </div>
          <div className="mt-4 h-px w-full bg-line">
            <div ref={bar} className="h-full origin-left scale-x-0" style={{ background: "var(--grad)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
