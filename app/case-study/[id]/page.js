import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import CaseHero from "@/components/sections/single-case/CaseHero";
import CaseContent from "@/components/sections/single-case/CaseContent";
import { getOneCaseById } from "@/lib/strapi";
import { getAllCasesPage } from "@/lib/strapi";
import { notFound } from "next/navigation";
export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const caseData = await getOneCaseById(id);

  return generateMetadataFromSeoBlock(caseData?.Seo_block, {
    title: "Mkaan Case Studies",
    description: "Mkaan - Case Studies description",
  });
}

export default async function SingleCaseStudy({ params }) {
  const { id } = await params;
  const caseData = await getOneCaseById(id);
  const allCases = await getAllCasesPage();

  if (!caseData) {
    notFound();
  }

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <CaseHero
          features={caseData.Key_numbers}
          data={caseData.Hero_section_case}
        />
        <CaseContent data={caseData} allCases={allCases} />
      </main>
    </>
  );
}
