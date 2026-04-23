"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import ButtonLink from "../ui/ButtonLink";
import AnimatedImage from "../ui/AnimatedImage";
import HoverTooltip from "../ui/HoverTooltip";
import Image from "next/image";
import NavLink from "../NavLink";
import qs from "qs";
import {
  CURSOR_DOT_MOVE_EVENT,
  PROJECT_FILTER_CHANGE_EVENT,
  PROJECT_FILTER_UPDATED_EVENT,
} from "@/lib/constants";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const resolveCategoryId = (category) =>
  category?.id ?? category?.documentId ?? category?.document_id ?? null;

const ProjectsListRender = ({
  projects,
  categories,
  hasMoreInitial,
  pageSize = 5,
}) => {
  const normalizedProjects = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects],
  );
  const normalizedCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );
  const resolvedPageSize = pageSize ?? 5;

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [nextCategoryName, setNextCategoryName] = useState(null);
  const [items, setItems] = useState(() => normalizedProjects);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(() =>
    typeof hasMoreInitial === "boolean"
      ? hasMoreInitial
      : normalizedProjects.length >= resolvedPageSize,
  );
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const tooltipActiveRef = useRef(false);
  const tooltipRootRef = useRef(null);
  const prListRef = useRef(null);

  useEffect(() => {
    const handleDotMove = (event) => {
      if (!tooltipActiveRef.current) return;
      const { x, y } = event.detail || {};
      if (typeof x !== "number" || typeof y !== "number") return;
      if (tooltipRootRef.current) {
        tooltipRootRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translateY(calc(-50% - 5px))`;
      }
    };

    window.addEventListener(CURSOR_DOT_MOVE_EVENT, handleDotMove);
    return () => {
      window.removeEventListener(CURSOR_DOT_MOVE_EVENT, handleDotMove);
    };
  }, []);

  useEffect(() => {
    setItems(normalizedProjects);
    setPage(1);
    setHasMore(
      typeof hasMoreInitial === "boolean"
        ? hasMoreInitial
        : normalizedProjects.length >= resolvedPageSize,
    );
    setActiveFilter("All");
    setActiveCategoryId(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(PROJECT_FILTER_UPDATED_EVENT, {
          detail: {
            label: "All",
            categoryId: null,
            source: "projects-list",
          },
        }),
      );
    }
  }, [normalizedProjects, hasMoreInitial, resolvedPageSize]);

  const handleMouseEnter = useCallback((event) => {
    tooltipActiveRef.current = true;
    setTooltipVisible(true);
    if (tooltipRootRef.current) {
      tooltipRootRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translateY(calc(-50% - 5px))`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    tooltipActiveRef.current = false;
    setTooltipVisible(false);
  }, []);

  useEffect(() => {
    if (normalizedCategories.length === 0) {
      setNextCategoryName(null);
      return;
    }

    if (activeFilter === "All") {
      setNextCategoryName(normalizedCategories[0]?.Type ?? null);
      return;
    }

    const currentIndex = normalizedCategories.findIndex(
      (category) => category?.Type === activeFilter,
    );
    if (currentIndex === -1) {
      setNextCategoryName(null);

      return;
    }

    const nextCategory = normalizedCategories[currentIndex + 1]?.Type ?? null;
    setNextCategoryName(nextCategory);
  }, [activeFilter, normalizedCategories]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1027px)", () => {
      // Add animations and ScrollTrigger setups for desktop here if needed
      const firstCardEl = document.querySelector(".js-pr-card-0");
      const firstImgEl = firstCardEl?.querySelector("img");
      const secondCardEl = document.querySelector(".js-pr-card-1");
      const secondImgEl = secondCardEl?.querySelector("img");

      if (firstCardEl && secondCardEl) {
        gsap.set(firstImgEl, {
          paddingRight: "12px",
          borderColor: "transparent",
        });
        gsap.set(secondImgEl, {
          paddingLeft: "12px",
        });

        gsap.to(firstImgEl, {
          paddingRight: "24px",
          borderColor: "#f7f7eb1a",
          scrollTrigger: {
            trigger: prListRef.current,
            start: "top 80%",
            end: "20% bottom",

            scrub: true,
          },
        });
        gsap.to(secondImgEl, {
          paddingLeft: "24px",
          scrollTrigger: {
            trigger: prListRef.current,
            start: "top 80%",
            end: "20% bottom",

            scrub: true,
          },
        });
      }
    });

    mm.add("(min-width: 768px)", () => {
      const filterEl = document.querySelector(".js-pr-filter");
      if (!filterEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: prListRef.current,
          start: "top center",
          end: "bottom bottom",
          toggleActions: "play reverse play reverse",

          // markers: true,
        },
      });
      tl.to(filterEl, { bottom: 36, duration: 1, ease: "power4.out" });

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const fetchProjects = useCallback(
    async ({ targetPage = 1, categoryId = null }) => {
      if (!API_URL) {
        console.error("NEXT_PUBLIC_STRAPI_API_URL is not defined");
        return { data: [], hasMore: false };
      }

      const queryParams = {
        sort: ["Sort_order:asc"],
        pLevel: 4,
        pagination: {
          page: targetPage,
          pageSize: resolvedPageSize,
        },
      };

      if (categoryId !== null && categoryId !== undefined) {
        queryParams.filters = {
          project_type_filter: {
            id: {
              $eq: categoryId,
            },
          },
        };
      }

      const query = qs.stringify(queryParams, { encodeValuesOnly: true });

      const response = await fetch(`${API_URL}projects?${query}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];
      const total = result?.meta?.pagination?.total;
      const calculatedHasMore =
        typeof total === "number"
          ? total > targetPage * resolvedPageSize
          : data.length === resolvedPageSize;

      return { data, hasMore: calculatedHasMore };
    },
    [API_URL, resolvedPageSize],
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;

    try {
      const { data: newItems, hasMore: nextHasMore } = await fetchProjects({
        targetPage: nextPage,
        categoryId: activeCategoryId,
      });

      if (!Array.isArray(newItems) || newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(nextHasMore);
    } catch (error) {
      console.error("Error loading more projects:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategoryId, fetchProjects, hasMore, isLoading, page]);

  const handleFilterClick = useCallback(
    async (filterLabel, categoryId = null) => {
      if (isLoading) return;

      const normalizedLabel = filterLabel ?? "All";
      const isAll = normalizedLabel === "All";
      const isSameSelection = isAll
        ? activeFilter === "All"
        : normalizedLabel === activeFilter && categoryId === activeCategoryId;

      if (isSameSelection) return;

      const nextCategoryId = isAll ? null : (categoryId ?? null);

      setActiveFilter(normalizedLabel);
      setActiveCategoryId(nextCategoryId);
      setIsLoading(true);

      try {
        const { data: filteredItems, hasMore: nextHasMore } =
          await fetchProjects({
            targetPage: 1,
            categoryId: nextCategoryId,
          });

        setItems(filteredItems);
        setPage(1);
        setHasMore(nextHasMore);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(PROJECT_FILTER_UPDATED_EVENT, {
              detail: {
                label: normalizedLabel,
                categoryId: nextCategoryId,
                source: "projects-list",
              },
            }),
          );
        }
      } catch (error) {
        console.error("Error fetching filtered projects:", error);
        setItems([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategoryId, activeFilter, fetchProjects, isLoading],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleExternalFilterChange = (event) => {
      const { label, categoryId, source } = event.detail ?? {};
      if (source === "projects-list") return;
      handleFilterClick(label ?? "All", categoryId ?? null);
    };

    window.addEventListener(
      PROJECT_FILTER_CHANGE_EVENT,
      handleExternalFilterChange,
    );

    return () => {
      window.removeEventListener(
        PROJECT_FILTER_CHANGE_EVENT,
        handleExternalFilterChange,
      );
    };
  }, [handleFilterClick]);

  const setImgWrapperClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "relative h-[744px] max-lg:h-[500px] max-md:h-auto max-md:px-4";
      case 1:
        return "relative h-[744px] max-lg:h-[500px] max-md:h-auto max-md:px-4";
      case 2:
        return "relative h-[744px] max-lg:h-[500px] max-md:h-auto max-md:px-4 py-6 pr-large col-span-2";
      default:
        return "";
    }
  };
  const setImgClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "object-cover w-full h-full px-6 max-md:px-0 border-r border-r-brownDark max-md:h-[280px]";
      case 1:
        return "object-cover w-full h-full px-6 max-md:px-0 border-r border-r-brownDark max-md:h-[280px]";
      case 2:
        return "object-cover w-full h-full px-6 max-md:px-0 border-r border-r-brownDark max-md:h-[280px]";
      default:
        return "";
    }
  };
  return (
    <>
      <section
        ref={prListRef}
        className="bg-dark relative py-6 pb-[120px] max-md:pb-24"
      >
        <div
          className="relative grid grid-cols-2 max-md:grid-cols-1 gap-y-6"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((project, index) => (
            <div
              key={index}
              className={`js-pr-card-${index} ${setImgWrapperClass(index)}`}
            >
              <AnimatedImage rootClass={"md:h-full"}>
                <Image
                  width={672}
                  height={744}
                  src={`${ASSET_URL}${project.Hero_section_project.Photo.url}`}
                  alt="project image"
                  className={setImgClass(index)}
                  quality={100}
                />
              </AnimatedImage>
              <NavLink
                href={`/projects/${project.Hero_section_project.Slug}`}
                className="max-md:hidden group cursor-f absolute inset-0 px-6 flex items-center justify-center opacity-0 md:hover:opacity-100 md:transition-opacity md:duration-400"
              >
                <div className="absolute w-full h-[744px] left-1/2 -translate-x-1/2 bg-[rgba(20,_9,_14,_0.70)]"></div>
                <div className="relative flex items-center justify-between w-full px-6">
                  <p className="text-14">
                    {project.Hero_section_project.Location}
                  </p>
                  <h3 className="absolute left-1/2 transform -translate-x-1/2 text-28 max-w-[185px] text-center">
                    {project.Hero_section_project.Title}
                  </h3>
                  <p className="text-14">{project.Hero_section_project.Year}</p>
                </div>

                <Image
                  alt="map"
                  width={249}
                  height={256}
                  src={"/icons/mask/maps/1.svg"}
                  className="mix-blend-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 md:group-hover:opacity-100 md:transition-opacity delay-350 md:duration-400"
                />
              </NavLink>
              <div
                className={`md:hidden mt-5 flex justify-between items-end pr-[25px] pb-4 border-b border-b-brownDark ${
                  index === items.length - 1 ? "border-b-0" : ""
                }`}
              >
                <h3 className="text-24 max-w-[40%]">
                  {project.Hero_section_project.Title}
                </h3>
                <div className="text-14 pl-4 border-l border-brownDark flex flex-col gap-4 ">
                  <div>
                    <p className="max-w-[40px]">
                      {project.Hero_section_project.Location}
                    </p>
                    <p className="max-w-[40px]">
                      {project.Hero_section_project.Year}
                    </p>
                  </div>
                  <NavLink
                    className="underline underline-offset-4"
                    href={`/projects/${project.Hero_section_project.Slug}`}
                  >
                    Explore Project
                  </NavLink>
                </div>
              </div>
            </div>
          ))}

          <HoverTooltip
            visible={tooltipVisible}
            x={0}
            y={0}
            rootRef={tooltipRootRef}
            text="Explore Project"
            textStyle={{ fontSize: 14 }}
          />
        </div>
        {hasMore && (
          <ButtonLink
            tag="button"
            type="button"
            text={isLoading ? "Loading..." : "Load More"}
            className="flex mx-auto mt-12 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleLoadMore}
            disabled={isLoading}
          />
        )}
      </section>
      <div className="filter-items fixed left-1/2 -translate-x-1/2 -bottom-9 z-20 js-pr-filter text-14 max-sm:w-full hidden md:flex items-center justify-center">
        <button
          onClick={() => handleFilterClick("All")}
          className={`group relative flex items-center filter-button js-filter-btn md:transition-all md:duration-700 -mr-px`}
        >
          <div className="absolute ease-[var(--ease-in-out)] z-10 inset-0 bg-hover/7 opacity-0 group-hover:opacity-100 md:transition-all md:duration-600"></div>
          <div
            className={`relative py-1.5 px-3 md:transition-all md:duration-600 ease-[var(--ease-in-out)] ${
              activeFilter === "All"
                ? "rounded-2xl bg-wine text-textWhite"
                : "bg-textWhite text-dark"
            }`}
          >
            <div className="absolute inset-0 bg-hover-white/7 rounded-2xl opacity-0 group-hover:opacity-100 md:transition-all md:duration-600 ease-[var(--ease-in-out)]"></div>
            All
          </div>
          <div
            className={`relative z-10 w-px h-[12px] transition-all duration-600 ease-[var(--ease-in-out)] ${
              activeFilter === "All" || activeFilter === nextCategoryName
                ? "bg-brownDark mx-2"
                : "bg-beige"
            } ${activeFilter === normalizedCategories[0]?.Type ? "ml-2" : ""}`}
          ></div>
        </button>
        {normalizedCategories.map((category, index) =>
          (() => {
            const isActiveAndLast =
              activeFilter === category.Type &&
              index === normalizedCategories.length - 1;

            return (
              <button
                key={index}
                onClick={() =>
                  handleFilterClick(category.Type, resolveCategoryId(category))
                }
                className={`flex group filter-button relative items-center js-filter-btn md:transition-all md:duration-600 ease-[var(--ease-in-out)] ${isActiveAndLast ? "" : "-ml-[1px]"}  ${
                  activeFilter === category.Type ||
                  activeFilter === nextCategoryName
                    ? "rounded-2xl text-textWhite "
                    : "text-dark md:transition-all md:duration-600 ease-[var(--ease-in-out)]"
                }  ${activeFilter !== category.Type ? "" : ""} ${activeFilter === category.Type ? "bg-transparent" : ""}`}
              >
                {activeFilter !== category.Type && (
                  <div className="absolute inset-0 bg-hover/7 opacity-0 group-hover:opacity-100 md:transition-all md:duration-600 ease-[var(--ease-in-out)]"></div>
                )}
                <div
                  className={`relative py-1.5 px-3 md:transition-all md:duration-600 ease-[var(--ease-in-out)] -mr-px ${
                    activeFilter === category.Type
                      ? "rounded-2xl bg-wine pr-filter-btn text-textWhite mx-2"
                      : "bg-textWhite text-inherit"
                  }`}
                >
                  {activeFilter === category.Type && (
                    <div className="absolute inset-0 bg-hover-white/7 rounded-2xl opacity-0 group-hover:opacity-100 md:transition-all md:duration-600 ease-[var(--ease-in-out)]"></div>
                  )}
                  {category.Type}
                </div>

                <div
                  className={`relative filter-button-line z-10 w-px h-[12px] md:transition-all md:duration-600 ease-[var(--ease-in-out)] bg-beige ${activeFilter === category.Type || activeFilter === nextCategoryName ? "mx-2 bg-brownDark" : ""}  ${nextCategoryName === null ? "!ml-2 bg-brownDark" : ""}`}
                ></div>
              </button>
            );
          })(),
        )}
      </div>
    </>
  );
};

export default ProjectsListRender;
