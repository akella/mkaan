"use client";

import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import parse, { domToReact } from "html-react-parser";
import "swiper/css";
import "swiper/css/effect-fade";

const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const renderWithoutSpans = (html) => {
  if (!html) return null;

  return parse(html, {
    replace: (domNode) => {
      if (domNode.type === "tag" && domNode.name === "span") {
        return <>{domToReact(domNode.children)}</>;
      }
    },
  });
};

const CaseHero = ({ data, features }) => {
  const prHeroRef = useRef(null);
  const swiperRef = useRef(null);
  const slides = Array.isArray(features) ? features : [];
  const totalSlides = slides.length;

  const [activeSlide, setActiveSlide] = useState(0);
  const [exitingSlide, setExitingSlide] = useState(null);
  const isPrevDisabled = activeSlide <= 0;
  const isNextDisabled = activeSlide >= totalSlides - 1;

  const activeSlideRef = useRef(0);
  const descriptionRefs = useRef([]);
  const titleRefs = useRef([]);
  const descriptionSplitInstances = useRef([]);
  const titleSplitInstances = useRef([]);
  const textTimeline = useRef(null);
  const hasPlayedInitialText = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
  }, []);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useLayoutEffect(() => {
    if (totalSlides === 0) return;

    descriptionRefs.current = descriptionRefs.current.slice(0, slides.length);
    titleRefs.current = titleRefs.current.slice(0, slides.length);

    descriptionSplitInstances.current.forEach(
      (instance) => instance && instance.revert(),
    );
    titleSplitInstances.current.forEach(
      (instance) => instance && instance.revert(),
    );

    descriptionSplitInstances.current = [];
    titleSplitInstances.current = [];

    const setupSplit = (node, index, splitStore) => {
      if (!node) return;

      const split = new SplitText(node, { type: "words,chars" });
      splitStore[index] = split;

      gsap.set(node, {
        perspective: 800,
        transformStyle: "preserve-3d",
      });

      gsap.set(split.words, {
        display: "inline-block",
        whiteSpace: "pre-wrap",
      });

      gsap.set(split.chars, {
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        opacity: index === activeSlideRef.current ? 1 : 0,
        rotationX: index === activeSlideRef.current ? 0 : 90,
        rotationY: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
      });
    };

    descriptionRefs.current.forEach((node, index) => {
      setupSplit(node, index, descriptionSplitInstances.current);
    });

    titleRefs.current.forEach((node, index) => {
      setupSplit(node, index, titleSplitInstances.current);
    });

    hasPlayedInitialText.current = false;

    return () => {
      descriptionSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      titleSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      descriptionSplitInstances.current = [];
      titleSplitInstances.current = [];
    };
  }, [slides, totalSlides]);

  useEffect(() => {
    if (textTimeline.current) {
      textTimeline.current.kill();
      textTimeline.current = null;
    }

    const previousDescription =
      typeof exitingSlide === "number"
        ? descriptionSplitInstances.current[exitingSlide]
        : null;
    const previousTitle =
      typeof exitingSlide === "number"
        ? titleSplitInstances.current[exitingSlide]
        : null;
    const currentDescription = descriptionSplitInstances.current[activeSlide];
    const currentTitle = titleSplitInstances.current[activeSlide];

    const hasExiting =
      typeof exitingSlide === "number" && exitingSlide !== activeSlide;
    const shouldAnimateInitial =
      !hasPlayedInitialText.current && (currentDescription || currentTitle);

    if (!hasExiting && !shouldAnimateInitial) return;

    const tl = gsap.timeline();
    textTimeline.current = tl;

    if (previousDescription && exitingSlide !== activeSlide) {
      tl.fromTo(
        previousDescription.chars,
        {
          opacity: 1,
          rotationX: 0,
        },
        {
          duration: 0.16,
          ease: "power1.in",
          opacity: 0,
          rotationX: -90,
          stagger: { each: 0.005, from: "start" },
          onComplete: () => {
            gsap.set(previousDescription.chars, {
              opacity: 0,
              rotationX: 90,
            });
          },
        },
        0,
      );
    }

    if (previousTitle && exitingSlide !== activeSlide) {
      tl.fromTo(
        previousTitle.chars,
        {
          opacity: 1,
          rotationX: 0,
        },
        {
          duration: 0.16,
          ease: "power1.in",
          opacity: 0,
          rotationX: -90,
          stagger: { each: 0.01, from: "start" },
          onComplete: () => {
            gsap.set(previousTitle.chars, {
              opacity: 0,
              rotationX: 90,
            });
          },
        },
        0,
      );
    }

    const enterAt = hasExiting ? 0.24 : 0;

    if (currentDescription) {
      tl.fromTo(
        currentDescription.chars,
        {
          opacity: 0,
          rotationX: 90,
        },
        {
          duration: 0.6,
          ease: "expo",
          opacity: 1,
          rotationX: 0,
          stagger: { each: 0.012, from: "start" },
        },
        enterAt,
      );
    }

    if (currentTitle) {
      tl.fromTo(
        currentTitle.chars,
        {
          opacity: 0,
          rotationX: 90,
        },
        {
          duration: 0.45,
          ease: "expo",
          opacity: 1,
          rotationX: 0,
          stagger: { each: 0.01, from: "start" },
        },
        enterAt + 0.08,
      );
    }

    hasPlayedInitialText.current = true;

    if (hasExiting) {
      tl.eventCallback("onComplete", () => {
        setExitingSlide(null);
      });
    }

    return () => {
      tl.kill();
      textTimeline.current = null;
    };
  }, [activeSlide, exitingSlide]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const nextSection = prHeroRef.current.nextElementSibling;

    gsap.set(nextSection, {
      marginTop: "-88px",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: prHeroRef.current,
        start: "bottom bottom",
        end: "+=80%",
        scrub: true,
        pin: true,
        pinSpacing: false,
        // pinSpacer: false,
        // markers: true,
      },
    });
    mm.add("(min-width: 768px)", () => {
      gsap.set(nextSection, {
        scaleX: 0.88,
      });

      tl.to(nextSection, {
        scaleX: 1,
        ease: "none",
        duration: 1,
      });
    });
  }, []);
  return (
    <section ref={prHeroRef} className="relative">
      <div className="h-screen max-md:h-dvh relative z-10 flex items-end [@media(min-width:1000px)]:items-center">
        <div className="flex flex-col items-start [@media(max-width:1000px)]:h-[60%] justify-between pb-6 pl-36 [@media(max-width:999px)]:pl-4 [@media(max-width:999px)]:pr-4 [@media(max-width:999px)]:w-full">
          <h1 className="title-h1 max-w-[400px]">{data?.Title}</h1>
          <div className="[@media(min-width:1000px)]:absolute [@media(min-width:1000px)]:bottom-6 [@media(max-width:999px)]:flex [@media(max-width:999px)]:w-full [@media(max-width:999px)]:items-end [@media(max-width:999px)]:justify-between">
            <div className="basis-1/2 pl-6 border-l border-l-brown flex flex-col gap-12 text-14 [@media(min-width:1000px)]:hidden">
              <p>{data?.Location}</p>
              <p>{data?.Year}</p>
            </div>
            <Link
              href="#hero-inner"
              className="relative group flex p-2.5 rounded-full border-brownDark border md:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-wine text-textWhite"
            >
              <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10 animated-arrow"
              >
                <path
                  d="M9.58464 4.16663V14.2323L4.75776 9.40538L4.16797 9.99996L10.0013 15.8333L15.8346 9.99996L15.2448 9.40538L10.418 14.2323V4.16663H9.58464Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div id="hero-inner" className="relative z-10 scroll-mt-12 w-full">
        <div className="grid grid-cols-2 max-md:grid-cols-1 md:gap-x-20 max-md:gap-16 items-start pl-[120px] max-md:pb-28 [@media(max-width:999px)]:pl-4 pr-36 [@media(max-width:999px)]:pr-4 [@media(max-width:999px)]:w-full max-md:pt-[88px] h-[60%]">
          <div className="flex flex-col gap-[204px]">
            <div className=" pl-6 border-l border-l-brown flex flex-col gap-12 text-14 [@media(max-width:999px)]:hidden">
              <p className="max-w-[150px]">{data?.Location}</p>
              <p>{data?.Year}</p>
            </div>
            {data.Awards_logos && (
              <div className="flex flex-wrap items-center gap-6">
                {data?.Awards_logos.map((logo, index) => (
                  <Image
                    key={index}
                    src={ASSET_URL + logo.Award.url}
                    alt="case logo"
                    width={logo?.Award?.width || 100}
                    height={logo?.Award?.height || 100}
                    quality={100}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="[@media(max-width:999px)]:!basis-full flex flex-col">
            <div className="max-w-[550px]">
              <p className="text-11 text-grayDark">about</p>
              <div className="text-20 !normal-case mt-6">
                {renderWithoutSpans(data?.About)}
              </div>
            </div>
            <div>
              <p className="text-11 opacity-40 pb-6 border-b border-brown mt-[120px] max-md:mt-20">
                Specification
              </p>
              <ul className="grid grid-cols-2 gap-y-6 gap-x-12 max-md:gap-x-4 lg:w-[75%]  mt-6">
                {data?.Specification_project.map((spec, index) => (
                  <li key={index} className="flex flex-col gap-2">
                    <p className="text-11 opacity-40">{spec.Title}</p>
                    <p className="text-14">{spec.Description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-[72px] max-md:mt-28">
              <div className="pb-6 border-b border-brown flex items-center justify-between text-11">
                <p className="opacity-40">key numbers</p>
                <div className="flex items-center gap-1 opacity-40">
                  <p>{String(activeSlide + 1).padStart(2, "0")}</p>
                  <p>-</p>
                  <p>{String(totalSlides).padStart(2, "0")}</p>
                </div>
              </div>
              <div className="relative mt-12 max-md:mt-10">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setActiveSlide(swiper.realIndex);
                  }}
                  onSlideChange={(swiper) => {
                    const nextSlide = swiper.realIndex;
                    if (nextSlide === activeSlideRef.current) return;
                    setExitingSlide(activeSlideRef.current);
                    setActiveSlide(nextSlide);
                  }}
                  className="mySwiper"
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  slidesPerView={1}
                  speed={450}
                  allowTouchMove={false}
                  modules={[EffectFade]}
                >
                  {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex flex-col gap-[58px] max-md:gap-10">
                        <p
                          ref={(el) => {
                            descriptionRefs.current[index] = el || null;
                          }}
                          className="text-big "
                        >
                          {slide.Description}
                        </p>
                        <p className="text-14">
                          —{" "}
                          <span
                            ref={(el) => {
                              titleRefs.current[index] = el || null;
                            }}
                          >
                            {slide.Title}
                          </span>
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute right-0 bottom-[-2%] flex gap-2">
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className={`relative group p-2.5 border border-brownDark rounded-full md:transition-all md:duration-400 md:hover:bg-textWhite md:hover:text-dark text-textWhite ${
                      isPrevDisabled ? "opacity-20 pointer-events-none" : ""
                    }`}
                    disabled={isPrevDisabled}
                    aria-disabled={isPrevDisabled}
                  >
                    <div className="absolute rounded-full inset-0 bg-textWhite transform scale-0 md:transition-transform md:duration-400 md:ease-[--ease-in] md:group-hover:scale-100"></div>

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
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className={`relative group p-2.5 border border-brownDark rounded-full md:transition-all md:duration-400 md:hover:bg-textWhite md:hover:text-dark text-textWhite ${
                      isNextDisabled ? "opacity-20 pointer-events-none" : ""
                    }`}
                    disabled={isNextDisabled}
                    aria-disabled={isNextDisabled}
                  >
                    <div className="absolute rounded-full inset-0 bg-textWhite transform scale-0 md:transition-transform md:duration-400 md:ease-[--ease-in] md:group-hover:scale-100"></div>
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={
          data?.Photo
            ? ASSET_URL + data.Photo.url
            : "/images/single-case-hero.jpg"
        }
        alt="project image"
        fill
        className="object-cover object-top !h-[200vh]"
        quality={100}
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.75)_0%,_rgba(20,_9,_14,_0.28)_100%)]"></div>
      <div className="absolute inset-0 bg-bgOverlay"></div>
    </section>
  );
};

export default CaseHero;
