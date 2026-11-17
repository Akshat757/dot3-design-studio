"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type ReelItem = { href: string; src: string; alt: string; name: string; meta: string };

/** Vertical scroll drives the featured projects sideways while the section stays pinned. */
export function ProjectReel({ items, children }: { items: ReelItem[]; children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => setDistance(Math.max(0, track.scrollWidth - window.innerWidth)));
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduce) {
    return (
      <section className="bg-stone py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">{children}</div>
        <div className="mt-12 flex snap-x gap-6 overflow-x-auto px-4 pb-4 sm:px-8">
          {items.map((item) => (
            <ReelCard key={item.href} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="bg-stone relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">{children}</div>
        <motion.div ref={trackRef} style={{ x }} className="mt-10 flex w-max gap-6 px-4 sm:gap-10 sm:px-8">
          {items.map((item) => (
            <ReelCard key={item.href} item={item} />
          ))}
        </motion.div>
        <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-8">
          <div className="bg-greige h-px w-full">
            <motion.div className="bg-ink h-full origin-left" style={{ scaleX: progress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReelCard({ item }: { item: ReelItem }) {
  return (
    <Link
      href={item.href}
      className="group block w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[34vw]"
      data-cursor="View"
    >
      <div className="bg-mist overflow-hidden">
        <Image
          src={item.src}
          alt={item.alt}
          width={1200}
          height={900}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 78vw"
          className="aspect-[4/3] h-auto max-h-[52vh] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
      </div>
      <p className="eyebrow mt-4">{item.meta}</p>
      <p className="display group-hover:text-accent mt-1 text-3xl transition-colors">{item.name}</p>
    </Link>
  );
}
