import type { Metadata } from "next";
import { SiteImage } from "@/components/site-image";
import { about, philosophy, process, team, vision } from "@/data/studio";

export const metadata: Metadata = {
  title: "Studio",
  description: "About DOT THREE Design Studio: our philosophy, vision, team and process.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <p className="eyebrow">About us</p>
      <h1 className="display mt-4 text-6xl">Manifesting dreams</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <p className="text-ink-soft text-lg leading-8">{about}</p>
        <SiteImage src="/images/studio/about-detail.webp" alt="Detail of a spiral stone carving" className="w-full" />
      </div>

      <section className="mt-24 grid gap-12 md:grid-cols-2">
        <SiteImage src="/images/studio/vision.webp" alt="Contemporary house with a sloping roof" className="w-full" />
        <div className="space-y-10 self-center">
          <div>
            <h2 className="display text-accent text-4xl">{vision.title}</h2>
            <p className="text-ink-soft mt-3">{vision.body}</p>
          </div>
          <div>
            <h2 className="display text-accent text-4xl">{vision.secondaryTitle}</h2>
            <p className="text-ink-soft mt-3">{vision.secondaryBody}</p>
          </div>
          <div>
            <h2 className="display text-accent text-4xl">{philosophy.title}</h2>
            <p className="text-ink-soft mt-3">{philosophy.body}</p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <p className="eyebrow">Meet our team</p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((m) => (
            <li key={m.name} className="border-greige border-t pt-4">
              <p className="display text-2xl">{m.name}</p>
              <p className="text-ink-soft text-sm">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24">
        <p className="eyebrow">How we work</p>
        <ol className="mt-8 grid gap-10 md:grid-cols-3">
          {process.map((s) => (
            <li key={s.step}>
              <p className="display text-accent text-4xl">{s.step}</p>
              <h3 className="mt-2 text-lg">{s.title}</h3>
              <p className="text-ink-soft mt-2 text-sm">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
