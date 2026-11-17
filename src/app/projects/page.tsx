import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Residential, commercial, hospitality and landscape projects by DOT THREE Design Studio.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <p className="eyebrow">Portfolio</p>
      <h1 className="display mt-4 text-6xl">Our work</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
}
