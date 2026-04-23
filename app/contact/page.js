import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import Contacts from "@/components/sections/Contacts";
import { getContactPage } from "@/lib/strapi";
export const revalidate = 120;

export async function generateMetadata() {
  // TODO: Fetch mainData when Strapi is connected
  // const mainData = await getMainPage();

  return generateMetadataFromSeoBlock(null, {
    title: "Mkaan",
    description: "Mkaan - Contact page description",
  });
}

export default async function Contact() {
  const contactData = await getContactPage();
  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <Contacts data={contactData} />
      </main>
    </>
  );
}
