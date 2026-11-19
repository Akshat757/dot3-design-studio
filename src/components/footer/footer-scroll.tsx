"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";

// Two-stage footer scroll.
//
// Touch, keyboard and native wheel scrolling use plain CSS scroll snapping (see "Footer scroll snap" in globals.css).
// The site's smooth-scroll library (Lenis) drives the mouse wheel / trackpad itself, and programmatic scrolling
// bypasses CSS snapping, so for those inputs this component reproduces the same two stops:
//   - a fast scroll can never carry past Footer 1 (it settles there);
//   - the next deliberate gesture moves to Footer 2, and scrolling up steps back to Footer 1;
//   - everywhere else the event is left completely alone.
const QUIET_MS = 140; // a pause this long between wheel events means a new gesture
const EPS = 3;

type Lenis = NonNullable<ReturnType<typeof useLenis>>;
const setVirtualScroll = (l: Lenis, fn: Lenis["options"]["virtualScroll"]) => {
  l.options.virtualScroll = fn;
};

export function FooterScroll() {
  const lenis = useLenis();

  // Which input is active decides whether CSS snapping is on (touch/keys) or Lenis handles the wheel.
  useEffect(() => {
    const root = document.documentElement;
    const set = (v: "wheel" | "native") => {
      if (root.dataset.input !== v) root.dataset.input = v;
    };
    const onWheel = () => lenis && set("wheel");
    const onNative = () => set("native");
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onNative, { passive: true });
    window.addEventListener("keydown", onNative);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onNative);
      window.removeEventListener("keydown", onNative);
      delete root.dataset.input;
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    const footer1 = document.querySelector<HTMLElement>("[data-footer-1]");
    const footer2 = document.querySelector<HTMLElement>("[data-footer-2]");
    if (!footer1 || !footer2) return;

    let stop1 = 0; // scroll position with Footer 1's bottom edge at the viewport bottom
    let stop2 = 0; // scroll position with Footer 2 filling the viewport
    const measure = () => {
      const y = window.scrollY;
      stop1 = footer1.getBoundingClientRect().bottom + y - window.innerHeight;
      stop2 = footer2.getBoundingClientRect().top + y;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    ro.observe(footer2);

    let settling = false; // true from a transition until the wheel gesture (incl. trackpad inertia) ends
    let moving = false;
    let lastWheel = 0;
    let lastMag = 0;
    let safety = 0;

    const goTo = (target: number) => {
      settling = true;
      moving = true;
      window.clearTimeout(safety);
      safety = window.setTimeout(() => (moving = false), 1600);
      lenis.scrollTo(target, {
        duration: 1.1,
        onComplete: () => {
          moving = false;
          window.clearTimeout(safety);
        },
      });
    };

    const previous = lenis.options.virtualScroll;
    setVirtualScroll(lenis, (data) => {
      if (previous && previous(data) === false) return false;
      const { deltaY, event } = data;
      if (event.type !== "wheel" || event.ctrlKey || deltaY === 0) return true;

      const now = performance.now();
      const mag = Math.abs(deltaY);
      // New gesture = a pause, or a clearly stronger flick than the inertia tail we were swallowing.
      if (now - lastWheel > QUIET_MS || (!moving && mag > lastMag * 1.6 + 12)) settling = false;
      lastWheel = now;
      lastMag = mag;

      const y = window.scrollY; // the real position (Lenis' own value can lag behind native/snap scrolling)
      if (deltaY > 0) {
        if (y >= stop2 - EPS) return true; // already at the very end
        if (y >= stop1 - EPS) {
          // Resting at (or between) the footers: one deliberate gesture goes to Footer 2.
          if (!settling && !moving) goTo(stop2);
          return false;
        }
        if (settling || moving) return false; // momentum from a gesture that already settled
        if (lenis.targetScroll + deltaY > stop1) {
          goTo(stop1); // would pass Footer 1: stop there instead
          return false;
        }
        return true;
      }
      // scrolling up
      if (y > stop1 + EPS) {
        if (!settling && !moving) goTo(stop1);
        return false;
      }
      if (settling && y >= stop1 - EPS) return false; // inertia after arriving back at Footer 1
      return true;
    });

    return () => {
      ro.disconnect();
      window.clearTimeout(safety);
      setVirtualScroll(lenis, previous);
    };
  }, [lenis]);

  return null;
}
