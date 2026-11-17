import Link from "next/link";
import { Counter } from "@/components/home/counter";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { ProjectReel } from "@/components/home/project-reel";
import { ScrollWords } from "@/components/home/scroll-words";
import { Magnetic } from "@/components/motion/magnetic";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import { SiteImage } from "@/components/site-image";
import { site } from "@/config/site";
import { projectImageSrc, projects } from "@/data/projects";
import { philosophy, pillars, process, services, stats } from "@/data/studio";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const serviceTitle = (id: string) => services.find((s) => s.id === id)?.title ?? "";

  return (
    <>
      <Hero
        disciplines={site.disciplines}
        slides={featured.map((p) => ({
          src: projectImageSrc(p.slug, 0),
          alt: p.images[0].alt,
          name: p.name,
          href: `/projects/${p.slug}/`,
        }))}
      />

      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8 sm:py-40">
        <Reveal>
          <p className="eyebrow">Our philosophy · {philosophy.title}</p>
        </Reveal>
        <ScrollWords
          text={philosophy.body}
          className="display mt-8 text-3xl leading-snug sm:text-5xl sm:leading-tight"
        />
        <div className="mt-16 flex gap-3" aria-hidden>
          {["Mind", "Body", "Spirit"].map((w, i) => (
            <Reveal key={w} delay={i * 0.15} className="flex items-center gap-3">
              <span className="bg-accent size-3 rounded-full" />
              <span className="eyebrow pr-6">{w}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee words={site.disciplines} />

      <ProjectReel
        items={featured.map((p) => ({
          href: `/projects/${p.slug}/`,
          src: projectImageSrc(p.slug, 0),
          alt: p.images[0].alt,
          name: p.name,
          meta: [serviceTitle(p.category), p.location ?? p.concept].filter(Boolean).join(" · "),
        }))}
      >
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="display mt-3 text-5xl sm:text-7xl">Projects</h2>
          </div>
          <Link href="/projects/" className="text-sm underline-offset-4 hover:underline">
            All {projects.length} projects →
          </Link>
        </div>
      </ProjectReel>

      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-greige border-t pt-6">
              <p className="display text-6xl sm:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-ink-soft mt-2 text-sm">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-4 pb-28 sm:px-8 lg:grid-cols-2">
        <ImageReveal className="overflow-hidden">
          <SiteImage
            src="/images/studio/vision.webp"
            alt="Contemporary house with a sloping roof"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </ImageReveal>
        <div className="self-center">
          <Reveal>
            <p className="eyebrow">What we do</p>
          </Reveal>
          <ol className="mt-8 space-y-10">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.12} className="border-greige border-t pt-6">
                <h3 className="display text-4xl">{p.title}</h3>
                <p className="text-ink-soft mt-3">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-stone py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow">Our services</p>
            <h2 className="display mt-3 text-5xl sm:text-7xl">Six disciplines, one studio</h2>
          </Reveal>
          <ul className="bg-greige mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 0.1} className="group bg-stone relative overflow-hidden">
                <div className="bg-ink absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <div className="group-hover:text-paper relative p-8 transition-colors duration-500 sm:p-10">
                  <p className="display text-greige group-hover:text-accent text-6xl transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mt-6 text-3xl">{s.title}</h3>
                  <p className="text-ink-soft group-hover:text-greige mt-2 text-sm transition-colors">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink text-paper py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow text-greige">How we work</p>
            <h2 className="display mt-3 text-5xl sm:text-7xl">From first idea to finished space</h2>
          </Reveal>
          <ProcessTimeline steps={process} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-32 sm:py-44">
        <SiteImage
          src="/images/studio/spiral.webp"
          alt=""
          className="absolute top-1/2 left-1/2 -z-10 w-[40rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-15"
        />
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-8">
          <h2 className="display text-5xl sm:text-8xl">Let’s shape your space</h2>
          <p className="text-ink-soft mx-auto mt-6 max-w-xl">
            Answer fifteen quick questions so we understand your needs, or book a consultation with the studio.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link
                href="/questionnaire/"
                className="bg-ink text-paper hover:bg-accent inline-block rounded-full px-8 py-4 text-sm"
              >
                Find your needs
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/consultation/"
                className="border-ink hover:bg-ink hover:text-paper inline-block rounded-full border px-8 py-4 text-sm"
              >
                Book a consultation
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
