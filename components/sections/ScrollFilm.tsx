"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { scene } from "@/lib/store";
import { filmChapters } from "@/lib/content";

/**
 * A pinned "film" — scrolling scrubs the WebGL particle scene through
 * SATVA wordmark → DNA helix → globe, like scrubbing a video timeline.
 */
export default function ScrollFilm() {
  const root = useRef<HTMLElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        const reduce = ctx.conditions?.reduce;
        const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
        const TOTAL = 12; // seconds of "footage"

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: reduce ? true : 0.8,
            onUpdate: (self) => {
              // morph the global scene: 2 (SATVA) → 3 (helix) → 4 (globe).
              // Only written while scrolled into the film, so page load keeps the hero orb.
              if (self.progress > 0) {
                const T = self.progress * 4.4;
                scene.morph = T < 1 ? 2 : T < 2 ? 2 + (T - 1) : T < 2.6 ? 3 : T < 3.6 ? 3 + (T - 2.6) : 4;
              }
              const s = self.progress * TOTAL;
              const mm2 = String(Math.floor(s / 60)).padStart(2, "0");
              const ss = String(Math.floor(s % 60)).padStart(2, "0");
              const ff = String(Math.floor((s % 1) * 24)).padStart(2, "0");
              if (time.current) time.current.textContent = `00:${mm2}:${ss}:${ff}`;
              if (frame.current) frame.current.textContent = String(Math.floor(self.progress * 288)).padStart(4, "0");
            },
          },
        });

        tl.to("[data-film-progress]", { scaleX: 1, duration: 4.4 }, 0);

        // chapter captions
        const at = [0, 1.6, 3.2];
        chapters.forEach((c, i) => {
          if (i > 0) tl.fromTo(c, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.4, ease: "power2.out" }, at[i]);
          if (i < chapters.length - 1) tl.to(c, { autoAlpha: 0, yPercent: -40, duration: 0.35, ease: "power2.in" }, at[i + 1] - 0.4);
        });
        gsap.utils.toArray<HTMLElement>("[data-tick]").forEach((t, i) => {
          tl.to(t, { backgroundColor: "#eef1f7", duration: 0.1 }, at[i]);
        });

        return () => tl.kill();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="film"
      data-morph="2"
      data-opacity="1"
      className="section-pad relative h-[100svh] overflow-hidden"
      aria-label="SATVA story"
    >
      {/* viewfinder frame */}
      <div className="pointer-events-none absolute inset-4 md:inset-8" aria-hidden>
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-fg/50 md:h-10 md:w-10 ${c}`} />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between py-10 md:py-14">
        <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-widest text-muted md:text-xs">
          <span className="flex items-center gap-2 text-fg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> REC
          </span>
          <span className="hidden sm:block">SATVA_FILM_v26.mp4 · 4K · 24FPS</span>
          <span>
            FR <span ref={frame}>0000</span>
          </span>
        </div>

        <div className="relative mb-8 mt-auto h-36 md:my-0 md:h-44">
          {filmChapters.map((c, i) => (
            <div key={c.ch} data-chapter className={`absolute inset-x-0 bottom-0 ${i ? "invisible opacity-0" : ""}`}>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                {c.ch} — {c.title}
              </p>
              <p className="display mt-3 text-4xl font-extrabold uppercase md:text-7xl">{c.line}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[11px] text-muted md:text-xs">
            <span ref={time}>00:00:00:00</span>
            <span>00:00:12:00</span>
          </div>
          <div className="relative mt-3 h-[3px] w-full bg-line">
            <div data-film-progress className="absolute inset-0 origin-left scale-x-0" style={{ background: "var(--grad)" }} />
            {[0, 36, 73].map((p) => (
              <span key={p} data-tick className="absolute top-1/2 h-3 w-[3px] -translate-y-1/2 bg-muted" style={{ left: `${p}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
