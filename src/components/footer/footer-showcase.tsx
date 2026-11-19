"use client";

import { useEffect, useRef, useState } from "react";

// Footer 2: an immersive, full-viewport 3D showcase. The three.js scene is code-split and only initialised once
// the section is within about one screen of the viewport; it renders only while visible.
export function FooterShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let showcase: import("./scene").Showcase | null = null;
    let loading = false;
    let disposed = false;
    let visible = false;

    const init = async () => {
      if (loading || showcase || disposed) return;
      loading = true;
      try {
        const { createShowcase } = await import("./scene");
        const s = await createShowcase({
          canvas,
          container: section,
          reducedMotion: motion.matches,
          onCaption: (name) => {
            if (captionRef.current) captionRef.current.textContent = name;
          },
        });
        if (disposed) return s.dispose();
        showcase = s;
        showcase.setActive(visible);
      } catch {
        if (!disposed) setFailed(true); // no WebGL: keep the dark stage and headline
      }
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          near.disconnect();
          void init();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    const view = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        showcase?.setActive(visible && !document.hidden);
      },
      { threshold: 0.01 },
    );
    const onVisibility = () => showcase?.setActive(visible && !document.hidden);
    const onMotion = () => showcase?.setReducedMotion(motion.matches);

    near.observe(section);
    view.observe(section);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);

    return () => {
      disposed = true;
      near.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      showcase?.dispose();
      showcase = null;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-footer-2
      aria-label="Selected properties, shown as a 3D showcase"
      className="footer-2 bg-ink text-paper relative isolate h-svh min-h-[34rem] w-full overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 block h-full w-full"
        data-failed={failed || undefined}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl flex-col gap-3 px-4 pt-24 sm:px-8 sm:pt-28">
        <p className="eyebrow text-greige">Spaces we’ve shaped</p>
        <h2 className="display text-4xl sm:text-6xl">Built to be lived in</h2>
      </div>
      <p className="eyebrow text-greige pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-8">
        <span className="bg-accent size-2 rounded-full" aria-hidden />
        <span ref={captionRef} aria-live="off" />
      </p>
    </section>
  );
}
