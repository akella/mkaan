import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import HomeHero from "@/components/sections/HomeHero";
import InNumbers from "@/components/sections/InNumbers";
import HomePortfolio from "@/components/sections/HomePortfolio";
import HomeValues from "@/components/sections/HomeValues";
import Location from "@/components/sections/Location";
import HomeNews from "@/components/sections/HomeNews";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import HomeWrapper from "@/components/sections/HomeWrapper";
import { getOwnWithPage } from "@/lib/strapi";
import { getAllProjectsCards } from "@/lib/strapi";
import { getAllNewsPage } from "@/lib/strapi";
export const revalidate = 120;

export async function generateMetadata() {
  const ownWithData = await getOwnWithPage();

  return generateMetadataFromSeoBlock(ownWithData?.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - Main page description",
  });
}

export default async function OwnWithMkaan() {
  const ownWithData = await getOwnWithPage();
  const mainPr = ownWithData?.projects
  const projects = await getAllProjectsCards();
  const news = await getAllNewsPage();
  return (
    <>
      <HeaderServer pageName={["Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <HomeHero mainPr={mainPr} titleClassName="!max-w-[590px]" />
        <HomeWrapper start="bottom" start2="93%" end="100%">

        <InNumbers data={ownWithData.Hero_block_own} />
        <HomePortfolio
          pageData={ownWithData.Projects_block}
          allProjects={projects}
        />
        <HomeValues data={ownWithData.Legacy_block} />
        </HomeWrapper>
        <Location data={ownWithData.Location} />
        <HomeNews pageData={ownWithData.News_block} newsCards={news}/>
      </main>
      <FooterServer variant={"ownPage"} />
    </>
  );
}
