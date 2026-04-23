"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import ButtonLink from "../ui/ButtonLink";
import NavLink from "../NavLink";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import AnimatedImage from "../ui/AnimatedImage";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const AUTOPLAY_DELAY = 7000;

gsap.registerPlugin(ScrollTrigger);

const CaseStatsSlider = ({ slides = [] }) => {
  const sliderData = useMemo(
    () =>
      Array.isArray(slides) && slides.length
        ? slides
        : [
            {
              Description: "--",
              Title: "Specification",
            },
          ],
    [slides],
  );

  const totalSlides = sliderData.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [sliderActive, setSliderActive] = useState(false);
  const sliderRef = useRef(null);
  const timerIndicatorRef = useRef(null);
  const timerTweenRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);
  const amountRefs = useRef([]);
  const labelRefs = useRef([]);
  const amountSplitInstances = useRef([]);
  const labelSplitInstances = useRef([]);
  const textTimelineRef = useRef(null);
  const hasPlayedInitial = useRef(false);

  const isDesktopSliderViewport = useCallback(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 901px)").matches;
  }, []);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    hasPlayedInitial.current = false;
  }, [sliderData]);

  useEffect(() => {
    return () => {
      clearAutoplay();
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
        timerTweenRef.current = null;
      }
    };
  }, [clearAutoplay]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setSliderActive(true);
      return undefined;
    }

    if (!isDesktopSliderViewport()) {
      setSliderActive(false);
      clearAutoplay();
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
        timerTweenRef.current = null;
      }
      return undefined;
    }

    if (!sliderRef.current) {
      setSliderActive(true);
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: sliderRef.current,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: () => setSliderActive(true),
      onEnterBack: () => setSliderActive(true),
      onLeave: () => {
        setSliderActive(false);
        clearAutoplay();
        if (timerTweenRef.current) {
          timerTweenRef.current.kill();
          timerTweenRef.current = null;
        }
        if (timerIndicatorRef.current) {
          gsap.set(timerIndicatorRef.current, { scaleY: 0 });
        }
      },
      onLeaveBack: () => {
        setSliderActive(false);
        clearAutoplay();
        if (timerTweenRef.current) {
          timerTweenRef.current.kill();
          timerTweenRef.current = null;
        }
        if (timerIndicatorRef.current) {
          gsap.set(timerIndicatorRef.current, { scaleY: 0 });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [clearAutoplay, isDesktopSliderViewport]);

  useEffect(() => {
    setActiveIndex(0);
    setExitingIndex(null);
  }, [totalSlides]);

  useLayoutEffect(() => {
    if (!isDesktopSliderViewport()) {
      return undefined;
    }

    if (!sliderRef.current || typeof window === "undefined") {
      return undefined;
    }

    let ctx = gsap.context(() => {
      gsap.registerPlugin(SplitText);

      amountSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      labelSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );

      amountSplitInstances.current = [];
      labelSplitInstances.current = [];

      amountRefs.current = amountRefs.current.slice(0, totalSlides);
      labelRefs.current = labelRefs.current.slice(0, totalSlides);

      sliderData.forEach((_, index) => {
        const amountEl = amountRefs.current[index];
        if (amountEl) {
          const split = new SplitText(amountEl, { type: "chars" });
          amountSplitInstances.current[index] = split;
          gsap.set(split.chars, {
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            opacity: index === activeIndex ? 1 : 0,
            rotationX: index === activeIndex ? 0 : 90,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
          });
        } else {
          amountSplitInstances.current[index] = null;
        }

        const labelEl = labelRefs.current[index];
        if (labelEl) {
          const split = new SplitText(labelEl, {
            type: "words,chars",
            wordsClass: "case-label-word",
            charsClass: "case-label-char",
          });
          labelSplitInstances.current[index] = split;

          gsap.set(labelEl, {
            perspective: 800,
            transformStyle: "preserve-3d",
          });

          gsap.set(split.words, {
            display: "inline-block",
            whiteSpace: "pre",
          });

          gsap.set(split.chars, {
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            opacity: index === activeIndex ? 1 : 0,
            rotationX: index === activeIndex ? 0 : 90,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
          });
        } else {
          labelSplitInstances.current[index] = null;
        }
      });
    }, sliderRef);

    return () => {
      amountSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      labelSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      amountSplitInstances.current = [];
      labelSplitInstances.current = [];
      ctx.revert();
    };
  }, [sliderData, totalSlides, isDesktopSliderViewport]);

  useEffect(() => {
    const hasSplits =
      amountSplitInstances.current.some(Boolean) ||
      labelSplitInstances.current.some(Boolean);

    if (!hasSplits) {
      return undefined;
    }

    const prevIndex = typeof exitingIndex === "number" ? exitingIndex : null;
    const prevAmountSplit =
      prevIndex !== null ? amountSplitInstances.current[prevIndex] : null;
    const prevLabelSplit =
      prevIndex !== null ? labelSplitInstances.current[prevIndex] : null;
    const currentAmountSplit = amountSplitInstances.current[activeIndex];
    const currentLabelSplit = labelSplitInstances.current[activeIndex];

    const hasExiting =
      typeof exitingIndex === "number" && exitingIndex !== activeIndex;
    const shouldAnimateInitial =
      !hasPlayedInitial.current && (currentAmountSplit || currentLabelSplit);

    if (!hasExiting && !shouldAnimateInitial) {
      return undefined;
    }

    if (textTimelineRef.current) {
      textTimelineRef.current.kill();
      textTimelineRef.current = null;
    }

    const tl = gsap.timeline();
    textTimelineRef.current = tl;

    if (prevAmountSplit && hasExiting) {
      tl.fromTo(
        prevAmountSplit.chars,
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.25,
          ease: "power1.in",
          opacity: 0,
          rotationX: -90,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          stagger: {
            each: 0.015,
            from: "start",
          },
          onComplete: () => {
            gsap.set(prevAmountSplit.chars, {
              opacity: 0,
              rotationX: 90,
              rotationY: 0,
              xPercent: 0,
              yPercent: 0,
              z: 0,
            });
          },
        },
        0,
      );
    }

    if (prevLabelSplit && hasExiting) {
      tl.fromTo(
        prevLabelSplit.chars,
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.15,
          ease: "power1.in",
          opacity: 0,
          rotationX: -90,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          stagger: {
            each: 0.015,
            from: "start",
          },
          onComplete: () => {
            gsap.set(prevLabelSplit.chars, {
              opacity: 0,
              rotationX: 90,
              rotationY: 0,
              xPercent: 0,
              yPercent: 0,
              z: 0,
            });
          },
        },
        0,
      );
    }

    const enterLabel = "caseStatsEnter";
    tl.addLabel(enterLabel, hasExiting ? "+=0.002" : 0);

    if (currentAmountSplit) {
      tl.fromTo(
        currentAmountSplit.chars,
        {
          opacity: 0,
          rotationX: 90,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.65,
          ease: "expo",
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          stagger: {
            each: 0.015,
            from: "start",
          },
        },
        enterLabel,
      );
    }

    if (currentLabelSplit) {
      tl.fromTo(
        currentLabelSplit.chars,
        {
          opacity: 0,
          rotationX: 90,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.15,
          ease: "expo",
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          stagger: {
            each: 0.015,
            from: "start",
          },
        },
        enterLabel,
      );
    }

    hasPlayedInitial.current = true;

    if (hasExiting) {
      tl.eventCallback("onComplete", () => {
        setExitingIndex(null);
      });
    } else {
      tl.eventCallback("onComplete", null);
    }

    return () => {
      tl.kill();
      textTimelineRef.current = null;
    };
  }, [activeIndex, exitingIndex]);

  useEffect(() => {
    if (!sliderActive || totalSlides <= 1 || activeIndex >= totalSlides - 1) {
      clearAutoplay();
      return undefined;
    }

    autoplayTimeoutRef.current = setTimeout(() => {
      setExitingIndex(activeIndex);
      setActiveIndex((prev) => Math.min(prev + 1, totalSlides - 1));
    }, AUTOPLAY_DELAY);

    return () => {
      clearAutoplay();
    };
  }, [activeIndex, sliderActive, totalSlides, clearAutoplay]);

  useEffect(() => {
    if (!timerIndicatorRef.current) {
      return undefined;
    }

    if (timerTweenRef.current) {
      timerTweenRef.current.kill();
      timerTweenRef.current = null;
    }

    if (!sliderActive || totalSlides <= 1) {
      gsap.set(timerIndicatorRef.current, { scaleY: 0 });
      return undefined;
    }

    if (activeIndex >= totalSlides - 1) {
      gsap.set(timerIndicatorRef.current, { scaleY: 1 });
      return undefined;
    }

    gsap.set(timerIndicatorRef.current, { scaleY: 0 });

    timerTweenRef.current = gsap.to(timerIndicatorRef.current, {
      scaleY: 1,
      duration: AUTOPLAY_DELAY / 1000,
      ease: "none",
    });

    return () => {
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
        timerTweenRef.current = null;
      }
    };
  }, [activeIndex, sliderActive, totalSlides]);

  const goToSlide = useCallback(
    (targetIndex) => {
      if (
        targetIndex < 0 ||
        targetIndex >= totalSlides ||
        targetIndex === activeIndex
      ) {
        return;
      }

      clearAutoplay();
      setExitingIndex(activeIndex);
      setActiveIndex(targetIndex);
    },
    [activeIndex, totalSlides, clearAutoplay],
  );

  const handlePrev = () => {
    goToSlide(activeIndex - 1);
  };

  const handleNext = () => {
    goToSlide(activeIndex + 1);
  };

  const isPrevDisabled = activeIndex <= 0;
  const isNextDisabled = totalSlides <= 1 || activeIndex >= totalSlides - 1;

  return (
    <div className="p-6 h-full bg-wine [@media(max-width:900px)]:hidden">
      <div ref={sliderRef} className="relative h-full">
        <div className="absolute w-px h-full bg-brownDark top-0">
          <div
            ref={timerIndicatorRef}
            className="absolute inset-0 origin-top bg-textWhite"
            style={{ transform: "scaleY(0)" }}
            aria-hidden="true"
          ></div>
        </div>
        <div className="flex flex-col justify-between h-full pl-6">
          <div className="text-11 opacity-40 flex items-center gap-[7px]">
            <p>{String(activeIndex + 1).padStart(2, "")}</p>
            <p>-</p>
            <p>{String(totalSlides).padStart(2, "")}</p>
          </div>
          <div className="relative min-h-[144px] mt-10 overflow-hidden">
            {sliderData.map((slide, index) => {
              const isCurrent = index === activeIndex;
              return (
                <p
                  key={`amount-${slide.Title}-${index}`}
                  ref={(el) => {
                    amountRefs.current[index] = el;
                  }}
                  className={`absolute inset-0 text-big  pointer-events-none ${
                    isCurrent ? "z-20" : "z-10"
                  }`}
                  aria-hidden={!isCurrent}
                >
                  {slide.Description}
                </p>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <div className="relative min-h-5 w-full">
              {sliderData.map((slide, index) => {
                const isCurrent = index === activeIndex;
                return (
                  <div
                    key={`label-${slide.Title}-${index}`}
                    className={`absolute inset-0 flex gap-1 items-center text-14 pointer-events-none ${
                      isCurrent ? "z-20" : "z-10"
                    }`}
                    aria-hidden={!isCurrent}
                  >
                    <p>—</p>
                    <p
                      ref={(el) => {
                        labelRefs.current[index] = el;
                      }}
                      className="case-label-text"
                    >
                      {slide.Title}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className={`relative group overflow-clip p-2.5 border border-brownDark rounded-full md:transition-all md:duration-400 md:hover:bg-textWhite md:hover:text-dark text-textWhite ${
                  isPrevDisabled
                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                aria-label="Prev slide"
                disabled={isPrevDisabled}
                aria-disabled={isPrevDisabled}
              >
                <div className="absolute rounded-full inset-0 bg-textWhite transform scale-0 md:transition-transform md:duration-400 md:ease-[var(--ease-in)] md:group-hover:scale-100"></div>
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
                type="button"
                onClick={handleNext}
                className={`relative group overflow-clip p-2.5 border border-brownDark rounded-full md:transition-all md:duration-400 md:hover:bg-textWhite md:hover:text-dark text-textWhite ${
                  isNextDisabled
                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                aria-label="Next slide"
                disabled={isNextDisabled}
                aria-disabled={isNextDisabled}
              >
                <div className="absolute rounded-full inset-0 bg-textWhite transform scale-0 md:transition-transform md:duration-400 md:ease-[var(--ease-in)] md:group-hover:scale-100"></div>
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
  );
};

const CaseList = ({ cases }) => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const casePanels = gsap.utils.toArray(".js-case-panel");

      gsap.set(casePanels, { willChange: "transform, opacity" });

      // gsap.set(innerRef.current, { yPercent: 20 });

      gsap.set(sectionRef.current, {
        paddingTop: 100,
        marginTop: "-88px",
        clipPath: "polygon(5% 0, 95% 0, 95% 100%, 5% 100%)",
        // scaleX: 0.88,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 70%",
          scrub: true,
          // markers: true,
        },
      });

      tl.to(sectionRef.current, {
        clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)",
        // scaleX: 1,
        ease: "none",
        duration: 1,
      });

      // gsap.to(sectionRef.current, {
      //   paddingTop: 24,
      //   ease: "none",
      //   clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)",
      //   // scaleX: 1,
      //   scrollTrigger: {
      //     trigger: sectionRef.current,
      //     start: "top 80%",
      //     end: "top center",
      //     scrub: true,
      //     // markers: true,
      //   },
      // });

      // gsap.to(innerRef.current, {
      //   yPercent: 0,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: sectionRef.current,
      //     start: "top 80%",
      //     end: "top center",
      //     scrub: true,
      //     // markers: true,
      //   },
      // });

      casePanels.forEach((panel, index) => {
        gsap.to(panel, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            scrub: true,
            start: "top 10%",
            end: "bottom top",
            pin: index !== casePanels.length - 1,
            pinSpacing: false,
            // anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            // markers: true,
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-dark p-6 max-md:p-4 overflow-clip"
    >
      <div ref={innerRef} className="flex flex-col gap-12 max-sm:gap-4">
        {cases.map((caseItem, index) => (
          <div
            key={index}
            className="grid grid-cols-3 [@media(max-width:900px)]:grid-cols-2 max-md:!grid-cols-1 bg-wine js-case-panel"
          >
            <div className="p-6 max-md:p-4 pr-12 flex flex-col justify-between bg-wine max-md:gap-16">
              <div className="flex flex-col gap-6 max-md:gap-4">
                <p className="text-11 opacity-40">
                  {caseItem.Hero_section_case.Title}
                </p>
                <h2 className="text-36 max-lg:!text-[32px]">
                  {caseItem.Hero_section_case.Short_description ||
                    "An Icon of Refined Coastal Living, Blending Global Hospitality with the Craft of Architectural Purity"}
                </h2>
              </div>
              <div>
                <ButtonLink
                  tag="a"
                  href={`/case-study/${caseItem.Hero_section_case.Slug}`}
                  text={"Explore Case"}
                  className={"flex w-fit mb-6"}
                />
                <div className="grid gap-4 max-md:gap-3 border-t border-brownDark pt-6 max-md:pt-4 text-14">
                  <div className="grid grid-cols-2 max-md:flex max-md:items-start max-md:gap-6">
                    <p className="opacity-40">L:</p>
                    <p className="max-w-[160px]">
                      {caseItem.Hero_section_case.Location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 max-md:flex max-md:items-start max-md:gap-6">
                    <p className="opacity-40">Y:</p>
                    <p>{caseItem.Hero_section_case.Year}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[552px] overflow-y-clip max-sm:h-[424px] max-sm:p-4">
              <AnimatedImage yEnd={0} end="bottom bottom" rootClass={"h-full"}>
                <Image
                  src={ASSET_URL + caseItem.Hero_section_case.Photo?.url}
                  width={432}
                  height={552}
                  alt={caseItem.Hero_section_case.Title}
                  className="w-full h-full object-cover object-center"
                  quality={100}
                />
              </AnimatedImage>

              <NavLink
                href={`/case-study/${caseItem.Hero_section_case.Slug}`}
                className="absolute inset-0"
              ></NavLink>
            </div>
            <CaseStatsSlider slides={caseItem.Key_numbers} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseList;
