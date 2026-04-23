import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import AboutInfo from "@/components/sections/AboutInfo";
import AboutCornerstones from "@/components/sections/AboutCornerstones";
import AboutAwards from "@/components/sections/AboutAwards";
import AboutQuote from "@/components/sections/AboutQuote";
import OurPhilosophy from "@/components/sections/OurPhilosophy";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import { getAboutPage } from "@/lib/strapi";
import parse from "html-react-parser";
export const revalidate = 120;

const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

export async function generateMetadata() {
  const aboutData = await getAboutPage();

  return generateMetadataFromSeoBlock(aboutData?.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - Main page description",
  });
}

export default async function About() {
  const aboutData = await getAboutPage();
  const heroData = aboutData?.Hero_section_about || null;
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PageHero
          title={
            parse(heroData?.Main_title) || "More than a Company — an Ideology"
          }
          titleClassName={'max-md:!max-w-[350px] max-md:w-full'}
          subtitle={
            heroData?.Bottom_description ||
            "Where Art, Intelligence, and Purpose Shape Timeless Living."
          }
          subtitleClassName={"mx-auto"}
          backgroundImage={
            heroData?.Main_photo
              ? ASSET_URL + heroData.Main_photo.url
              : "/images/development-hero.jpg"
          }
        />
        <AboutInfo data={aboutData.Second_block} />
        <AboutCornerstones data={aboutData.The_Four_Cornerstones} />
        <AboutAwards data={aboutData.Awards_block} />
        <AboutQuote data={aboutData.Management_block} />
        <OurPhilosophy data={aboutData.Philosophy_block} />
      </main>
      <FooterServer />
    </>
  );
}
