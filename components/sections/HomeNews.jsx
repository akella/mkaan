"use client";
import ButtonLink from "../ui/ButtonLink";
import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavLink from "../NavLink";
import SliderNavButton from "../ui/SliderNavButton";
import "swiper/css";
import "swiper/css/free-mode";
import NewsCard from "./NewsCard";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

gsap.registerPlugin(ScrollTrigger);

const HomeNews = ({ pageData, newsCards }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const updateEdgeState = useCallback((swiperInstance) => {
    const instance = swiperInstance ?? swiperRef.current;
    if (!instance) return;

    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  }, []);

  const handleSwiperInit = useCallback(
    (swiperInstance) => {
      swiperRef.current = swiperInstance;
      updateEdgeState(swiperInstance);

      const syncEdges = () => updateEdgeState(swiperInstance);
      swiperInstance.on("setTranslate", syncEdges);
      swiperInstance.on("transitionEnd", syncEdges);
      swiperInstance.on("resize", syncEdges);
      swiperInstance.once("destroy", () => {
        swiperInstance.off("setTranslate", syncEdges);
        swiperInstance.off("transitionEnd", syncEdges);
        swiperInstance.off("resize", syncEdges);
      });
    },
    [updateEdgeState],
  );
  const handlePrevClick = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.slidePrev();
  }, []);
  const handleNextClick = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.slideNext();
  }, []);
  useGSAP(() => {
    const mm = gsap.matchMedia();

    const slides = gsap.utils.toArray(".js-news-slide");

    mm.add("(min-width: 768px)", () => {
      slides.forEach((slide, i) => {
        gsap.fromTo(
          slide,
          { xPercent: 100, opacity: 0, delay: i * 0.1 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: ".js-news-slider",
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });
  }, []);
  return (
    <section className="py-[72px] max-md:py-16">
      <div className="px-[144px] max-md:px-4 flex items-end justify-between">
        <div className="md:mb-[7px]">
          <p className="text-11 opacity-40">
            {pageData?.Small_title || "news & updates"}
          </p>
          <h2 className="title-h1 mt-6">
            {pageData?.Big_title ? (
              <>
                {pageData.Big_title.trim().split(/\s+/)[0]} <br />
                {pageData.Big_title.trim().split(/\s+/).slice(1).join(" ")}
              </>
            ) : (
              <span
                dangerouslySetInnerHTML={{ __html: "News <br /> & Insights" }}
              />
            )}
          </h2>
        </div>
        <div className="flex items-center gap-6 max-md:hidden">
          <ButtonLink
            text={"Explore Blog"}
            tag="a"
            href="/news"
            variant="secondary"
          />
          <div className="w-px h-3 bg-brownDark"></div>
          <div className="flex gap-2">
            <SliderNavButton
              onClick={handlePrevClick}
              className={`border-brownDark text-textWhite ${isBeginning ? "" : "md:hover:text-dark md:hover:duration-500 md:hover:ease-[var(--ease-in)]"}`}
              style={{
                opacity: isBeginning ? 0.2 : 1,
                cursor: isBeginning ? "not-allowed" : "pointer",
              }}
              disabled={isBeginning}
              ariaLabel="Prev slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M5.76901 10.417L10.5959 15.2439L10.0013 15.8337L4.16797 10.0003L10.0013 4.16699L10.5959 4.75678L5.76901 9.58366H15.8346V10.417H5.76901Z"
                  fill="currentColor"
                />
              </svg>
            </SliderNavButton>
            <SliderNavButton
              onClick={handleNextClick}
              className={`border-brownDark text-textWhite ${isEnd ? "" : "md:hover:text-dark md:hover:duration-500 md:hover:ease-[var(--ease-in)]"}`}
              style={{
                opacity: isEnd ? 0.2 : 1,
                cursor: isEnd ? "not-allowed" : "pointer",
              }}
              ariaLabel="Next slide"
              disabled={isEnd}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M14.2297 10.418H4.16406V9.58464H14.2297L9.40281 4.75776L9.9974 4.16797L15.8307 10.0013L9.9974 15.8346L9.40281 15.2448L14.2297 10.418Z"
                  fill="currentColor"
                />
              </svg>
            </SliderNavButton>
          </div>
        </div>
      </div>

      <Swiper
        slidesPerView={1.14}
        spaceBetween={16}
        freeMode={true}
        modules={[FreeMode, Mousewheel]}
        onSwiper={handleSwiperInit}
        onSlideChange={updateEdgeState}
        centeredSlides={true}
        speed={700}
        allowTouchMove
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          releaseOnEdges: true,
        }}
        // centeredSlidesBounds={true}
        className="mySwiper md:!pl-[144px] md:!pl-4 mt-12 max-md:mt-10 js-news-slider !pr-3.5"
        breakpoints={{
          1024: {
            slidesPerView: "auto",
            spaceBetween: 48,
            centeredSlides: false,

            centeredSlidesBounds: false,
          },
        }}
      >
        {newsCards.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="js-news-slide !flex max-w-[432px] w-full relative"
          >
            <NewsCard
              title={slide.Hero_section.Title}
              date={slide.publishedAt || slide.Hero_section.Date}
              imageSrc={
                slide.Hero_section.Background_image
                  ? `${ASSET_URL}${slide.Hero_section.Background_image.url}`
                  : "/images/news/1.jpg"
              }
              link={`/news/${slide.id}`}
              className="p-6 max-lg:p-4"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between gap-6 md:hidden px-4 mt-6 ">
        <ButtonLink
          text={"Explore Blog"}
          tag="a"
          href="/news"
          variant="secondary"
        />

        <div className="flex gap-2">
          <SliderNavButton
            onClick={handlePrevClick}
            className="border-brownDark md:duration-400 md:ease-[var(--ease-in)] md:hover:duration-600 md:hover:ease-[var(--ease-in-out)] md:hover:bg-beige/10"
            style={{ opacity: isBeginning ? 0.2 : 1 }}
            ariaLabel="Prev slide"
            disabled={isBeginning}
            showFill={false}
            iconClassName=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.76901 10.417L10.5959 15.2439L10.0013 15.8337L4.16797 10.0003L10.0013 4.16699L10.5959 4.75678L5.76901 9.58366H15.8346V10.417H5.76901Z"
                fill="#F7F7EB"
              />
            </svg>
          </SliderNavButton>
          <SliderNavButton
            onClick={handleNextClick}
            className="border-brownDark md:duration-400 md:ease-[var(--ease-in)] md:hover:duration-600 md:hover:ease-[var(--ease-in-out)] md:hover:bg-beige/10"
            style={{ opacity: isEnd ? 0.2 : 1 }}
            ariaLabel="Next slide"
            disabled={isEnd}
            showFill={false}
            iconClassName=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.2297 10.418H4.16406V9.58464H14.2297L9.40281 4.75776L9.9974 4.16797L15.8307 10.0013L9.9974 15.8346L9.40281 15.2448L14.2297 10.418Z"
                fill="#F7F7EB"
              />
            </svg>
          </SliderNavButton>
        </div>
      </div>
    </section>
  );
};

export default HomeNews;
