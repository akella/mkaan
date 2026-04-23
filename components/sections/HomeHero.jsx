"use client";

import Image from "next/image";
import NavLink from "../NavLink";
import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import useMediaQuery from "@/hooks/useMatchMedia";
import AnimatedTitle from "../ui/AnimatedTitle";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
// import { CustomCursor } from "cursor-style";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);
}

const projects = [
  {
    title: "Alma Residence",
    image: "/images/own/3.jpg",
    link: "/",
    about: "Crafted Homes for the Few Who Understand",
  },
  {
    title: "Alma Residence",
    image: "/images/own/1.jpg",
    link: "/",
    about: "Homes for the Few Who Understand",
  },
  {
    title: "Dubai Residence",
    image: "/images/own/2.jpg",
    link: "/",
    about: "Homes for the Few Who",
  },
];

const HomeHero = ({
  mainPr,
  data = projects,
  title = "Crafted Homes for the Few Who Understand",
  titleClassName = "",
}) => {
  const safeData = mainPr?.length ? mainPr : projects;

  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!safeData.length) {
    return null;
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [hoveredPreviewIndex, setHoveredPreviewIndex] = useState(null);

  const titleRef = useRef(null);

  // const linkRef = useRef(null);
  // const indicatorRef = useRef(null);
  const collapseTweenRef = useRef(null);
  const timelineRef = useRef(null);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const topBlockRef = useRef(null);
  const gradientRef = useRef(null);
  const exploreBtn = useRef(null);
  const introTextRef = useRef(null);
  const exploreIdleTimelineRef = useRef(null);
  const isIntroHiddenRef = useRef(false);
  const slideDirectionRef = useRef(1);
  const mkaanLogo = useRef(null);
  const gradientRef2 = useRef(null);
  const pendingPreviewIndexRef = useRef(null);
  const previewRefs = useRef({});
  const [fadingPreviewIndex, setFadingPreviewIndex] = useState(null);

  const activeProject = safeData[activeIndex];

  // initial hero intro (runs once)
  useGSAP(() => {
    const header = document.querySelector("header");
    const logoParts = gsap.utils.toArray(".js-hero-logo-word");

    gsap.to(logoParts, {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.275,
      ease: "easeOut",
    });

    gsap.set(
      [
        gradientRef.current,
        mkaanLogo.current,
        introTextRef.current,
        gradientRef2.current,
        header,
      ],
      {
        autoAlpha: 0,
      },
    );

    gsap.to(
      [
        gradientRef.current,
        mkaanLogo.current,
        introTextRef.current,
        gradientRef2.current,
        header,
      ],
      {
        autoAlpha: 1,
        duration: 1.7,
        delay: 0.5,
        ease: "easeOut",
      },
    );

    CustomEase.create("easeOut", "0.76, 0, 0.24, 1");
  }, []);

  // title + link animation on slide change
  useGSAP(
    () => {
      if (!titleRef.current) {
        return;
      }

      const splitLines = new SplitText(titleRef.current, {
        type: "lines",
        linesClass: "home-hero-title-line-mask",
      });

      const splitWords = new SplitText(splitLines.lines, {
        type: "words",
        wordsClass: "home-hero-title-word",
      });

      const splitChars = new SplitText(splitWords.words, {
        type: "chars",
        charsClass: "home-hero-title-char",
      });

      gsap.set(titleRef.current, { autoAlpha: 1 });
      gsap.set(splitLines.lines, {
        display: "block",
        overflow: "hidden",
      });
      gsap.set(splitWords.words, {
        display: "inline-block",
        whiteSpace: "nowrap",
      });
      gsap.set(splitChars.chars, {
        display: "inline-block",
        yPercent: 110,
      });

      const tl = gsap.timeline();

      tl.to(splitChars.chars, {
        yPercent: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: {
          each: 0.012,
          from: "start",
        },
      });

      return () => {
        tl.kill();
        splitChars.revert();
        splitWords.revert();
        splitLines.revert();
      };
    },
    { dependencies: [activeIndex] },
  );

  const handlePreviewClick = (nextIndex) => {
    if (nextIndex === activeIndex || isAnimating) {
      return;
    }
    const dir = nextIndex > activeIndex ? -1 : 1;
    setSlideDirection(dir);
    slideDirectionRef.current = dir;

    pendingPreviewIndexRef.current = activeIndex;
    setFadingPreviewIndex(activeIndex);
    setIsAnimating(true);

    collapseTweenRef.current?.kill();

    // const indicatorEl = indicatorRef.current;
    // const indicatorDot = indicatorEl?.querySelector(".indicator-dot");

    // if (!indicatorEl) {
    //   setActiveIndex(nextIndex);
    //   return;
    // }

    const collapseTimeline = gsap.timeline({
      defaults: { ease: "easeOut" },
      onComplete: () => {
        setActiveIndex(nextIndex);
      },
    });

    // if (indicatorDot) {
    //   collapseTimeline.to(indicatorDot, {
    //     duration: 0.25,
    //     scale: 0,
    //     transformOrigin: "center center",
    //   });
    // }

    // collapseTimeline.to(indicatorEl, {
    //   duration: 0.5,
    //   scaleX: 0,
    //   autoAlpha: 0,
    //   transformOrigin: "center center",
    // });

    collapseTweenRef.current = collapseTimeline;
  };

  // useEffect(() => {
  //   if (!exploreBtn.current) {
  //     return;
  //   }
  //   const idleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

  //   idleTimeline.fromTo(
  //     exploreBtn.current,
  //     { autoAlpha: 1, yPercent: -10, duration: 3, ease: "easeOut" },
  //     {
  //       autoAlpha: 0,
  //       yPercent: 100,
  //       duration: 2,

  //       ease: "easeOut",
  //     },
  //   );

  //   exploreIdleTimelineRef.current = idleTimeline;

  //   return () => {
  //     exploreIdleTimelineRef.current?.kill();
  //     exploreIdleTimelineRef.current = null;
  //   };
  // }, []);

  useEffect(() => {
    // if (isMobile) {
    //   isIntroHiddenRef.current = false;
    //   exploreIdleTimelineRef.current?.restart(true);
    //   return undefined;
    // }

    const containerEl = topBlockRef.current;
    const paragraphEl = introTextRef.current;
    const buttonEl = exploreBtn.current;

    if (!containerEl || !paragraphEl || !buttonEl) {
      return undefined;
    }

    const splitInstance = new SplitText(paragraphEl, {
      type: "lines",
      linesClass: "home-hero-intro-line",
    });

    const maskSplitInstance = new SplitText(splitInstance.lines, {
      type: "lines",
      linesClass: "home-hero-intro-line-content",
    });

    const lineMasks = splitInstance.lines;
    const lineContents = maskSplitInstance.lines;

    gsap.set(lineMasks, { display: "block", overflow: "hidden" });
    gsap.set(lineContents, { display: "block" });

    const hideTimeline = gsap.timeline({ paused: true });
    const showTimeline = gsap.timeline({ paused: true });

    hideTimeline
      .to(
        lineContents,
        {
          yPercent: -110,
          // opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "easeOut",
        },
        0,
      )
      .to(
        buttonEl,
        {
          autoAlpha: 0,
          duration: 0.6,
          ease: "easeOut",
        },
        0,
      );

    showTimeline
      .to(
        lineContents,
        {
          yPercent: 0,
          stagger: 0.04,
          duration: 0.5,
          ease: "easeOut",
        },
        0,
      )
      .to(
        buttonEl,
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: "easeOut",
        },
        0,
      )
      .eventCallback("onComplete", () => {
        if (!isIntroHiddenRef.current) {
          exploreIdleTimelineRef.current?.restart(true);
        }
      });

    hideTimeline.eventCallback("onComplete", () => {
      exploreIdleTimelineRef.current?.pause();
    });

    const updateIntroVisibility = () => {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const rect = containerEl.getBoundingClientRect();

      const isInView = rect.top < viewportHeight && rect.bottom > 0;

      if (!isInView) {
        return;
      }

      const shouldHide = window.scrollY > 8;

      if (shouldHide && !isIntroHiddenRef.current) {
        isIntroHiddenRef.current = true;
        exploreIdleTimelineRef.current?.pause();
        showTimeline.pause();
        hideTimeline.restart();
      } else if (!shouldHide && isIntroHiddenRef.current) {
        isIntroHiddenRef.current = false;
        hideTimeline.pause();
        showTimeline.restart();
      }
    };

    if (typeof window !== "undefined") {
      updateIntroVisibility();
      window.addEventListener("scroll", updateIntroVisibility, {
        passive: true,
      });
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", updateIntroVisibility);
      }

      hideTimeline.kill();
      showTimeline.kill();
      maskSplitInstance.revert();
      splitInstance.revert();
    };
  }, [isMobile]);

  // const setIndicatorNode = useCallback((node) => {
  //   indicatorRef.current = node;
  // }, []);

  // useEffect(() => {
  //   const indicatorEl = indicatorRef.current;

  //   if (!indicatorEl) {
  //     setIsAnimating(false);
  //     return;
  //   }

  //   const indicatorDot = indicatorEl.querySelector(".indicator-dot");

  //   gsap.set(indicatorEl, {
  //     scaleX: 0,
  //     autoAlpha: 0,
  //     transformOrigin: "center center",
  //   });

  //   if (indicatorDot) {
  //     gsap.set(indicatorDot, { scale: 1 });
  //   }

  //   timelineRef.current?.kill();

  //   timelineRef.current = gsap.to(indicatorEl, {
  //     duration: 0.36,
  //     scaleX: 1,
  //     autoAlpha: 1,
  //     ease: "easeOut",
  //     onComplete: () => {
  //       timelineRef.current = null;
  //     },
  //   });
  // }, [activeIndex]);

  useEffect(() => {
    if (fadingPreviewIndex === null) {
      return;
    }

    let rafId = null;

    const animatePreview = (previewEl) => {
      gsap.killTweensOf(previewEl);
      gsap.fromTo(
        previewEl,
        { autoAlpha: 0 },
        {
          duration: 0.5,
          autoAlpha: 1,
          ease: "easeOut",
          onComplete: () => {
            if (pendingPreviewIndexRef.current === fadingPreviewIndex) {
              pendingPreviewIndexRef.current = null;
            }
            setFadingPreviewIndex(null);
          },
        },
      );
    };

    const ensurePreviewNode = () => {
      const previewEl = previewRefs.current[fadingPreviewIndex];

      if (!previewEl) {
        rafId = requestAnimationFrame(ensurePreviewNode);
        return;
      }

      animatePreview(previewEl);
      rafId = null;
    };

    ensurePreviewNode();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [fadingPreviewIndex]);

  useEffect(() => {
    const trackEl = trackRef.current;

    if (!trackEl) {
      setIsAnimating(false);
      return;
    }

    gsap.killTweensOf(trackEl);

    gsap.to(trackEl, {
      duration: 1.4,
      xPercent: -activeIndex * 100,
      ease: "power3.inOut",
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  }, [activeIndex]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const sectionEl = sectionRef.current;
      if (!sectionEl) {
        return;
      }

      const images = gsap.utils.toArray(".js-home-hero-parallax", sectionEl);
      if (!images.length) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.to(images, {
          yPercent: 28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.1,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(images, {
          yPercent: 24,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.1,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { dependencies: [safeData.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="h-[150vh] max-md:h-auto relative overflow-hidden flex flex-col justify-between"
    >
      {/* <CustomCursor type="one" size={0.3} bgColor="white" /> */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full w-full"
          style={{ willChange: "transform" }}
        >
          {safeData.map((project, index) => (
            <div
              key={`${project.Hero_section_project.Title}-${index}`}
              className="relative h-full w-full flex-shrink-0 overflow-clip"
            >
              <div className="js-home-hero-parallax absolute inset-0 -z-10 will-change-transform">
                <Image
                  src={`${ASSET_URL}${project.Hero_section_project.Photo?.url}`}
                  alt={`${project.Hero_section_project.Title} background`}
                  fill
                  priority={true}
                  sizes="100vw"
                  quality={100}
                  style={{
                    objectFit: "cover",
                  }}
                  className={`${activeIndex === index ? "scale-x-100" : "scale-x-125"} duration-1600 transition-all ${slideDirection === -1 ? "origin-right" : "origin-left"} `}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,9,14,0.52)] via-[rgba(20,9,14,0)] to-[rgba(20,9,14,0.52)] bg-[rgba(20,9,14,0.12)] pointer-events-none"
        ></div>

        <div
          ref={gradientRef2}
          className="absolute inset-0 bg-bgOverlay12"
        ></div>
      </div>

      <div
        ref={topBlockRef}
        className="h-screen max-md:h-dvh relative z-10 flex justify-between items-end p-6 max-md:p-4"
      >
        <p ref={introTextRef} className="max-w-[240px] text-14">
          To Own with Mkaan is to Embrace Timeless Design, Crafted with
          Precision and Made to Endure.
        </p>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[72px] max-md:gap-[69px] items-center max-md:h-[400px]">
          <Image
            width={33}
            height={22}
            src={"/icons/m-vector.svg"}
            alt="m icon"
            className="js-hero-logo-word opacity-0 transform -translate-y-2"
          />
          <Image
            width={27}
            height={22}
            src={"/icons/k-vector.svg"}
            alt="k icon"
            className="js-hero-logo-word opacity-0 transform -translate-y-2"
          />
          <Image
            width={33}
            height={33}
            src={"/icons/a-vector.svg"}
            alt="a icon"
            className="js-hero-logo-word opacity-0 transform -translate-y-2"
          />
          <Image
            width={30}
            height={22}
            src={"/icons/a-vector-2.svg"}
            alt="a icon"
            className="js-hero-logo-word opacity-0 transform -translate-y-2"
          />
          <Image
            width={29}
            height={22}
            src={"/icons/n-vector.svg"}
            alt="a icon"
            className="js-hero-logo-word opacity-0 transform -translate-y-2"
          />
        </div>
        {/* <Image
          ref={mkaanLogo}
          src={"/icons/mkaan.svg"}
          width={27}
          height={403}
          alt="mkaan logo"
          quality={100}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-md:h-[400px]"
        /> */}

        <Link
          href={"#next-hero-section"}
          ref={exploreBtn}
          className="p-2.5 rounded-full border-brownDark border scroll-down-btn "
        >
          <Image
            src={"/icons/arrow-downward.svg"}
            width={20}
            height={20}
            alt="arrow icon"
            className="animated-arrow"
            quality={100}
          />
        </Link>
      </div>
      <div
        id="next-hero-section"
        className="relative scroll-m-[50vh] z-10 flex max-md:flex-col-reverse max-md:gap-24 md:justify-between items-end max-md:items-start p-6 max-md:p-4 pl-[22px] max-md:h-screen"
      >
        <div className="flex gap-6 max-md:gap-4">
          <div className="flex gap-[10px]">
            {safeData.map((project, index) => {
              const isActive = index === activeIndex;

              // if (isActive) {
              //   return (
              //     <div
              //       key={`${project.Hero_section_project.Title}-indicator-${index}`}
              //       ref={setIndicatorNode}
              //       className="indicator-border border border-textWhite py-[25.5px] px-[46.5px] max-md:px-[21.5px] overflow-hidden flex items-center justify-center"
              //     >
              //       <div className="w-[3px] h-[3px] bg-textWhite rounded-full indicator-dot"></div>
              //     </div>
              //   );
              // }

              const anyHovered = hoveredPreviewIndex !== null;
              const isThisHovered =
                !isActive && hoveredPreviewIndex === index;
              const isSiblingHovered =
                !isActive && anyHovered && hoveredPreviewIndex !== index;

              const widthClass = isActive
                ? anyHovered
                  ? "w-[88px]"
                  : "w-24"
                : isThisHovered
                  ? "w-8"
                  : isSiblingHovered
                    ? "w-4"
                    : "w-5";

              return (
                <button
                  key={`${project.Hero_section_project.Title}-preview-${index}`}
                  type="button"
                  onClick={() => handlePreviewClick(index)}
                  onMouseEnter={
                    !isActive
                      ? () => setHoveredPreviewIndex(index)
                      : undefined
                  }
                  onMouseLeave={
                    !isActive
                      ? () => setHoveredPreviewIndex(null)
                      : undefined
                  }
                  ref={(node) => {
                    if (!node) {
                      delete previewRefs.current[index];
                      return;
                    }

                    previewRefs.current[index] = node;
                  }}
                  className={`group relative h-[64px] origin-center transition-all duration-400 cursor-pointer ${fadingPreviewIndex === index ? "opacity-0" : "opacity-100"}`}
                  aria-pressed={false}
                  aria-label={`Show ${project.Hero_section_project.Title}`}
                >
                  <Image
                    src={`${ASSET_URL}${project.Hero_section_project.Photo?.url}`}
                    alt={`${project.Hero_section_project.Title} preview`}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                    className={`${isActive ? "opacity-0 " : "opacity-100 delay-200"} absolute inset-0 !w-full !max-w-none transition-all duration-500`}
                    quality={100}
                  />
                  <div
                    key={`${project.Hero_section_project.Title}-indicator-${index}`}
                    className={`indicator-border border border-textWhite ${widthClass} transition-all duration-500 h-[64px] overflow-hidden flex items-center justify-center`}
                  >
                    <div
                      className={`${isActive ? "scale-100 " : "scale-0"} w-[3px] h-[3px] bg-textWhite rounded-full indicator-dot transition-all duration-500`}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="pl-6 max-md:pl-4 border-l border-textWhite text-14 flex flex-col justify-between">
            <p
              ref={titleRef}
              className="!leading-4 whitespace-pre-line opacity-0 max-w-[65%]"
            >
              {activeProject.Hero_section_project.Title}
            </p>
            <NavLink
              // ref={linkRef}
              className="group overflow-x-clip w-fit relative inline-block after:content-[''] after:absolute after:-bottom-[0.5px] after:left-0 after:right-0 after:origin-left after:h-[1px] after:bg-textWhite hover:after:-scale-x-0 hover:after:origin-right after:transition-transform after:duration-400 after:w-full"
              href={
                `projects/${activeProject?.Hero_section_project.Slug}` || "/"
              }
            >
              Explore Project
            </NavLink>
          </div>
        </div>
        <AnimatedTitle
          tag="h1"
          className={`title-h1 ${titleClassName} max-w-[640px] max-md:max-w-[85%] text-right max-md:text-left`}
        >
          {title}
        </AnimatedTitle>
      </div>
    </section>
  );
};
export default HomeHero;
