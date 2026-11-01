"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { app, onReady, scene } from "@/lib/store";

export default function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.085,
      wheelMultiplier: 1,
      smoothWheel: !reduce,
      anchors: { offset: 0 },
    });
    app.lenis = lenis;

    lenis.on("scroll", (l: Lenis) => {
      ScrollTrigger.update();
      scene.velocity += (l.velocity - scene.velocity) * 0.2;
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (!app.ready) lenis.stop();
    const off = onReady(() => {
      lenis.start();
      ScrollTrigger.refresh();
    });

    // pointer for the WebGL scene
    const onMove = (e: PointerEvent) => {
      scene.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // decay velocity when idle
    const decay = () => {
      scene.velocity *= 0.92;
    };
    gsap.ticker.add(decay);

    // fonts can shift layout → refresh triggers
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      off();
      gsap.ticker.remove(raf);
      gsap.ticker.remove(decay);
      window.removeEventListener("pointermove", onMove);
      lenis.destroy();
      app.lenis = null;
    };
  }, []);

  return null;
}
