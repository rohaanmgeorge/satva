"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { projects, type ProjectCategory } from "@/lib/content";

const FILTERS: ("All" | ProjectCategory)[] = ["All", "AI", "Vision", "Web", "Systems"];

function Art({ hue, seed }: { hue: number; seed: number }) {
  // simple generative cover: gradient orb + grid + orbit rings
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at ${30 + (seed * 17) % 40}% ${35 + (seed * 23) % 30}%, hsl(${hue} 90% 60% / .85), transparent 55%),
                       radial-gradient(circle at ${70 - (seed * 13) % 30}% 80%, hsl(${(hue + 80) % 360} 85% 55% / .6), transparent 50%),
                       #0b0d14`,
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at 50% 50%, #000, transparent 75%)",
        }}
      />
      <svg viewBox="0 0 200 200" className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-40 transition-transform duration-[2s] ease-[var(--ease-out)] group-hover:rotate-45">
        {[40, 62, 84].map((r, i) => (
          <ellipse key={r} cx="100" cy="100" rx={r} ry={r * 0.42} fill="none" stroke="white" strokeWidth=".4" transform={`rotate(${seed * 30 + i * 35} 100 100)`} />
        ))}
      </svg>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-pj-head] > *", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.utils.toArray<HTMLElement>("[data-pj]").forEach((card, i) => {
          gsap.from(card, {
            y: 100,
            opacity: 0,
            rotateX: -12,
            duration: 1.2,
            delay: (i % 3) * 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          });
        });
      });
    },
    { scope: root },
  );

  // re-animate visible cards when the filter changes
  useGSAP(
    () => {
      gsap.fromTo("[data-pj]:not([hidden])", { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.05, ease: "expo.out" });
    },
    { scope: root, dependencies: [filter], revertOnUpdate: false },
  );

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: px * 10, rotateX: -py * 10, duration: 0.6, ease: "power3.out", transformPerspective: 900 });
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = (e: React.PointerEvent<HTMLElement>) => gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });

  return (
    <section ref={root} id="projects" data-morph="4" data-opacity="0.2" className="section-pad relative py-24 md:py-36">
      <div data-pj-head className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">( 04 ) Projects</span>
          <h2 className="display mt-6 text-5xl font-extrabold uppercase md:text-[6vw]">
            Shipped <span className="text-grad">by us</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                filter === f ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg/50 hover:text-fg"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 [perspective:1200px] sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {projects.map((p, i) => (
          <article
            key={p.title}
            data-pj
            hidden={filter !== "All" && filter !== p.category}
            onPointerMove={tilt}
            onPointerLeave={reset}
            data-cursor="View"
            className="group grad-border relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-6 [transform-style:preserve-3d] md:p-7"
          >
            <Art hue={p.hue} seed={i + 1} />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.12), transparent 40%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/70 to-transparent" aria-hidden />
            <div className="relative [transform:translateZ(40px)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-fg/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">{p.category}</span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="display mt-4 text-3xl font-extrabold uppercase">{p.title}</h3>
              <p className="mt-3 text-sm text-fg/70">{p.description}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">{p.stack.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
