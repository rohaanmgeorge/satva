import type Lenis from "lenis";

/** Mutable, render-free shared state between GSAP, Lenis and the WebGL scene. */
export const scene = {
  /** 0 orb · 1 neural net · 2 "SATVA" · 3 helix · 4 globe */
  morph: 0,
  /** canvas visibility 0–1 */
  opacity: 1,
  /** normalised pointer -1..1 */
  pointerX: 0,
  pointerY: 0,
  /** smoothed scroll velocity */
  velocity: 0,
};

export const app = {
  lenis: null as Lenis | null,
  ready: false,
};

export const READY_EVENT = "satva:ready";

export function markReady() {
  app.ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** Run `cb` once the preloader has finished (immediately if it already has). */
export function onReady(cb: () => void) {
  if (app.ready) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}
