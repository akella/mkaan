import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import CareerList from "@/components/sections/CareerList";
import CareerValues from "@/components/sections/CareerValues";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import { getCareerPage } from "@/lib/strapi";
export const revalidate = 120;
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

export async function generateMetadata() {
  const careerData = await getCareerPage();

  return generateMetadataFromSeoBlock(careerData.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - Career page description",
  });
}

export default async function Career() {
  const careerData = await getCareerPage();
  const heroData = careerData?.Hero_section_career;
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PageHero
          title={
            heroData?.Title || "Join Mkaan and shape the future of real estate"
          }
          subtitle={heroData?.Description || "Build your future with us."}
          subtitleClassName={"md:mr-[100px]"}
          backgroundImage={
            heroData?.Media ? ASSET_URL + heroData?.Media.url : ""
          }
          scrollText={true}
          needAmount={true}
          amount={6}
        />
        <CareerList data={careerData.jobs} />
        <CareerValues data={careerData.Values_career} />
      </main>
      <FooterServer />
    </>
  );
}
