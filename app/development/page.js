import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import DevelopmentServices from "@/components/sections/DevelopmentServices";
import DevelopmentList from "@/components/sections/DevelopmentList";
import HomePartners from "@/components/sections/HomePartners";
import OurPhilosophy from "@/components/sections/OurPhilosophy";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import { getDevelopmentPage } from "@/lib/strapi";
import parse from "html-react-parser";
export const revalidate = 120;
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
export async function generateMetadata() {
  const developmentData = await getDevelopmentPage();

  return generateMetadataFromSeoBlock(developmentData.Seo_Block, {
    title: "Mkaan - Development",
    description: "Mkaan - Development page description",
  });
}

export default async function Development() {
  const developmentData = await getDevelopmentPage();
  const heroData = developmentData.Hero_section_development;
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PageHero
          title={parse(heroData.Title)}
          subtitle={heroData.Description}
          subtitleClassName={"md:mr-[100px] max-md:max-w-full max-md:mx-auto"}
          backgroundImage={
            heroData?.Media
              ? ASSET_URL + heroData.Media.url
              : "/images/development-hero.jpg"
          }
          scrollText={true}
          needAmount={true}
          amount={developmentData.Services_slider?.length ?? 0}
        />
        <DevelopmentServices data={developmentData.Services_development} />
        <DevelopmentList data={developmentData.Services_slider} />
        <HomePartners
          bgImg={"/images/dev/partners.jpg"}
          data={developmentData.Our_partners}
        />
        <OurPhilosophy
          className={"md:h-screen max-md:min-h-[100svh] flex flex-col justify-center items-center"}
          pageLink={"/about"}
          data={developmentData.Philosophy_services}
        />
      </main>
      <FooterServer />
    </>
  );
}
