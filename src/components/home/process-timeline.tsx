"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";

type Step = { step: string; title: string; body: string };

/** Six-step process with a line that draws itself as you scroll. */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative mt-14 space-y-14 pl-10 sm:pl-16">
      <span aria-hidden className="bg-paper/15 absolute top-2 bottom-2 left-[7px] w-px sm:left-[11px]">
        <motion.span className="bg-accent absolute inset-0 origin-top" style={reduce ? undefined : { scaleY }} />
      </span>
      {steps.map((s, i) => (
        <Reveal
          as="li"
          key={s.step}
          delay={i * 0.05}
          className="relative grid gap-2 sm:grid-cols-[8rem_1fr_1.2fr] sm:gap-8"
        >
          <span
            aria-hidden
            className="border-accent bg-ink absolute top-2 -left-10 size-4 rounded-full border sm:-left-16 sm:size-6"
          />
          <span className="display text-accent text-5xl leading-none">{s.step}</span>
          <h3 className="display text-3xl">{s.title}</h3>
          <p className="text-greige">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
