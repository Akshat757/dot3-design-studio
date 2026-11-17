"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Ring that trails the pointer and grows over anything marked `data-cursor="Label"`.
// Mouse-only; the native cursor stays visible.
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40 });
  const sy = useSpring(y, { stiffness: 400, damping: 40 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setEnabled(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] flex items-center justify-center rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 88 : 28,
        height: label ? 88 : 28,
        backgroundColor: label ? "rgba(250,249,247,1)" : "rgba(250,249,247,0)",
        borderWidth: label ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <span className="absolute inset-0 rounded-full border border-[#faf9f7]" />
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[10px] font-medium tracking-[0.2em] text-black uppercase"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
