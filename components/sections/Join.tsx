"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { site, socials } from "@/lib/content";
import Marquee from "../ui/Marquee";
import Magnetic from "../ui/Magnetic";

export default function Join() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-join-cta]", {
          scale: 0.4,
          rotate: -30,
          opacity: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-join-cta]", start: "top 90%" },
        });
        gsap.from("[data-join-fade]", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-join-fade]", start: "top 92%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="join" data-morph="4" data-opacity="0.9" className="relative overflow-hidden pt-24 md:pt-36">
      <div className="section-pad">
        <span className="eyebrow">( 06 ) Join</span>
      </div>
      <Marquee speed={22} className="mt-8">
        {["Join SATVA", "Code for future"].map((w) => (
          <span key={w} className="display flex items-center px-6 text-[18vw] font-extrabold uppercase leading-none md:px-10 md:text-[12vw]">
            <span className={w === "Join SATVA" ? "" : "text-grad"}>{w}</span>
            <span className="ml-12 text-[6vw] text-violet md:ml-20">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="section-pad relative mt-16 grid items-center gap-14 md:mt-24 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p data-join-fade className="max-w-md text-lg text-muted md:text-xl">
            Whether you&apos;ve shipped ten apps or never written a line of code — there&apos;s a seat at the alliance. Learn with us, build with us, lead with us.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <a
              data-join-fade
              href={`mailto:${site.email}`}
              className="group glass flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:border-fg/40"
            >
              <span>
                <span className="eyebrow block">Email</span>
                <span className="mt-1 block break-all text-sm">{site.email}</span>
              </span>
              <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
            {socials.map((s) => (
              <a
                data-join-fade
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group glass flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:border-fg/40"
              >
                <span>
                  <span className="eyebrow block">Follow</span>
                  <span className="mt-1 block text-sm">{s.label}</span>
                </span>
                <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="order-1 grid place-items-center md:order-2">
          <Magnetic strength={0.25}>
            <a
              data-join-cta
              href={site.joinUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative grid h-56 w-56 place-items-center rounded-full text-center md:h-80 md:w-80"
            >
              <span aria-hidden className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full motion-reduce:animate-none" style={{ background: "conic-gradient(#22d3ee, #8b5cf6, #a3e635, #22d3ee)" }} />
              <span aria-hidden className="absolute inset-[3px] rounded-full bg-bg transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-0" />
              <span className="relative">
                <span className="display block text-3xl font-extrabold uppercase transition-colors duration-500 group-hover:text-bg md:text-5xl">Join</span>
                <span className="mt-2 block font-mono text-xs uppercase tracking-[0.3em] text-muted transition-colors duration-500 group-hover:text-bg">
                  Apply now →
                </span>
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
