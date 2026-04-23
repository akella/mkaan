import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import CaseList from "@/components/sections/CaseList";
import FooterClient from "@/components/snippets/Footer/FooterClient";
import { getAllCasesPage } from "@/lib/strapi";
import { getCasesPage } from "@/lib/strapi";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

export const revalidate = 120;

export async function generateMetadata() {
  const casesPageData = await getCasesPage();

  return generateMetadataFromSeoBlock(casesPageData?.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - Case Study page description",
  });
}

export default async function CaseStudy() {
  const casesData = await getAllCasesPage();
  const casesPageData = await getCasesPage();
  const caseHero = casesPageData?.Hero_cases_page;

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PageHero
          backgroundImage={
            caseHero.Media
              ? `${ASSET_URL}${caseHero.Media.url}`
              : "/images/case-hero.jpg"
          }
          title={caseHero?.Title || "Flagship Case Studies"}
          titleClassName={"!max-w-[445px]"}
          scrollText={true}
          subtitle={
            caseHero?.Description ||
            "A showcase of our most visionary developments."
          }
          subtitleClassName={"md:mr-[100px]"}
          needAmount={true}
          amount={casesData.length}
          needHeroAnimation={false}
        />
        <CaseList cases={casesData} />
      </main>
      <FooterClient />
    </>
  );
}
