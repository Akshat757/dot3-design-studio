"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { type ServiceId, services } from "@/data/studio";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ServiceId | "all">("all");
  const usedCategories = services.filter((s) => projects.some((p) => p.category === s.id));
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {[{ id: "all" as const, title: "All" }, ...usedCategories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              filter === c.id ? "border-ink bg-ink text-paper" : "border-greige hover:border-ink"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
