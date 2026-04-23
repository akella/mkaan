import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import NewsImage from "@/components/sections/single-news/NewsImage";
import NewsContent from "@/components/sections/single-news/NewsContent";
import { getOneNewsById } from "@/lib/strapi";
import { notFound } from "next/navigation";
export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getOneNewsById(id);

  return generateMetadataFromSeoBlock(post?.Seo_block, {
    title: "Mkaan News",
    description: "Mkaan - News description",
  });
}

export default async function SingleNews({ params }) {
  const { id } = await params;
  const newsData = await getOneNewsById(id);

  if (!newsData) return notFound();

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <NewsImage image={newsData.Hero_section?.Background_image} />
        <NewsContent data={newsData} />
      </main>
    </>
  );
}
