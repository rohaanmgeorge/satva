"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scene } from "@/lib/store";
import Nav from "./Nav";
import Hero from "./sections/Hero";
import Manifesto from "./sections/Manifesto";
import Pillars from "./sections/Pillars";
import ScrollFilm from "./sections/ScrollFilm";
import Stats from "./sections/Stats";
import Events from "./sections/Events";
import Projects from "./sections/Projects";
import Team from "./sections/Team";
import Join from "./sections/Join";
import Footer from "./Footer";

const NeuralScene = dynamic(() => import("./canvas/NeuralScene"), { ssr: false });

/**
 * Scene director: each section declares data-morph / data-opacity, and as it
 * scrolls into view the shared WebGL scene is scrubbed from the previous
 * section's values to its own. Child sections create their pins first
 * (children's effects run before the parent's), so trigger positions are correct.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-morph]");
      let prevMorph = Number(els[0]?.dataset.morph ?? 0);
      let prevOpacity = Number(els[0]?.dataset.opacity ?? 1);
      scene.morph = prevMorph;
      scene.opacity = prevOpacity;

      els.slice(1).forEach((el) => {
        const morph = Number(el.dataset.morph);
        const opacity = Number(el.dataset.opacity ?? 1);
        gsap.fromTo(
          scene,
          { morph: prevMorph, opacity: prevOpacity },
          {
            morph,
            opacity,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true },
          },
        );
        // a pinned film section ends on its own final morph
        prevMorph = el.id === "film" ? 4 : morph;
        prevOpacity = opacity;
      });
    },
    { scope: root },
  );

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 40%, rgba(139,92,246,.16), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgba(34,211,238,.10), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 motion-reduce:hidden">
          <NeuralScene />
        </div>
      </div>
      <Nav />
      <main ref={root} className="relative">
        <Hero />
        <Manifesto />
        <Pillars />
        <ScrollFilm />
        <Stats />
        <Events />
        <Projects />
        <Team />
        <Join />
      </main>
      <Footer />
    </>
  );
}
