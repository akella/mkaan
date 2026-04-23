import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PartnersBlock from "@/components/sections/partners/PartnersBlock";
import { getPartnersPage } from "@/lib/strapi";
export const revalidate = 120;

export async function generateMetadata() {
  const partnersData = await getPartnersPage();

  return generateMetadataFromSeoBlock(partnersData?.Seo_block, {
    title: "Mkaan11",
    description: "Mkaan - Main page description",
  });
}

export default async function Partner() {
  const partnersData = await getPartnersPage();
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PartnersBlock partnersData={partnersData} />
      </main>
    </>
  );
}
