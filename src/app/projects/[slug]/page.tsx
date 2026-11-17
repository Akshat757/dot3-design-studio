import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteImage } from "@/components/site-image";
import { getProject, projectImageSrc, projects } from "@/data/projects";
import { services } from "@/data/studio";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: { images: [projectImageSrc(project.slug, 0)] },
  };
}

const kindLabel = { render: "Design", site: "On site", plan: "Plan" } as const;

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const category = services.find((s) => s.id === project.category)?.title;
  const facts = [
    { label: "Category", value: category ?? "" },
    ...(project.location ? [{ label: "Location", value: project.location }] : []),
    ...project.facts,
  ];

  return (
    <article>
      <SiteImage
        src={projectImageSrc(project.slug, 0)}
        alt={project.images[0].alt}
        priority
        className="h-[70svh] w-full object-cover"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {project.concept && <p className="eyebrow">{project.concept}</p>}
          <h1 className="display mt-3 text-5xl sm:text-6xl">{project.name}</h1>
          <p className="text-ink-soft mt-8 text-lg leading-8">{project.description}</p>
        </div>
        <dl className="border-greige space-y-5 self-start border-t pt-6">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {project.images.length > 1 && (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-8 md:grid-cols-2">
          {project.images.slice(1).map((img, i) => (
            <figure key={img.source}>
              <SiteImage
                src={projectImageSrc(project.slug, i + 1)}
                alt={img.alt}
                className="bg-mist w-full object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <figcaption className="eyebrow mt-3">{kindLabel[img.kind]}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="border-greige mx-auto mt-20 flex max-w-7xl flex-wrap items-center justify-between gap-6 border-t px-4 pt-10 sm:px-8">
        <Link href="/consultation/" className="bg-ink text-paper hover:bg-accent rounded-full px-6 py-3 text-sm">
          Book a consultation
        </Link>
        <Link href={`/projects/${next.slug}/`} className="text-right">
          <span className="eyebrow block">Next project</span>
          <span className="display hover:text-accent text-3xl">{next.name}</span>
        </Link>
      </div>
    </article>
  );
}
