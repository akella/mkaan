"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Image from "next/image";

const awData = [
  {
    title: "International Awards",
    desc: "Recognized globally for excellence in architecture, design, and smart innovation.",
    number: "20+",
  },
  {
    title: "Awards International",
    desc: "Recognized globally for excellence in architecture",
    number: "10+",
  },
  {
    title: "Awards",
    desc: "Design, and smart innovation.",
    number: "30+",
  },
  {
    title: "International Awards",
    desc: "Recognized globally for excellence in architecture, design, and smart innovation.",
    number: "20+",
  },
  {
    title: "Awards International",
    desc: "Recognized globally for excellence in architecture",
    number: "10+",
  },
  {
    title: "Awards",
    desc: "Design, and smart innovation.",
    number: "30+",
  },
];

const getSlides = (data) => {
  if (Array.isArray(data.Awards_slider) && data.Awards_slider.length > 0) {
    return data.Awards_slider;
  }

  return awData;
};

const AboutAwards = ({ data = awData }) => {
  const slides = useMemo(() => getSlides(data), [data]);
  const totalSlides = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);

  const sectionRef = useRef(null);
  const slideRef = useRef(null);
  const awardsWrap = useRef(null);

  const titleDesktopRefs = useRef([]);
  const titleMobileRefs = useRef([]);
  const titleDesktopSplitInstances = useRef([]);
  const titleMobileSplitInstances = useRef([]);
  const titleTimeline = useRef(null);
  const hasPlayedInitialTitle = useRef(false);

  const descRefs = useRef([]);
  const descSplitInstances = useRef([]);
  const descTimeline = useRef(null);
  const hasPlayedInitialDesc = useRef(false);

  const numberRef = useRef(null);
  const numberTimeline = useRef(null);
  const numberSplitInstance = useRef(null);
  const timerIndicatorRef = useRef(null);
  const timerTweenRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);
  const [sliderActive, setSliderActive] = useState(false);
  const AUTOPLAY_DELAY = 7000;

  const clearAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1 || activeIndex <= 0) return;
    clearAutoplay();
    setExitingIndex(activeIndex);
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, [activeIndex, totalSlides, clearAutoplay]);

  const handleNext = useCallback(() => {
    if (totalSlides <= 1 || activeIndex >= totalSlides - 1) return;
    clearAutoplay();
    setExitingIndex(activeIndex);
    setActiveIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [activeIndex, totalSlides, clearAutoplay]);

  const progress = totalSlides > 0 ? (activeIndex + 1) / totalSlides : 0;
  const hasPrevSlide = activeIndex > 0;
  const hasNextSlide = activeIndex < totalSlides - 1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
  }, []);

  useEffect(() => {
    return () => {
      clearAutoplay();
    };
  }, [clearAutoplay]);

  useEffect(() => {
    setActiveIndex(0);
    setExitingIndex(null);
    hasPlayedInitialTitle.current = false;
    hasPlayedInitialDesc.current = false;
  }, [totalSlides]);

  useEffect(() => {
    if (!sliderActive || totalSlides <= 1 || activeIndex >= totalSlides - 1) {
      clearAutoplay();
      return undefined;
    }

    clearAutoplay();
    autoplayTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, AUTOPLAY_DELAY);

    return () => {
      clearAutoplay();
    };
  }, [
    sliderActive,
    totalSlides,
    activeIndex,
    AUTOPLAY_DELAY,
    handleNext,
    clearAutoplay,
  ]);

  useLayoutEffect(() => {
    if (totalSlides === 0) return;

    titleDesktopRefs.current = titleDesktopRefs.current.slice(0, slides.length);
    titleMobileRefs.current = titleMobileRefs.current.slice(0, slides.length);
    descRefs.current = descRefs.current.slice(0, slides.length);

    titleDesktopSplitInstances.current.forEach(
      (instance) => instance && instance.revert(),
    );
    titleMobileSplitInstances.current.forEach(
      (instance) => instance && instance.revert(),
    );
    descSplitInstances.current.forEach(
      (instance) => instance && instance.revert(),
    );
    if (numberSplitInstance.current) {
      numberSplitInstance.current.revert();
      numberSplitInstance.current = null;
    }

    titleDesktopSplitInstances.current = [];
    titleMobileSplitInstances.current = [];
    descSplitInstances.current = [];

    const setupTitleSplit = (node, index, splitStore) => {
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
        opacity: index === activeIndex ? 1 : 0,
        rotationX: index === activeIndex ? 0 : 90,
        rotationY: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
      });
    };

    titleDesktopRefs.current.forEach((title, index) => {
      setupTitleSplit(title, index, titleDesktopSplitInstances.current);
    });

    titleMobileRefs.current.forEach((title, index) => {
      setupTitleSplit(title, index, titleMobileSplitInstances.current);
    });

    descRefs.current.forEach((desc, index) => {
      if (!desc) return;

      const split = new SplitText(desc, { type: "words,chars" });
      descSplitInstances.current[index] = split;

      gsap.set(desc, {
        perspective: 800,
        transformStyle: "preserve-3d",
      });

      gsap.set(split.words, {
        display: "inline-block",
        whiteSpace: "pre-wrap",
      });

      gsap.set(split.chars, {
        willChange: "transform, opacity",
        opacity: index === activeIndex ? 1 : 0,
        rotationX: index === activeIndex ? 0 : 90,
        rotationY: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
      });
    });

    hasPlayedInitialTitle.current = false;
    hasPlayedInitialDesc.current = false;

    return () => {
      titleDesktopSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      titleMobileSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      descSplitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      titleDesktopSplitInstances.current = [];
      titleMobileSplitInstances.current = [];
      descSplitInstances.current = [];
      if (numberSplitInstance.current) {
        numberSplitInstance.current.revert();
        numberSplitInstance.current = null;
      }
    };
  }, [slides, totalSlides]);

  useLayoutEffect(() => {
    if (!numberRef.current) return;

    if (numberSplitInstance.current) {
      numberSplitInstance.current.revert();
      numberSplitInstance.current = null;
    }

    numberRef.current.textContent = slides[activeIndex]?.Title_left || "";

    const split = new SplitText(numberRef.current, {
      type: "chars",
      charsClass: "number-char",
    });
    numberSplitInstance.current = split;

    gsap.set(numberRef.current, {
      perspective: 800,
      transformStyle: "preserve-3d",
    });

    gsap.set(split.chars, {
      transformOrigin: "50% 100%",
      transformStyle: "preserve-3d",
      willChange: "transform, opacity",
      opacity: 0,
      rotationX: 90,
      rotationY: 0,
      xPercent: 0,
      yPercent: 0,
      z: 0,
    });
  }, [activeIndex, slides]);

  useEffect(() => {
    const titleSplitGroups = [
      titleDesktopSplitInstances.current,
      titleMobileSplitInstances.current,
    ];
    if (!titleSplitGroups.some((group) => group.length)) return;

    if (titleTimeline.current) {
      titleTimeline.current.kill();
      titleTimeline.current = null;
    }

    const hasExiting =
      typeof exitingIndex === "number" && exitingIndex !== activeIndex;
    const shouldAnimateInitial =
      !hasPlayedInitialTitle.current &&
      titleSplitGroups.some((group) => !!group[activeIndex]);

    if (!hasExiting && !shouldAnimateInitial) return;

    const tl = gsap.timeline();
    titleTimeline.current = tl;
    const enterStart = hasExiting ? 0.26 : 0;

    titleSplitGroups.forEach((group) => {
      const previousSplit =
        typeof exitingIndex === "number" ? group[exitingIndex] : null;
      const currentSplit = group[activeIndex];

      if (previousSplit && exitingIndex !== activeIndex) {
        tl.fromTo(
          previousSplit.chars,
          {
            opacity: 1,
            rotationX: 0,
          },
          {
            duration: 0.16,
            ease: "power1.in",
            opacity: 0,
            rotationX: -90,
            stagger: { each: 0.012, from: "start" },
            onComplete: () => {
              gsap.set(previousSplit.chars, {
                opacity: 0,
                rotationX: 90,
              });
            },
          },
          0,
        );
      }

      if (currentSplit) {
        tl.fromTo(
          currentSplit.chars,
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
          enterStart,
        );
      }
    });

    hasPlayedInitialTitle.current = true;

    if (hasExiting) {
      tl.eventCallback("onComplete", () => {
        setExitingIndex(null);
      });
    } else {
      tl.eventCallback("onComplete", null);
    }

    return () => {
      tl.kill();
      titleTimeline.current = null;
    };
  }, [activeIndex, exitingIndex]);

  useEffect(() => {
    if (!descSplitInstances.current.length) return;

    if (descTimeline.current) {
      descTimeline.current.kill();
      descTimeline.current = null;
    }

    const previousSplit =
      typeof exitingIndex === "number"
        ? descSplitInstances.current[exitingIndex]
        : null;
    const currentSplit = descSplitInstances.current[activeIndex];

    const hasExiting =
      typeof exitingIndex === "number" && exitingIndex !== activeIndex;
    const shouldAnimateInitial =
      !hasPlayedInitialDesc.current && !!currentSplit;

    if (!hasExiting && !shouldAnimateInitial) return;

    const tl = gsap.timeline();
    descTimeline.current = tl;

    if (previousSplit && exitingIndex !== activeIndex) {
      tl.fromTo(
        previousSplit.chars,
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
            gsap.set(previousSplit.chars, {
              opacity: 0,
              rotationX: 90,
            });
          },
        },
        0,
      );
    }

    if (currentSplit) {
      tl.fromTo(
        currentSplit.chars,
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
        previousSplit && exitingIndex !== activeIndex ? "+=0.1" : 0,
      );
    }

    hasPlayedInitialDesc.current = true;

    return () => {
      tl.kill();
      descTimeline.current = null;
    };
  }, [activeIndex]);

  useEffect(() => {
    const indicatorEl = timerIndicatorRef.current;
    if (!indicatorEl) {
      return undefined;
    }

    if (timerTweenRef.current) {
      timerTweenRef.current.kill();
      timerTweenRef.current = null;
    }

    if (!sliderActive || totalSlides <= 1) {
      gsap.set(indicatorEl, { scaleY: 0 });
      return undefined;
    }

    gsap.set(indicatorEl, { scaleY: 0 });
    timerTweenRef.current = gsap.to(indicatorEl, {
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
  }, [sliderActive, activeIndex, totalSlides, AUTOPLAY_DELAY]);

  useEffect(() => {
    if (!numberRef.current) return;

    if (numberTimeline.current) {
      numberTimeline.current.kill();
      numberTimeline.current = null;
    }

    const split = numberSplitInstance.current;
    if (!split || !split.chars?.length) return;

    const tl = gsap.timeline();
    numberTimeline.current = tl;

    tl.fromTo(
      split.chars,
      { opacity: 0, rotationX: 90 },
      {
        opacity: 1,
        rotationX: 0,
        duration: 0.95,
        ease: "expo",
        stagger: { each: 0.1, from: "start" },
      },
    );

    return () => {
      tl.kill();
      numberTimeline.current = null;
    };
  }, [activeIndex]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    const slideEl = slideRef.current;
    if (!sectionEl || !slideEl) return;

    const stripsCount = 40;
    const overlapPercent = 0.12;
    slideEl.innerHTML = "";

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("awards-img-container");

    for (let i = 0; i < stripsCount; i++) {
      const strip = document.createElement("div");
      strip.classList.add("awards-strip");

      const img = document.createElement("img");
      img.src = "/images/about/awards.jpg";
      img.alt = "Awards";

      const stripPositionFromBottom = stripsCount - i - 1;
      const stripLowerBound =
        (stripPositionFromBottom + 1) * (100 / stripsCount);
      const stripUpperBound = stripPositionFromBottom * (100 / stripsCount);

      const expandedUpperBound = Math.max(0, stripUpperBound - overlapPercent);
      const expandedLowerBound = Math.min(
        100,
        stripLowerBound + overlapPercent,
      );

      const closedPath = `polygon(0% ${expandedLowerBound}%, 100% ${expandedLowerBound}%, 100% ${expandedLowerBound}%, 0% ${expandedLowerBound}%)`;
      const openPath = `polygon(0% ${expandedLowerBound}%, 100% ${expandedLowerBound}%, 100% ${expandedUpperBound}%, 0% ${expandedUpperBound}%)`;

      strip.style.clipPath = closedPath;
      strip.dataset.openPath = openPath;

      strip.appendChild(img);
      imgContainer.appendChild(strip);
    }

    slideEl.appendChild(imgContainer);

    const strips = imgContainer.querySelectorAll(".awards-strip");

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionEl,
          start: "-20% top",
          end: "center 50%",
          scrub: true,
        },
      })
      .to(strips, {
        clipPath: (_, target) => target.dataset.openPath || "",
        duration: 1.2,
        stagger: { each: 0.04, from: "start" },
      });

    const sliderActivationTrigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        setSliderActive(true);
        setActiveIndex(0);
      },
      onEnterBack: () => setSliderActive(true),
      onLeave: () => setSliderActive(false),
      onLeaveBack: () => setSliderActive(false),
    });

    gsap.to(awardsWrap.current, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl,
        start: "center center",
        end: "bottom 20%",
        scrub: true,
        // markers: true,
      },
    });

    return () => {
      sliderActivationTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] overflow-hidden flex items-end"
    >
      <div
        ref={slideRef}
        className="awards-slide absolute inset-0 h-[92%] w-[calc(100%-48px)] max-md:w-[calc(100%-32px)] mx-auto"
      />
      <div
        ref={awardsWrap}
        className="relative z-10 w-[59%] max-lg:w-[70%] max-md:w-full flex max-md:mb-[250px] transform -translate-y-[20%]"
      >
        <div className="bg-textWhite pl-[120px] max-lg:pl-[60px] max-md:pl-4 py-6 max-md:py-4 w-[57.1%] max-md:w-[85%]">
          <div className="pl-6 relative max-md:h-full">
            <div className="absolute left-0 w-px h-full bg-beige/40 overflow-hidden">
              <div
                ref={timerIndicatorRef}
                className="absolute inset-0 bg-dark origin-top"
                style={{ transform: "scaleY(0)" }}
              ></div>
            </div>
            <div className="text-14 flex items-center gap-1.5 text-dark">
              <p>{String(activeIndex + 1).padStart(2)}</p>
              <p>-</p>
              <p>{String(totalSlides).padStart(2)}</p>
            </div>
            <p
              ref={numberRef}
              className="flex items-start text-160 max-sm:!leading-[72px] text-dark mt-[244px] mb-[224px] max-md:mt-[128px] max-md:mb-[164px]"
            >
              {slides[activeIndex]?.Title_left || ""}
            </p>

            <div className="flex gap-2.5 max-md:hidden">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrevSlide}
                className={`group relative p-2.5 border border-beige rounded-full text-dark md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                  hasPrevSlide
                    ? "md:hover:duration-500 md:hover:ease-[var(--ease-in)] md:hover:text-textWhite"
                    : "opacity-70 !cursor-auto"
                }`}
                aria-label="Previous slide"
              >
                <div
                  className={`absolute inset-0 rounded-full bg-wine transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                    hasPrevSlide
                      ? "md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"
                      : ""
                  }`}
                ></div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="relative z-10"
                >
                  <path
                    d="M5.76901 10.4165L10.5959 15.2434L10.0013 15.8332L4.16797 9.99984L10.0013 4.1665L10.5959 4.7563L5.76901 9.58317H15.8346V10.4165H5.76901Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNextSlide}
                className={`group relative p-2.5 border border-beige rounded-full text-dark md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                  hasNextSlide
                    ? "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-textWhite"
                    : "opacity-70 !cursor-auto"
                }`}
                aria-label="Next slide"
              >
                <div
                  className={`absolute inset-0 rounded-full bg-wine transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                    hasNextSlide
                      ? "md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"
                      : ""
                  }`}
                ></div>
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
          {slides.map(({ Title_right, Description }, index) => {
            const isCurrent = index === activeIndex;
            return (
              <div
                key={`${Title_right}-${index}`}
                className={`absolute inset-0 bottom-4 left-8 flex flex-col justify-end max-md:gap-[40px] md:hidden pr-3 ${
                  isCurrent || index === exitingIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                } ${isCurrent ? "z-20" : "z-10 pointer-events-none"}`}
                aria-hidden={!isCurrent}
              >
                <h3 className="text-36 text-dark max-w-[160px]">
                  <span
                    ref={(el) => {
                      titleMobileRefs.current[index] = el || null;
                    }}
                  >
                    {Title_right}
                  </span>
                </h3>
              </div>
            );
          })}
        </div>
        <div className="relative w-[42.9%] p-6 flex flex-col justify-end max-md:absolute max-md:-z-10 max-md:w-[92%] max-md:top-[55%] max-md:left-[16px] max-md:min-h-[400px]">
          <div className="relative z-10 flex flex-col gap-[232px] max-md:gap-[40px] pr-3 h-full">
            {slides.map(({ Title_right, Description }, index) => {
              const isCurrent = index === activeIndex;
              return (
                <div
                  key={`${Title_right}-${index}`}
                  className={`absolute inset-0 flex flex-col justify-end gap-[232px] max-md:gap-[40px] pr-3 ${
                    isCurrent || index === exitingIndex
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  } ${isCurrent ? "z-20" : "z-10 pointer-events-none"}`}
                  aria-hidden={!isCurrent}
                >
                  <h3 className="text-36 max-md:hidden">
                    <span
                      ref={(el) => {
                        titleDesktopRefs.current[index] = el || null;
                      }}
                    >
                      {Title_right}
                    </span>
                  </h3>
                  <p
                    ref={(el) => {
                      descRefs.current[index] = el || null;
                    }}
                    className="text-14 max-w-[92%]"
                  >
                    {Description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="relative z-10 flex gap-2.5 md:hidden mt-[72px]">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!hasPrevSlide}
              className={`group relative p-2.5 border border-brownDark rounded-full text-textWhite md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                hasPrevSlide
                  ? "md:hover:duration-500 md:hover:ease-[var(--ease-in)] md:hover:text-textWhite"
                  : "opacity-70 !cursor-auto"
              }`}
              aria-label="Previous slide"
            >
              <div
                className={`absolute inset-0 rounded-full bg-wine transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                  hasPrevSlide
                    ? "md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"
                    : ""
                }`}
              ></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M5.76901 10.4165L10.5959 15.2434L10.0013 15.8332L4.16797 9.99984L10.0013 4.1665L10.5959 4.7563L5.76901 9.58317H15.8346V10.4165H5.76901Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasNextSlide}
              className={`group relative p-2.5 border border-brownDark rounded-full text-textWhite md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                hasNextSlide
                  ? "md:hover:ease-[var(--ease-in)] md:hover:duration-500 md:hover:text-textWhite"
                  : "opacity-70 !cursor-auto"
              }`}
              aria-label="Next slide"
            >
              <div
                className={`absolute inset-0 rounded-full bg-wine transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] ${
                  hasNextSlide
                    ? "md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"
                    : ""
                }`}
              ></div>
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
          <Image
            src={"/icons/mask/6.svg"}
            fill
            alt="decor"
            className="object-cover object-top max-xl:object-right max-md:object-top"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutAwards;
