import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import HomeHero from "@/components/sections/HomeHero";
import InNumbers from "@/components/sections/InNumbers";
import HomePortfolio from "@/components/sections/HomePortfolio";
import HomeValues from "@/components/sections/HomeValues";
import Location from "@/components/sections/Location";
import HomeNews from "@/components/sections/HomeNews";
import HomePartners from "@/components/sections/HomePartners";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import HomeServices from "@/components/sections/HomeServices";
import HomeServicesSlider from "@/components/sections/HomeServicesSlider";
import CaseStudy from "@/components/sections/CaseStudy";
import HomeWrapper from "@/components/sections/HomeWrapper";
import { getPartnerWithPage } from "@/lib/strapi";
import { getAllProjectsCards } from "@/lib/strapi";
import { getAllNewsPage } from "@/lib/strapi";
import { getAllCasesPage } from "@/lib/strapi";
import { notFound } from "next/navigation";
export const revalidate = 120;

export async function generateMetadata() {
  const partnerWithData = await getPartnerWithPage();

  return generateMetadataFromSeoBlock(partnerWithData.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - Main page description",
  });
}

export default async function PartnerWithMkaan() {
  const partnerWithData = await getPartnerWithPage();

  const mainPr = partnerWithData.projects;
  if (mainPr.length === 0) {
    return notFound();
  }
  const projectsAll = await getAllProjectsCards();
  const news = await getAllNewsPage();
  const cases = await getAllCasesPage();
  const projects = [
    {
      title: "Alma Residence",
      image: "/images/main-hero-2.jpg",
      link: "/",
      about: "Crafted Homes for the Few Who Understand",
    },
    {
      title: "Alma Residence",
      image: "/images/own/1.jpg",
      link: "/",
      about: "Homes for the Few Who Understand",
    },
    {
      title: "Dubai Residence",
      image: "/images/own/2.jpg",
      link: "/",
      about: "Homes for the Few Who",
    },
  ];
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <HomeHero
          data={projects}
          mainPr={mainPr}
          title="Built in Partnership for the Visionaries Who Create"
        />
        <HomeWrapper start="top" end="top-=600">


        <InNumbers data={partnerWithData.Hero_block_intro} />
        <HomePortfolio
          pageData={partnerWithData.Projects_block}
          allProjects={projectsAll}
        />
        <HomeValues data={partnerWithData.Legacy_block} />
        </HomeWrapper>
        <HomePartners data={partnerWithData.Our_partners} />
        <HomeServices
          data={partnerWithData.Services_block}
          sliderData={partnerWithData.Services_block.Slider}
        />
        <div className="md:hidden">
          <HomeServicesSlider data={partnerWithData.Services_block.Slider} />
        </div>
        <Location data={partnerWithData.Location} />
        <CaseStudy pageData={partnerWithData.Case_study} casesData={cases} />
        <HomeNews pageData={partnerWithData.News_block} newsCards={news} />
      </main>
      <FooterServer variant={"partnerPage"} />
    </>
  );
}
