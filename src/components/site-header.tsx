"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-greige/60 bg-paper/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-accent text-sm tracking-wide transition-colors ${
                pathname === item.href ? "text-accent" : "text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/consultation/"
            className="bg-ink text-paper hover:bg-accent rounded-full px-5 py-2 text-sm tracking-wide transition-colors"
          >
            Book a consultation
          </Link>
        </nav>
        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="eyebrow">{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-greige/60 border-t px-4 py-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {[...nav, { href: "/consultation/", label: "Book a consultation" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="display text-2xl">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
