"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { app } from "@/lib/store";
import { nav, site, socials } from "@/lib/content";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-foot-letter]", {
          yPercent: 100,
          stagger: 0.06,
          ease: "expo.out",
          duration: 1.4,
          scrollTrigger: { trigger: "[data-foot-word]", start: "top 98%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="section-pad relative mt-24 border-t border-line pt-14 md:mt-36">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-2xl">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{site.expansion}</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Sitemap</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-fg/80 transition-colors hover:text-cyan">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-fg/80 transition-colors hover:text-cyan">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-foot-word className="mt-16 overflow-hidden md:mt-24" aria-hidden>
        <p className="display flex justify-between text-[17vw] font-extrabold uppercase leading-[0.8]">
          {site.name.split("").map((l, i) => (
            <span key={i} data-foot-letter className="text-grad inline-block">
              {l}
            </span>
          ))}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[11px] uppercase tracking-widest text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} SATVA · {site.tagline}</span>
        <span suppressHydrationWarning>Local time {time}</span>
        <button onClick={() => app.lenis?.scrollTo(0, { duration: 2.2 })} className="text-left uppercase transition-colors hover:text-fg sm:text-right">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
