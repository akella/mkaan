import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";

import ProjectHero from "@/components/sections/single-project/ProjectHero";
import ProjectContent from "@/components/sections/single-project/ProjectContent";
import { getOneProjectById } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getAllProjectsCards } from "@/lib/strapi";
export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getOneProjectById(id);

  return generateMetadataFromSeoBlock(project?.Seo_block, {
    title: "Mkaan Projects",
    description: "Mkaan - Projects description",
  });
}

export default async function SingleProject({ params }) {
  const { id } = await params;
  const project = await getOneProjectById(id);

  const allProjects = await getAllProjectsCards();

  if (!project) {
    notFound();
  }

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <ProjectHero data={project.Hero_section_project} />
        <ProjectContent data={project} allProjects={allProjects} />
      </main>
    </>
  );
}
