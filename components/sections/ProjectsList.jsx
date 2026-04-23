import ProjectsListRender from "./ProjectsListRender";
import qs from "qs";
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const ProjectsList = async ({ categories = [] }) => {
  const pageSize = 5;
  const page = 1;

  const getAllProjects = async () => {
    try {
      const query = qs.stringify(
        {
          sort: ["Sort_order:asc"],
          pLevel: 4,
        },
        { encodeValuesOnly: true },
      );
      const response = await fetch(
        `${API_URL}projects?${query}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Error fetching projects data:", error);
      return null;
    }
  };
  const result = await getAllProjects();

  const items = Array.isArray(result?.data) ? result.data : [];
  const total = result?.meta?.pagination?.total ?? items.length;
  const hasMoreInitial = total > items.length;

  return (
    <ProjectsListRender
      projects={items}
      categories={categories}
      hasMoreInitial={hasMoreInitial}
      pageSize={pageSize}
    />
  );
};

export default ProjectsList;
