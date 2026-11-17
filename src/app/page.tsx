import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { ProjectCard } from "@/components/project-card";
import { site } from "@/config/site";
import { projects, projectImageSrc } from "@/data/projects";
import { philosophy, pillars, process, services } from "@/data/studio";

// Static structure for the landing page. Phase 3 layers the animations on top
// (three-dot intro, text reveals, parallax, project reel, scroll timeline).
export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const hero = featured[0];

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden">
        <SiteImage
          src={projectImageSrc(hero.slug, 0)}
          alt={hero.images[0].alt}
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="from-ink/70 via-ink/20 absolute inset-0 -z-10 bg-gradient-to-t to-transparent" />
        <div className="text-paper mx-auto w-full max-w-7xl px-4 pb-16 sm:px-8 sm:pb-24">
          <p className="text-xs tracking-[0.4em] uppercase">{site.disciplines.join(" · ")}</p>
          <h1 className="display mt-4 text-6xl leading-none sm:text-8xl lg:text-9xl">{site.tagline}</h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects/" className="bg-paper text-ink hover:bg-greige rounded-full px-6 py-3 text-sm">
              View our work
            </Link>
            <Link
              href="/questionnaire/"
              className="border-paper hover:bg-paper hover:text-ink rounded-full border px-6 py-3 text-sm"
            >
              Find your needs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-8 md:grid-cols-2">
        <div>
          <p className="eyebrow">Our philosophy</p>
          <h2 className="display mt-4 text-5xl">{philosophy.title}</h2>
        </div>
        <p className="text-ink-soft text-lg leading-8">{philosophy.body}</p>
      </section>

      <section className="bg-stone py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="display mt-4 text-5xl">Projects</h2>
            </div>
            <Link href="/projects/" className="hover:text-accent text-sm underline-offset-4 hover:underline">
              All projects
            </Link>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <p className="eyebrow">What we do</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="border-greige border-t pt-6">
              <h3 className="display text-3xl">{p.title}</h3>
              <p className="text-ink-soft mt-3">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="bg-greige mt-20 grid grid-cols-2 gap-px md:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.id} className="bg-paper p-6 sm:p-10">
              <p className="display text-greige text-5xl">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-lg">{s.title}</h3>
              <p className="text-ink-soft mt-2 text-sm">{s.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <p className="eyebrow text-greige">How we work</p>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {process.map((s) => (
              <li key={s.step}>
                <p className="display text-accent text-4xl">{s.step}</p>
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="text-greige mt-2 text-sm">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-8">
        <h2 className="display text-5xl">Let’s shape your space</h2>
        <p className="text-ink-soft mt-4">Answer a few quick questions or book a consultation with the studio.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/questionnaire/" className="bg-ink text-paper hover:bg-accent rounded-full px-6 py-3 text-sm">
            Find your needs
          </Link>
          <Link
            href="/consultation/"
            className="border-ink hover:bg-ink hover:text-paper rounded-full border px-6 py-3 text-sm"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
