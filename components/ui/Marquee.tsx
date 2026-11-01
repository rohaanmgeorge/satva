"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scene } from "@/lib/store";

/** Infinite marquee whose speed and direction react to scroll velocity. */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const tween = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
      );
      let dir = 1;
      const tick = () => {
        const v = scene.velocity;
        if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
        const target = dir * (1 + Math.min(Math.abs(v) * 0.12, 5));
        tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.1);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
