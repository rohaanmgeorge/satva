"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Dot + lagging ring. Grows over [data-cursor] / links; shows a label from data-cursor="text". */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    document.documentElement.classList.add("has-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 1 });

    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      if (!t) return;
      const text = t.dataset.cursor;
      if (text && label.current) label.current.textContent = text;
      gsap.to(r, { scale: text ? 3.2 : 1.8, backgroundColor: text ? "rgba(238,241,247,1)" : "rgba(238,241,247,0)", duration: 0.4, ease: "expo.out" });
      gsap.to(label.current, { opacity: text ? 1 : 0, duration: 0.25 });
      gsap.to(d, { scale: 0, duration: 0.3 });
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      const rel = (e.relatedTarget as HTMLElement | null)?.closest?.("a, button, [data-cursor]");
      if (!t || t === rel) return;
      gsap.to(r, { scale: 1, backgroundColor: "rgba(238,241,247,0)", duration: 0.4, ease: "expo.out" });
      gsap.to(label.current, { opacity: 0, duration: 0.2 });
      gsap.to(d, { scale: 1, duration: 0.3 });
    };
    const down = () => gsap.to(r, { scale: "-=0.3", duration: 0.15 });
    const up = () => gsap.to(r, { scale: "+=0.3", duration: 0.3 });
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-fg opacity-0 mix-blend-difference" />
      <div
        ref={ring}
        className="fixed left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-fg/70 opacity-0 mix-blend-difference"
      >
        <span ref={label} className="font-mono text-[4px] font-bold uppercase tracking-wider text-black opacity-0" />
      </div>
    </div>
  );
}
