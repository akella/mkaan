"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
import AnimatedTitleUp from "../ui/AnimatedTitleUp";
import AnimatedImage from "../ui/AnimatedImage";
import SliderNavButton from "../ui/SliderNavButton";
import useMediaQuery from "@/hooks/useMatchMedia";
import { div } from "three/src/nodes/math/OperatorNode";
const AboutCornerstones = ({ data = mockData }) => {
  const firstScreen = useRef(null);
  const decorRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageTrackRef = useRef(null);
  const topLineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const slides = useMemo(
    () =>
      data.Slider_Cornerstones && data.Slider_Cornerstones.length
        ? data.Slider_Cornerstones
        : mockData,
    [data],
  );
  const isPrevDisabled = activeIndex <= 0;
  const isNextDisabled = slides.length <= 1 || activeIndex >= slides.length - 1;

  const goTo = (dir) => {
    if (!slides.length) return;
    setSlideDirection(dir > 0 ? -1 : 1);
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0 || next > slides.length - 1) {
        return prev;
      }
      return next;
    });
  };

  useEffect(() => {
    const trackEl = imageTrackRef.current;

    if (!trackEl) {
      return;
    }

    gsap.killTweensOf(trackEl);
    gsap.to(trackEl, {
      duration: 1.4,
      xPercent: -activeIndex * 100,
      ease: "power3.inOut",
    });
  }, [activeIndex, isMobile]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: firstScreen.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinSpacing: false,
        pinSpacer: false,
      },
    });
    const earlyTl = gsap.timeline({
      scrollTrigger: {
        trigger: firstScreen.current,
        start: "top top",
        end: "80% center",
        scrub: 3,
        // markers: true,
      },
    });

    earlyTl.to(decorRef.current, { top: "-47%", ease: "none" }, 0);
    if (topLineRef.current) {
      earlyTl.to(
        topLineRef.current,
        { opacity: 1, delay: 0.5, ease: "none" },
        0,
      );
    }
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText);
      if (!titleRef.current || !subtitleRef.current || !descriptionRef.current)
        return;

      const splitTitleLines = new SplitText(titleRef.current, {
        type: "lines",
      });
      const splitTitleChars = new SplitText(splitTitleLines.lines, {
        type: "chars",
      });
      const splitSubtitleChars = new SplitText(subtitleRef.current, {
        type: "chars",
      });
      const splitDescriptionWords = new SplitText(descriptionRef.current, {
        type: "words",
        wordsClass: "desc-word",
      });

      if (splitDescriptionWords.words[0]) {
        splitDescriptionWords.words[0].classList.add("desc-word-first");
      }
      gsap.set(splitTitleChars.chars, { yPercent: 100, opacity: 0 });
      gsap.set(splitSubtitleChars.chars, { yPercent: 100, opacity: 0 });
      gsap.set(splitDescriptionWords.words, { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline();
      tl.to(
        splitTitleChars.chars,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.01,
          duration: 0.65,
          ease: "power2.out",
        },
        0,
      );
      tl.to(
        splitSubtitleChars.chars,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.01,
          duration: 0.55,
          ease: "power2.out",
        },
        0.05,
      );
      tl.to(
        splitDescriptionWords.words,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.015,
          duration: 0.6,
          ease: "power2.out",
        },
        0.1,
      );

      return () => {
        tl.kill();
        splitTitleChars.revert();
        splitTitleLines.revert();
        splitSubtitleChars.revert();
        splitDescriptionWords.revert();
      };
    },
    { dependencies: [activeIndex, slides], revertOnUpdate: true },
  );
  return (
    <section className="relative max-md:overflow-x-clip">
      <div
        ref={firstScreen}
        className="h-screen flex justify-center items-center"
      >
        <AnimatedTitleUp
          tag="h2"
          className="title-h1 max-w-[450px] max-md:max-w-[280px] text-center"
        >
          The Four Cornerstones
        </AnimatedTitleUp>
      </div>
      {isMobile ? (
        <div className="relative z-10 h-screen flex items-start justify-center">
          <div className="relative z-10 flex flex-col items-center md:min-h-[718px] min-h-[822px] justify-start">
            <div className="flex flex-col items-center max-w-[250px] md:min-h-[150px]">
              <div className="flex items-center gap-[7px] text-11 opacity-40 max-md:hidden">
                <p>{activeIndex + 1}</p>
                <p>-</p>
                <p>{slides.length}</p>
              </div>
              <h3 ref={titleRef} className="title-h2 mt-6">
                {slides[activeIndex]?.Title}
              </h3>
              <p ref={subtitleRef} className="text-14 mt-4 text-center">
                {slides[activeIndex]?.Upper_description}
              </p>
            </div>
            <div className="flex flex-col max-md:items-center gap-[39px] max-md:gap-3 w-[670px] mt-12">
              <div className="md:ml-[70px] w-[240px] md:h-[314px] max-sm:h-[177px] max-sm:overflow-clip overflow-hidden">
                <div
                  ref={imageTrackRef}
                  className="flex h-full w-full"
                  style={{ willChange: "transform" }}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={`${slide?.Title || "about-slide"}-${index}`}
                      className="relative h-full w-full flex-shrink-0 overflow-clip"
                    >
                      <div
                        className={`h-full w-full ${
                          activeIndex === index ? "scale-x-100" : "scale-x-125"
                        } duration-1600 transition-all ${
                          slideDirection === -1 ? "origin-right" : "origin-left"
                        }`}
                      >
                        <AnimatedImage
                          rootClass="h-full relative"
                          end="bottom top"
                        >
                          <Image
                            src={
                              slide?.Media?.url
                                ? `${ASSET_URL}${slide.Media.url}`
                                : "/images/about-img-1.jpg"
                            }
                            alt={slide?.Media?.alternativeText || "about slide"}
                            fill
                            sizes="240px"
                            className="object-cover"
                            quality={100}
                            priority={index === 0}
                          />
                        </AnimatedImage>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:hidden w-px h-8 bg-brownDark"></div>
              <div className="max-w-[312px] max-md:max-w-[330px] md:ml-auto max-md:flex max-md:flex-col max-md:items-center gap-3">
                <p
                  ref={descriptionRef}
                  className="text-14 about-slider-text max-md:text-center text-14"
                >
                  {slides[activeIndex]?.Bottom_description}
                </p>
                <div className="md:hidden w-px h-[73px] bg-brownDark"></div>
                <div className="md:hidden flex items-center gap-4">
                  <SliderNavButton
                    onClick={() => goTo(-1)}
                    disabled={isPrevDisabled}
                    ariaLabel="Prev slide"
                    showFill={false}
                    className={`border-brownDark text-textWhite md:duration-400 ${
                      isPrevDisabled
                        ? ""
                        : "md:hover:bg-textWhite md:hover:text-dark"
                    }`}
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
                        fill="currentColor"
                      />
                    </svg>
                  </SliderNavButton>
                  <div className="flex items-center gap-1">
                    <p>{activeIndex + 1}</p>
                    <p>-</p>
                    <p>{slides.length}</p>
                  </div>
                  <SliderNavButton
                    onClick={() => goTo(1)}
                    disabled={isNextDisabled}
                    ariaLabel="Next slide"
                    showFill={false}
                    className={`border-brownDark text-textWhite md:duration-400 ${
                      isNextDisabled
                        ? ""
                        : "md:hover:bg-textWhite md:hover:text-dark"
                    }`}
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
                        fill="currentColor"
                      />
                    </svg>
                  </SliderNavButton>
                </div>
              </div>
            </div>
          </div>
          <div
            ref={decorRef}
            className="absolute !max-w-none !h-[167%] [@media(min-width:1795px)]:!h-[224%] [@media(min-width:2200px)]:!h-[292%] md:min-h-[1630px] max-sm:!h-[170%] [@media(max-width:1095px)]:!h-[180%]  !left-1/2 transform -translate-x-1/2 !w-[113%] !min-w-[1630px] [@media(max-width:900px)]:!min-w-[1330px]"
          >
            <Image src={"/icons/diamond.svg"} fill alt="decor" className="" />
            <SliderNavButton
              onClick={() => goTo(-1)}
              disabled={isPrevDisabled}
              ariaLabel="Prev slide"
              className={`absolute z-10 max-md:hidden left-[23%] top-[50%] -translate-y-1/2 border-brownDark text-textWhite ${
                isPrevDisabled
                  ? ""
                  : "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-dark"
              }`}
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
              onClick={() => goTo(1)}
              disabled={isNextDisabled}
              ariaLabel="Next slide"
              className={`absolute z-10 max-md:hidden right-[23%] top-[50%] -translate-y-1/2 border-brownDark text-textWhite ${
                isNextDisabled
                  ? ""
                  : "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-dark"
              }`}
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
          <div
            ref={topLineRef}
            className="opacity-0 absolute w-px h-[272px] max-md:h-[190px] bg-brownDark top-[-35%]"
          ></div>
          <div className="absolute w-px h-[100%] [@media(min-width:1420px)_and_(min-height:1000px)]:h-[80%] max-md:!h-[109px] [@media(max-width:1095px)]:h-[100%] bg-brownDark md:top-[230px] max-md:bottom-[-30%] left-[50%] transform -translate-x-1/2"></div>
        </div>
      ) : (
        <div className="relative z-10 h-screen flex items-start justify-center">
          <div className="relative z-10 flex w-full gap-6 items-center h-[97%] [@media(min-width:1024px)_and_(max-height:850px)]:!h-[105%] [@media(min-width:1800px)]:!h-[106%] [@media(min-width:2200px)]:!h-[135%]  justify-start">
            <div className="flex flex-col pt-24 pb-6 justify-between items-start w-[48%] ml-auto h-full [@media(min-width:1024px)_and_(max-height:720px)]:!gap-[230px]">
              <div className="max-w-[312px]">
                <div className="flex items-center gap-[7px] text-11 opacity-40 max-md:hidden">
                  <p>{activeIndex + 1}</p>
                  <p>-</p>
                  <p>{slides.length}</p>
                </div>
                <h3 ref={titleRef} className="title-h2 mt-6">
                  {slides[activeIndex]?.Title}
                </h3>
                <p ref={subtitleRef} className="text-14 mt-4">
                  {slides[activeIndex]?.Upper_description}
                </p>
              </div>
              <div className="">
                <div className="max-w-[312px] max-md:max-w-[330px] md:ml-auto max-md:flex max-md:flex-col max-md:items-center gap-3">
                  <p
                    ref={descriptionRef}
                    className="text-14 about-slider-text max-md:text-center text-14"
                  >
                    {slides[activeIndex]?.Bottom_description}
                  </p>
                </div>
                <div className="flex gap-4 mt-[115px] [@media(min-width:1024px)_and_(max-height:815px)]:!mt-16">
                  <SliderNavButton
                    onClick={() => goTo(-1)}
                    disabled={isPrevDisabled}
                    ariaLabel="Prev slide"
                    className={`max-md:hidden border-brownDark text-textWhite ${
                      isPrevDisabled
                        ? ""
                        : "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-dark"
                    }`}
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
                    onClick={() => goTo(1)}
                    disabled={isNextDisabled}
                    ariaLabel="Next slide"
                    className={`border-brownDark text-textWhite ${
                      isNextDisabled
                        ? ""
                        : "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-dark"
                    }`}
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
          </div>
          <div
            ref={decorRef}
            className="absolute !max-w-none !h-[167%] [@media(min-width:1795px)]:!h-[224%] [@media(min-width:2200px)]:!h-[292%] md:min-h-[1630px] max-sm:!h-[170%] [@media(max-width:1095px)]:!h-[180%]  !left-1/2 transform -translate-x-1/2 !w-[113%] !min-w-[1630px] [@media(max-width:900px)]:!min-w-[1330px]"
          >
            <div className="absolute w-full h-px bg-brownDark top-1/2 transform -translate-y-1/2 z-10"></div>
            <Image src={"/icons/diamond.svg"} fill alt="decor" className="" />
            <div className="about-slider-img w-1/2 overflow-hidden relative z-20">
              <div
                ref={imageTrackRef}
                className="flex h-full w-full"
                style={{ willChange: "transform" }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={`${slide?.Title || "about-slide"}-${index}`}
                    className="relative h-full w-full flex-shrink-0 overflow-clip"
                  >
                    <div
                      className={`h-full w-full ${
                        activeIndex === index ? "scale-x-100" : "scale-x-125"
                      } duration-1600 transition-all ${
                        slideDirection === -1 ? "origin-right" : "origin-left"
                      }`}
                    >
                      <AnimatedImage
                        rootClass="h-full relative"
                        end="bottom top"
                      >
                        <Image
                          src={
                            slide?.Media?.url
                              ? `${ASSET_URL}${slide.Media.url}`
                              : "/images/about-img-1.jpg"
                          }
                          alt={slide?.Media?.alternativeText || "about slide"}
                          fill
                          sizes="(max-width: 900px) 100vw, 50vw"
                          className="object-cover"
                          quality={100}
                          priority={index === 0}
                        />
                      </AnimatedImage>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutCornerstones;
