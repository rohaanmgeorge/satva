"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { app, onReady } from "@/lib/store";
import { nav, site, socials } from "@/lib/content";
import Magnetic from "./ui/Magnetic";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // intro + hide on scroll down
  useGSAP(() => {
    gsap.set(bar.current, { yPercent: -120 });
    const off = onReady(() => gsap.to(bar.current, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.6 }));

    let hidden = false;
    let last = 0;
    const tick = () => {
      const y = window.scrollY;
      const down = y > last + 2;
      const up = y < last - 2;
      if (down && y > 200 && !hidden) {
        hidden = true;
        gsap.to(bar.current, { yPercent: -120, duration: 0.6, ease: "power3.out" });
      } else if (up && hidden) {
        hidden = false;
        gsap.to(bar.current, { yPercent: 0, duration: 0.6, ease: "power3.out" });
      }
      bar.current?.classList.toggle("scrolled", y > 40);
      last = y;
    };
    gsap.ticker.add(tick);
    return () => {
      off();
      gsap.ticker.remove(tick);
    };
  });

  // mobile menu timeline
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" })
        .from("[data-menu-link]", { yPercent: 110, duration: 0.8, stagger: 0.06, ease: "expo.out" }, "-=0.4")
        .from("[data-menu-foot]", { opacity: 0, y: 10, duration: 0.5 }, "-=0.5");
    },
    { scope: menu },
  );

  useEffect(() => {
    if (open) {
      tl.current?.timeScale(1).play();
      app.lenis?.stop();
    } else {
      tl.current?.timeScale(1.6).reverse();
      if (app.ready) app.lenis?.start();
    }
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => app.lenis?.scrollTo(href, { duration: 1.6 }), open ? 450 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className="section-pad fixed inset-x-0 top-0 z-50 flex items-center justify-between py-4 transition-[background,backdrop-filter] duration-500 [&.scrolled]:bg-bg/60 [&.scrolled]:backdrop-blur-xl"
      >
        <a href="#top" onClick={go("#top")} className="group flex items-center gap-3" aria-label="SATVA home">
          <Logo />
          <span className="display text-lg tracking-tight">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={go(n.href)}
              className="group relative overflow-hidden rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
            >
              <span className="relative block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full">{n.label}</span>
              <span className="absolute inset-x-4 top-full block text-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full">
                {n.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
          <Magnetic>
            <a
              href="#join"
              onClick={go("#join")}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-bg"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
              Join the club
            </a>
          </Magnetic>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative z-[70] grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`absolute h-px w-5 bg-fg transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-5 bg-fg transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="section-pad invisible fixed inset-0 z-[45] flex flex-col justify-between bg-bg-2 pb-10 pt-28 md:hidden"
        aria-hidden={!open}
      >
        <ul className="space-y-1">
          {[...nav, { label: "Join", href: "#join" }].map((n, i) => (
            <li key={n.href} className="overflow-hidden">
              <a data-menu-link href={n.href} onClick={go(n.href)} className="display flex items-baseline gap-4 text-5xl" tabIndex={open ? 0 : -1}>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-foot className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-muted">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden className="transition-transform duration-700 group-hover:rotate-180">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#a3e635" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.5" stroke="url(#lg)" strokeWidth="1.5" />
      <path d="M13 15l-5 5 5 5M27 15l5 5-5 5M22.5 11l-5 18" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
