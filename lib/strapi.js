import qs from "qs";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

export const getAboutPage = async () => {
  try {
    const response = await fetch(`${API_URL}about?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching about data:", error);
    return null;
  }
};
export const getOwnWithPage = async () => {
  try {
    const response = await fetch(`${API_URL}own-with-mkaan?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching own-with-mkaan data:", error);
    return null;
  }
};
export const getPartnerWithPage = async () => {
  try {
    const response = await fetch(`${API_URL}partner-with-mkaan?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching partner-with-mkaan data:", error);
    return null;
  }
};
export const getDevelopmentPage = async () => {
  try {
    const response = await fetch(`${API_URL}development?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching development data:", error);
    return null;
  }
};
export const getCareerPage = async () => {
  try {
    const response = await fetch(`${API_URL}career?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching career data:", error);
    return null;
  }
};
export const getContactPage = async () => {
  try {
    const response = await fetch(`${API_URL}contact-info?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching contact-info data:", error);
    return null;
  }
};
export const getErrorPage = async () => {
  try {
    const response = await fetch(`${API_URL}error-page?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching error-page data:", error);
    return null;
  }
};
export const getPartnersPage = async () => {
  try {
    const response = await fetch(`${API_URL}partner?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching partner data:", error);
    return null;
  }
};
export const getAllNewsPage = async () => {
  try {
    const query = qs.stringify(
      {
        sort: ["Sort_order:asc"],
        pLevel: 4,
      },
      { encodeValuesOnly: true },
    );
    const response = await fetch(`${API_URL}newsletters?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching newsletters data:", error);
    return null;
  }
};

export const getOneNewsById = async (id) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $eq: id,
          },
        },
        pLevel: 4,
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${API_URL}newsletters?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (Array.isArray(result?.data)) {
      return result.data[0] || null;
    }

    return result?.data || result || null;
  } catch (error) {
    console.log("Error fetching newsletter by id data:", error);
    return null;
  }
};

export const getAllCasesPage = async () => {
  try {
    const query = qs.stringify(
      {
        sort: ["Sort_order:asc"],
        pLevel: 4,
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${API_URL}cases?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result?.data || result;

    if (Array.isArray(data)) {
      return [...data].sort(
        (a, b) =>
          (a?.Sort_order ?? Number.MAX_SAFE_INTEGER) -
          (b?.Sort_order ?? Number.MAX_SAFE_INTEGER),
      );
    }
    return data;
  } catch (error) {
    console.log("Error fetching cases data:", error);
    return null;
  }
};
export const getNewsPage = async () => {
  try {
    const response = await fetch(`${API_URL}news-page?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching news-page data:", error);
    return null;
  }
};
export const getProjectPage = async () => {
  try {
    const response = await fetch(`${API_URL}project-page?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching project-page data:", error);
    return null;
  }
};
export const getAllProjectsCards = async () => {
  try {
    const query = qs.stringify(
      {
        sort: ["Sort_order:asc"],
        pLevel: 4,
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
    const data = result?.data || result;

    if (Array.isArray(data)) {
      return [...data].sort(
        (a, b) =>
          (a?.Sort_order ?? Number.MAX_SAFE_INTEGER) -
          (b?.Sort_order ?? Number.MAX_SAFE_INTEGER),
      );
    }

    return data;
  } catch (error) {
    console.log("Error fetching projects data:", error);
    return null;
  }
};
export const getPreloader = async () => {
  try {
    const response = await fetch(`${API_URL}preloader?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching preloader data:", error);
    return null;
  }
};
export const getCasesPage = async () => {
  try {
    const response = await fetch(`${API_URL}cases-page?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching cases-page data:", error);
    return null;
  }
};

export const getOneCaseById = async (slug) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          Hero_section_case: {
            Slug: {
              $eq: slug,
            },
          },
        },
        pLevel: 4,
      },
      { encodeValuesOnly: true },
    );
    const response = await fetch(`${API_URL}cases?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (Array.isArray(result?.data)) {
      return result.data[0] || null;
    }

    return result?.data || result || null;
  } catch (error) {
    console.log("Error fetching case by id data:", error);
    return null;
  }
};

export const getFormsFieldsPage = async () => {
  try {
    const response = await fetch(`${API_URL}own-with-mkaan-form?pLevel=4`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.log("Error fetching own-with-mkaan-form data:", error);
    return null;
  }
};
export const getOneProjectById = async (slug) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          Hero_section_project: {
            Slug: {
              $eq: slug,
            },
          },
        },
        pLevel: 4,
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

    if (Array.isArray(result?.data)) {
      return result.data[0] || null;
    }

    return result?.data || result || null;
  } catch (error) {
    console.log("Error fetching project by slug data:", error);
    return null;
  }
};

// export const getOneProject = async ({ slug }) => {
//   try {
//     const query = qs.stringify(
//       {
//         filters: {
//           Slug: {
//             $eq: slug,
//           },
//         },
//         pLevel: 4,
//       },
//       { encodeValuesOnly: true }
//     );

//     const response = await fetch(`${API_URL}one-projects?${query}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     if (Array.isArray(result?.data)) {
//       return result.data[0] || null;
//     }

//     return result?.data || result || null;
//   } catch (error) {
//     console.log("Error fetching projects data:", error);
//     return null;
//   }
// };

export const getAllHeroImages = async () => {
  try {
    const [about, career, cases, development, news, projectPage, own, partner] =
      await Promise.all([
        getAboutPage(),
        getCareerPage(),
        getCasesPage(),
        getDevelopmentPage(),
        getNewsPage(),
        getProjectPage(),
        getOwnWithPage(),
        getPartnerWithPage(),
      ]);

    const url = (path) => (path ? `${ASSET_URL}${path}` : null);

    const map = {};
    const set = (route, val) => {
      if (val) map[route] = val;
    };
    set("/about", url(about?.Hero_section_about?.Main_photo?.url));
    set("/career", url(career?.Hero_section_career?.Media?.url));
    set("/case-study", url(cases?.Hero_cases_page?.Media?.url));
    set("/development", url(development?.Hero_section_development?.Media?.url));
    set("/news", url(news?.Hero_section_news?.Media?.url));
    set("/projects", url(projectPage?.Project_page_hero?.Media?.url));
    set(
      "/own-with-mkaan",
      url(own?.projects?.[0]?.Hero_section_project?.Photo?.url),
    );
    set(
      "/partner-with-mkaan",
      url(partner?.projects?.[0]?.Hero_section_project?.Photo?.url),
    );
    return map;
  } catch (error) {
    console.log("Error fetching hero images map:", error);
    return {};
  }
};
