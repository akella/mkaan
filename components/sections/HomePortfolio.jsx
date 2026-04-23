"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect, useCallback } from "react";
import NavLink from "../NavLink";
import Image from "next/image";
import ButtonLink from "../ui/ButtonLink";
import AnimatedTitle from "../ui/AnimatedTitle";
import HoverTooltip from "../ui/HoverTooltip";
import { CustomEase } from "gsap/CustomEase";
import parse from "html-react-parser";
import { CURSOR_DOT_MOVE_EVENT } from "@/lib/constants";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
import AnimatedImage from "../ui/AnimatedImage";

const HomePortfolio = ({ pageData, allProjects }) => {
  const sectionRef = useRef(null);
  const portfolioRef = useRef(null);
  const listRef = useRef(null);
  const wrapRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaBottom = useRef(null);
  const [tooltip, setTooltip] = useState({ index: null, x: 0, y: 0 });
  const activeSlideRef = useRef(null);
  const tooltipRootRef = useRef(null);

  const handleMouseEnter = useCallback((event, slideIndex) => {
    activeSlideRef.current = slideIndex;
    setTooltip({ index: slideIndex, x: event.clientX, y: event.clientY });
    if (tooltipRootRef.current) {
      tooltipRootRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translateY(calc(-50% - 5px))`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    activeSlideRef.current = null;
    setTooltip({ index: null, x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleDotMove = (event) => {
      if (activeSlideRef.current === null) return;
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
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const mm = gsap.matchMedia();
    CustomEase.create("easeOut", "0.25, 1, 0.5, 1");
    const sectionEl = sectionRef.current;
    const pinnedEl = portfolioRef.current;
    const listEl = listRef.current;

    const prevSection = sectionEl.previousElementSibling;

    const cleanupFns = [];
    const addCleanup = (fn) => {
      if (typeof fn === "function") {
        cleanupFns.push(fn);
      }
    };

    mm.add("(min-width: 1024px)", () => {
      gsap.to(portfolioRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: portfolioRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,

          // markers: true,
        },
      });
      const scrollTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: () => {
          const distance = sectionEl.scrollHeight - pinnedEl.offsetHeight;
          return `+=${Math.max(distance, 0)}`;
        },
        pin: pinnedEl,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const listScaleUp = () => {
        return gsap.to(listEl, {
          scale: 1.03,
          ease: "easeOut",
          duration: 0.7,
          overwrite: "auto",
        });
      };

      const listScaleDown = () => {
        return gsap.to(listEl, {
          scale: 1,
          ease: "easeOut",
          duration: 0.7,
          overwrite: "auto",
        });
      };

      let scrollTimeout;
      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Ignore macroscopic scroll "drifts" on Safari when releasing the trackpad
        if (delta < 2) return;

        listScaleUp();

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          listScaleDown();
        }, 200);
      };

      window.addEventListener("scroll", handleScroll);

      addCleanup(() => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      });

      return () => {
        scrollTrigger.kill();

        cleanupFns.forEach((fn) => fn());
      };
    });
    gsap.set(listEl, { transformOrigin: "center center" });

    const cards = gsap.utils.toArray(
      listEl.querySelectorAll("[data-portfolio-card]"),
    );
    gsap.set(cards, {
      transformOrigin: "center center",
      willChange: "transform",
    });

    mm.add("(min-width: 1024px)", () => {
      if (cards.length) {
        const horizontalTween = gsap.to(cards, {
          duration: 0.7,
          ease: "none",
          stagger: {
            each: 0.15,
          },
          keyframes: [
            {
              xPercent: 35,
              // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              ease: "power2.out",
              duration: 0.3,
              // delay: 0.05,
            },
            {
              xPercent: -35,
              // clipPath: "polygon(10% 0, 100% 0, 100% 100%, 10% 100%)",
              rotate: 3,
              ease: "power2.inOut",
              duration: 0.5,
            },
          ],
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "120% bottom",
            scrub: true,
            invalidateOnRefresh: true,
            // markers: true,
          },
        });

        gsap.to(ctaBottom.current, {
          opacity: 1,
          scrollTrigger: {
            trigger: ctaBottom.current,
            pin: true,
            pinSpacer: true,
            start: "bottom bottom",
            end: "+=248px",
            // markers: true,
            refreshPriority: 1,
            invalidateOnRefresh: true,
            scrub: true,

            // end: "top top",
          },
        });

        addCleanup(() => {
          horizontalTween.scrollTrigger?.kill();
          horizontalTween.kill();
        });
      }
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.to(portfolioRef.current, {
        scrollTrigger: {
          trigger: portfolioRef.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          // markers: true,
        },
      });

      gsap.to(ctaRef.current, {
        opacity: 1,

        scrollTrigger: {
          trigger: wrapRef.current,
          start: "bottom center",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative bg-dark overflow-clip js-portfolio-section"
    >
      <div
        ref={portfolioRef}
        className="h-screen flex items-center justify-center relative z-10"
      >
        <div className="flex flex-col items-center gap-6">
          <p className="text-11 opacity-40">{pageData?.Small_title}</p>
          <AnimatedTitle
            tag={"h2"}
            className="title-h1 max-md:!text-[52px] max-md:!leading-[44px] max-md:!tracking-[-1.3px] text-center"
          >
            {parse(pageData?.Title) ? parse(pageData?.Title) : "Portfolio"}
          </AnimatedTitle>
        </div>
      </div>

      <div ref={wrapRef} className="relative z-20  max-md:px-4">
        <HoverTooltip
          visible={tooltip.index !== null}
          x={tooltip.x}
          y={tooltip.y}
          rootRef={tooltipRootRef}
          className="z-40"
          showDot={false}
          text="Explore Project"
          textStyle={{ fontSize: 14 }}
        />
        <ul
          ref={listRef}
          className="relative z-20 mx-auto flex w-fit lg:-rotate-2 flex-col gap-8 max-md:bg-dark"
        >
          {allProjects.map((item, index) => (
            <li
              // data-no-dot
              key={item.id}
              data-portfolio-card
              className="group relative md:!w-[720px] will-change-transform home-pr-card"
              onMouseEnter={(event) => handleMouseEnter(event, index)}
              onMouseLeave={handleMouseLeave}
              // style={{ aspectRatio: "720 / 524" }}
            >
              <div
                className="relative flex h-full !w-[720px] min-h-[524px] max-lg:hidden"
                // href={item.href}
              >
                <AnimatedImage>
                  <Image
                    src={
                      item?.Hero_section_project?.Photo?.url
                        ? `${ASSET_URL}${item?.Hero_section_project?.Photo?.url}`
                        : "/images/portfolio/1.jpg"
                    }
                    width={720}
                    height={524}
                    quality={100}
                    alt={
                      item.Hero_section_project.Title || "Project teaser still"
                    }
                    className="w-full object-cover"
                    priority={index === 0}
                  />
                </AnimatedImage>
                <NavLink
                  href={`/projects/${item.Hero_section_project.Slug}`}
                  preload={
                    item?.Hero_section_project?.Photo?.url
                      ? `${ASSET_URL}${item.Hero_section_project.Photo.url}`
                      : undefined
                  }
                  className="max-md:hidden group cursor-f absolute inset-0 px-6 flex items-center justify-center overflow-clip opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-400"
                >
                  <div className="absolute w-full h-[744px] left-1/2 -translate-x-1/2 bg-[rgba(20,_9,_14,_0.70)]"></div>
                  <div className="relative flex items-center justify-between w-full px-6">
                    <p className="text-14">
                      {item.Hero_section_project.Location}
                    </p>
                    <h3 className="absolute left-1/2 transform -translate-x-1/2 text-28 max-w-[185px] text-center">
                      {item.Hero_section_project.Title}
                    </h3>
                    <p className="text-14">{item.Hero_section_project.Year}</p>
                  </div>

                  <Image
                    alt="map"
                    width={249}
                    height={256}
                    quality={100}
                    src={"/icons/mask/maps/1.svg"}
                    className="mix-blend-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 md:group-hover:opacity-100 md:transition-opacity delay-350 md:duration-400"
                  />
                </NavLink>
              </div>
              <div className="lg:hidden flex flex-col gap-5">
                <div>
                  <Image
                    src={
                      item?.Hero_section_project?.Photo?.url
                        ? `${ASSET_URL}${item?.Hero_section_project?.Photo?.url}`
                        : "/images/portfolio/1.jpg"
                    }
                    width={720}
                    height={524}
                    alt={
                      item.Hero_section_project.Title || "Project teaser still"
                    }
                    className="h-full w-full object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="">
                  <div className="flex justify-between items-end pr-[25px]">
                    <h3 className="text-24 max-w-[40%]">
                      {item.Hero_section_project.Title}
                    </h3>
                    <div className="text-14 pl-4 border-l border-brownDark flex flex-col gap-4 ">
                      <p className="max-w-[90px]">
                        {item.Hero_section_project.Location}
                      </p>
                      <NavLink
                        className="underline underline-offset-4"
                        href={`/projects/${item.Hero_section_project.Slug}`}
                        preload={
                          item?.Hero_section_project?.Photo?.url
                            ? `${ASSET_URL}${item.Hero_section_project.Photo.url}`
                            : undefined
                        }
                      >
                        Explore Project
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink
                href={`/projects/${item.Hero_section_project.Slug}`}
                preload={
                  item?.Hero_section_project?.Photo?.url
                    ? `${ASSET_URL}${item.Hero_section_project.Photo.url}`
                    : undefined
                }
                className="absolute inset-0 z-10"
              ></NavLink>
            </li>
          ))}
        </ul>
        <div
          ref={ctaBottom}
          className="opacity-0 mt-[-148px] pb-[440px] h-[148px] max-w-[280px] mx-auto flex flex-col items-center gap-12 max-lg:hidden"
        >
          <p className="text-14 text-center">{pageData?.Description}</p>
          <ButtonLink tag="a" text={"all projects"} href="/projects" />
        </div>
      </div>
      <div
        ref={ctaRef}
        className="sticky bottom-0 opacity-0 z-10 mx-auto flex flex-col items-center gap-12 h-screen bg-dark lg:hidden justify-center"
      >
        <p className="text-14 text-center max-w-[310px]">
          {pageData?.Description}
        </p>
        <ButtonLink tag="a" text={"all projects"} href="/projects" />
      </div>
    </section>
  );
};
export default HomePortfolio;
