"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Transparent over the home hero; slides away on scroll down and back on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setOverHero(y < window.innerHeight - 80);
    setHidden(y > 300 && y > prev && !open);
  });

  const transparent = pathname === "/" && overHero && !open;

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        transparent ? "text-paper border-transparent bg-transparent" : "border-greige/60 bg-paper/85 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative text-sm tracking-wide transition-colors ${
                pathname === item.href ? "text-accent" : transparent ? "text-paper/85" : "text-ink-soft"
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/consultation/"
            className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
              transparent ? "bg-paper text-ink hover:bg-greige" : "bg-ink text-paper hover:bg-accent"
            }`}
          >
            Book a consultation
          </Link>
        </nav>
        <button
          type="button"
          className="text-xs font-medium tracking-[0.3em] uppercase md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-greige/60 border-t px-4 py-6 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {[...nav, { href: "/consultation/", label: "Book a consultation" }].map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={item.href} onClick={() => setOpen(false)} className="display text-3xl">
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      )}
    </motion.header>
  );
}
