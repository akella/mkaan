import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import MainHero from "@/components/sections/MainHero";
import { getOwnWithPage } from "@/lib/strapi";
import { getPartnerWithPage } from "@/lib/strapi";
import Preloader from "@/components/sections/Preloader";
import { getPreloader } from "@/lib/strapi";

export const revalidate = 120;

export async function generateMetadata() {
  // TODO: Fetch mainData when Strapi is connected
  // const mainData = await getMainPage();

  return generateMetadataFromSeoBlock(null, {
    title: "Mkaan",
    description: "Mkaan - Main page description",
  });
}

export default async function Home() {
  const partnerWithData = await getPartnerWithPage();
  const partnerPr = partnerWithData.projects;
  const ownWithData = await getOwnWithPage();
  const ownPr = ownWithData?.projects;
  const preloaderData = await getPreloader();
  return (
    <>
      {/* <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      /> */}
      {/* <RenderStrapiSections data={content} /> */}
      <HeaderServer isRootPage={true} rootClassname={"justify-center"} />
      <main className="overflow-hidden">
        <Preloader data={preloaderData.Preloader} />
        <MainHero
          ownPr={ownPr[0]}
          partnerPr={partnerPr[0]}
          preloaderData={preloaderData.Preloader}
        />
      </main>
    </>
  );
}
