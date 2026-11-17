"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";

export type HeroSlide = { src: string; alt: string; name: string; href: string };

const SLIDE_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ slides, disciplines }: { slides: HeroSlide[]; disciplines: readonly string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Wait for the intro curtain on a first visit; start almost at once on repeat visits.
  const [delay] = useState(() =>
    typeof document !== "undefined" && document.documentElement.hasAttribute("data-intro-seen") ? 0.2 : 1.9,
  );

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduce, slides.length]);

  const slide = slides[index];
  const words = ["Manifesting", "dreams"];

  return (
    <section ref={ref} className="bg-ink relative isolate -mt-16 h-[100svh] min-h-[36rem] overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: imageY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <motion.div
              className="relative h-full w-full"
              initial={reduce ? false : { scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: SLIDE_MS / 1000 + 1.6, ease: "linear" }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="from-ink/80 via-ink/25 to-ink/30 absolute inset-0 -z-10 bg-gradient-to-t" />

      <motion.div
        className="text-paper mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-20"
        style={reduce ? undefined : { y: textY, opacity: fade }}
      >
        <motion.p
          className="text-xs tracking-[0.4em] uppercase"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay, ease }}
        >
          {disciplines.join(" · ")}
        </motion.p>
        <h1 className="display mt-4 text-[clamp(3.5rem,13vw,11rem)] leading-[0.9]">
          {words.map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 1 ? "pl-[12vw] italic" : ""}`}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, delay: delay + 0.15 + i * 0.15, ease }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="mt-10 flex flex-wrap items-end justify-between gap-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.7 }}
        >
          <div className="flex flex-wrap gap-4">
            <Magnetic>
              <Link
                href="/projects/"
                className="bg-paper text-ink hover:bg-greige inline-block rounded-full px-7 py-4 text-sm"
              >
                View our work
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/questionnaire/"
                className="border-paper hover:bg-paper hover:text-ink inline-block rounded-full border px-7 py-4 text-sm"
              >
                Find your needs
              </Link>
            </Magnetic>
          </div>
          <Link href={slide.href} className="group text-right" data-cursor="View">
            <span className="text-paper/70 block text-xs tracking-[0.3em] tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <span className="display mt-1 block text-2xl group-hover:underline">{slide.name}</span>
            <span className="bg-paper/25 mt-3 block h-px w-40 overflow-hidden">
              {!reduce && (
                <motion.span
                  key={index}
                  className="bg-paper block h-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="text-paper/70 absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase sm:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.2 }}
      >
        Scroll
        <span className="bg-paper/30 relative h-10 w-px overflow-hidden">
          <span className="scroll-line bg-paper absolute inset-x-0 top-0 h-1/2" />
        </span>
      </motion.div>
    </section>
  );
}
