"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import NewsCard from "./NewsCard";
import ButtonLink from "../ui/ButtonLink";
import qs from "qs";

const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const NewsListRender = ({ data, hasMoreInitial }) => {
  const pageSize = 6;
  const initialItems = Array.isArray(data) ? data : [];
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    typeof hasMoreInitial === "boolean"
      ? hasMoreInitial
      : initialItems.length > pageSize,
  );
  gsap.registerPlugin(ScrollTrigger);
  const nList = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const firstCard = document.querySelector(".js-news-card-0");
      const secondCard = document.querySelector(".js-news-card-1");
      const thirdCard = document.querySelector(".js-news-card-2");

      if (!firstCard || !secondCard || !thirdCard) return;

      firstCard.classList.remove("news-card");
      secondCard.classList.remove("news-card");

      gsap.set(firstCard, { paddingRight: "12px" });
      gsap.set(secondCard, { paddingLeft: "12px", paddingRight: "12px" });
      gsap.set(thirdCard, { paddingLeft: "12px" });

      gsap.to(firstCard, {
        paddingRight: "24px",
        onStart: () => {
          firstCard.classList.add("news-card");
        },

        scrollTrigger: {
          trigger: nList.current,
          start: "top 80%",
          end: "60% bottom",
          scrub: true,
          // markers: true,
          onLeaveBack: () => {
            firstCard.classList.remove("news-card");
          },
        },
      });
      gsap.to(secondCard, {
        paddingRight: "24px",
        paddingLeft: "24px",
        onStart: () => {
          secondCard.classList.add("news-card");
        },
        scrollTrigger: {
          trigger: nList.current,
          start: "top 80%",
          end: "60% bottom",
          scrub: true,
          onLeaveBack: () => {
            secondCard.classList.remove("news-card");
          },
        },
      });
      gsap.to(thirdCard, {
        paddingLeft: "24px",
        scrollTrigger: {
          trigger: nList.current,
          start: "top 80%",
          end: "60% bottom",
          scrub: true,
        },
      });
    });
  }, []);

  const handleLoadMore = async () => {
    if (!API_URL || isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;

    try {
      const query = qs.stringify(
        {
          sort: ["Sort_order:asc"],
          pLevel: 4,
        },
        { encodeValuesOnly: true },
      );
      const response = await fetch(
        `${API_URL}newsletters?${query}&pagination[page]=${nextPage}&pagination[pageSize]=${pageSize}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newItems = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      if (newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...newItems]);
      setPage(nextPage);

      if (newItems.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more newsletters:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="relative bg-dark pb-[120px]">
      <div
        ref={nList}
        className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 overflow-clip news-wrapper"
      >
        {items.map((newsItem, index) => (
          <div
            key={index}
            className={`js-news-card-${index} relative p-6 max-md:p-4 news-card`}
          >
            <NewsCard
              title={newsItem.Hero_section.Title}
              date={newsItem.publishedAt}
              imageSrc={
                newsItem?.Hero_section?.Background_image?.url
                  ? ASSET_URL + newsItem?.Hero_section?.Background_image?.url
                  : "/images/news-list/1.jpg"
              }
              link={`news/${newsItem.id}`}
              className="p-6 max-md:p-4"
              infoBlockClassName="h-[88.3%] w-[90%] !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
            />
          </div>
        ))}
      </div>
      {hasMore && (
        <ButtonLink
          tag="button"
          type="button"
          text={isLoading ? "loading..." : "load more"}
          className="flex mx-auto mt-6"
          onClick={handleLoadMore}
          disabled={isLoading}
        />
      )}
    </section>
  );
};

export default NewsListRender;
