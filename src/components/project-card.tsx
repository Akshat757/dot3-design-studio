import Link from "next/link";
import { type Project, projectImageSrc } from "@/data/projects";
import { services } from "@/data/studio";
import { ImageReveal } from "./motion/reveal";
import { SiteImage } from "./site-image";

export function ProjectCard({ project }: { project: Project }) {
  const category = services.find((s) => s.id === project.category)?.title;
  return (
    <Link href={`/projects/${project.slug}/`} className="group block" data-cursor="View">
      <ImageReveal className="bg-mist overflow-hidden">
        <SiteImage
          src={projectImageSrc(project.slug, 0)}
          alt={project.images[0].alt}
          className="aspect-[4/3] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </ImageReveal>
      <p className="eyebrow mt-4">
        {category}
        {project.location ? ` · ${project.location}` : ""}
      </p>
      <h3 className="display group-hover:text-accent mt-1 text-2xl">{project.name}</h3>
      {project.concept && <p className="text-ink-soft text-sm">{project.concept}</p>}
    </Link>
  );
}
