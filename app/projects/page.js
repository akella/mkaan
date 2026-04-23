import { generateMetadataFromSeoBlock } from "@/lib/metadata";

import HeaderServer from "@/components/snippets/Header/HeaderServer";
import PageHero from "@/components/sections/PageHero";
import ProjectsList from "@/components/sections/ProjectsList";
import FooterServer from "@/components/snippets/Footer/FooterServer";
import { getProjectPage } from "@/lib/strapi";
import qs from "qs";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
export const revalidate = 120;

const resolveCategoryId = (category) =>
  category?.id ?? category?.documentId ?? category?.document_id ?? null;

const categoryHasProjects = async (categoryId) => {
  if (!categoryId) return false;

  try {
    const query = qs.stringify(
      {
        pLevel: 1,
        pagination: {
          page: 1,
          pageSize: 1,
        },
        filters: {
          project_type_filter: {
            id: {
              $eq: categoryId,
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${API_URL}projects?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const total = result?.meta?.pagination?.total;

    if (typeof total === "number") {
      return total > 0;
    }

    const data = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
        ? result
        : [];

    return data.length > 0;
  } catch (error) {
    console.log("Error checking category projects data:", error);
    return false;
  }
};

const getCategoriesWithProjectsOnly = async (categories = []) => {
  if (!Array.isArray(categories) || categories.length === 0) return [];

  const visibility = await Promise.all(
    categories.map(async (category) => {
      const categoryId = resolveCategoryId(category);
      const hasProjects = await categoryHasProjects(categoryId);
      return { category, hasProjects };
    }),
  );

  return visibility
    .filter((item) => item.hasProjects)
    .map((item) => item.category);
};

export async function generateMetadata() {
  const projectPageData = await getProjectPage();

  return generateMetadataFromSeoBlock(projectPageData?.Seo_block, {
    title: "Mkaan Projects",
    description: "Mkaan - Projects description",
  });
}

export default async function Projects() {
  const getAllProjectsCategories = async () => {
    try {
      const response = await fetch(`${API_URL}project-filters?pLevel=4`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Error fetching projects categories data:", error);
      return null;
    }
  };

  const projectPageData = await getProjectPage();

  const prHero = projectPageData?.Project_page_hero;

  const categoriesResult = await getAllProjectsCategories();
  const visibleCategories = await getCategoriesWithProjectsOnly(
    categoriesResult?.data ?? [],
  );

  return (
    <>
      <HeaderServer pageName={["Own With Mkaan", "Partner With Mkaan"]} />
      <main className="md:overflow-x-hidden">
        <PageHero
          title={prHero?.Title || "The Work that Endures"}
          titleClassName={"!max-w-[450px] w-full"}
          backgroundImage={
            prHero?.Media
              ? `${ASSET_URL}${prHero.Media.url}`
              : "/images/pr-hero.jpg"
          }
          scrollText={true}
          needFilters={true}
          needRange={true}
          filters={visibleCategories}
        />
        <ProjectsList categories={visibleCategories} />
      </main>
      <FooterServer />
    </>
  );
}
