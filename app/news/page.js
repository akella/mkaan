import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import NewsList from "@/components/sections/NewsList";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import { getNewsPage } from "@/lib/strapi";
import { getAllNewsPage } from "@/lib/strapi";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

export const revalidate = 120;

export async function generateMetadata() {
  const newsPageData = await getNewsPage();

  return generateMetadataFromSeoBlock(newsPageData?.Seo_block, {
    title: "Mkaan",
    description: "Mkaan - News page description",
  });
}

export default async function News() {
  const newsData = await getNewsPage();
  const allNewsData = await getAllNewsPage();
  const newsHero = newsData?.Hero_section_news;

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-hidden">
        <PageHero
          title={newsHero?.Title || "News Room"}
          titleClassName={"!max-w-[250px] w-full text-center"}
          subtitle={newsHero?.Description || "Updates from the World of Mkaan"}
          subtitleClassName={"md:mr-[80px] max-md:max-w-full max-md:mx-auto"}
          backgroundImage={
            newsHero?.Media?.url
              ? `${ASSET_URL}${newsHero.Media.url}`
              : "/images/news-hero.jpg"
          }
          scrollText={true}
          needAmount={true}
          amount={allNewsData.length}
        />
        <NewsList />
      </main>
      <FooterServer />
    </>
  );
}
