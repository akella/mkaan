"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import AnimatedImage from "../ui/AnimatedImage";
import SliderNavButton from "../ui/SliderNavButton";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const mockData = [
  {
    img: "/images/main-slider/1.jpg",
    title: "Crafted to Endure",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
  {
    img: "/images/main-slider/2.jpg",
    title: "Crafted Endure",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
  {
    img: "/images/main-slider/3.jpg",
    title: "Endure to Mkaan",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
  {
    img: "/images/main-slider/4.jpg",
    title: "Mkaan to Endure",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
  {
    img: "/images/main-slider/5.jpg",
    title: "Like to Al",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
  {
    img: "/images/main-slider/6.jpg",
    title: "Crafted",
    desc: `Like the patina of time on bronze, each Mkaan home is built to age with grace — precision that reveals new beauty as years unfold.`,
  },
];

const getSlides = (data) => {
  if (Array.isArray(data.Legacy_slider) && data.Legacy_slider.length > 0) {
    return data.Legacy_slider;
  }

  return mockData;
};

const HomeValues = ({ data = mockData }) => {
  const slides = useMemo(() => getSlides(data), [data]);
  const totalSlides = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const AUTOPLAY_DELAY = 7000;

  const valSection = useRef(null);
  const animText = useRef(null);
  const trackRef = useRef(null);
  const titleRefs = useRef([]);
  const splitInstances = useRef([]);
  const titleTimeline = useRef(null);
  const hasPlayedInitial = useRef(false);
  const autoplayTimeoutRef = useRef(null);
  const remainingTimeRef = useRef(AUTOPLAY_DELAY);
  const lastStartTimeRef = useRef(null);
  const timerIndicatorRef = useRef(null);
  const timerTweenRef = useRef(null);
  const [sliderActive, setSliderActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const currentNumberRef = useRef(null);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && "ontouchend" in window);

    setIsIOS(isIOSDevice);
  }, []);

  useLayoutEffect(() => {
    if (totalSlides === 0) {
      return;
    }

    setActiveIndex(0);
    setExitingIndex(null);
    setDisplayedIndex(0);
  }, [totalSlides]);

  useEffect(() => {
    if (!sliderActive || totalSlides <= 1 || activeIndex >= totalSlides - 1) {
      clearAutoplay();
      return undefined;
    }

    clearAutoplay();

    // start / restart autoplay with remaining time
    lastStartTimeRef.current =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const delay = remainingTimeRef.current;

    autoplayTimeoutRef.current = setTimeout(() => {
      remainingTimeRef.current = AUTOPLAY_DELAY;
      setActiveIndex((prev) => {
        if (totalSlides <= 1) return prev;

        if (prev >= totalSlides - 1) {
          return prev;
        }
        const nextIndex = prev + 1;
        setExitingIndex(prev);
        return nextIndex;
      });
    }, delay);

    return () => {
      clearAutoplay();
    };
  }, [activeIndex, totalSlides, clearAutoplay, AUTOPLAY_DELAY, sliderActive]);

  useEffect(() => {
    if (!timerIndicatorRef.current) {
      return undefined;
    }

    if (timerTweenRef.current) {
      timerTweenRef.current.kill();
      timerTweenRef.current = null;
    }

    // when slide changes, restart visual timer from 0
    gsap.set(timerIndicatorRef.current, { scaleY: 0 });

    if (totalSlides <= 1 || activeIndex >= totalSlides - 1) {
      gsap.set(timerIndicatorRef.current, { scaleY: 1 });
      return undefined;
    }

    timerTweenRef.current = gsap.to(timerIndicatorRef.current, {
      scaleY: 1,
      duration: AUTOPLAY_DELAY / 1000,
      ease: "none",
      force3D: true,
    });

    return () => {
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
        timerTweenRef.current = null;
      }
    };
  }, [activeIndex, totalSlides, AUTOPLAY_DELAY]);

  useEffect(() => {
    if (!sliderActive) {
      // capture remaining time when slider becomes inactive (e.g., scrolled away)
      if (lastStartTimeRef.current != null) {
        const now =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        const elapsed = now - lastStartTimeRef.current;
        remainingTimeRef.current = Math.max(
          0,
          remainingTimeRef.current - elapsed,
        );
      }
      clearAutoplay();
    }
  }, [sliderActive, clearAutoplay]);

  const goToSlide = (targetIndex) => {
    if (totalSlides <= 1) {
      return;
    }

    const rawIndex = typeof targetIndex === "number" ? targetIndex : 0;
    const normalizedIndex = Math.min(Math.max(rawIndex, 0), totalSlides - 1);

    if (normalizedIndex === activeIndex || isAnimating) {
      return;
    }

    const dir = normalizedIndex > activeIndex ? -1 : 1;
    setSlideDirection(dir);
    setIsAnimating(true);

    clearAutoplay();
    remainingTimeRef.current = AUTOPLAY_DELAY;
    setExitingIndex(activeIndex);
    setActiveIndex(normalizedIndex);
  };

  const handlePrev = () => {
    goToSlide(activeIndex - 1);
  };

  const handleNext = () => {
    goToSlide(activeIndex + 1);
  };

  const isPrevDisabled = activeIndex <= 0;
  const isNextDisabled = totalSlides <= 1 || activeIndex >= totalSlides - 1;

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

  useEffect(() => {
    if (!currentNumberRef.current) {
      setDisplayedIndex(activeIndex);
      return;
    }

    if (totalSlides <= 1 || activeIndex === displayedIndex) {
      setDisplayedIndex(activeIndex);
      gsap.set(currentNumberRef.current, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline();

    tl.to(currentNumberRef.current, {
      opacity: 0,
      // y: -8,
      duration: 0.4,
      ease: "power1.inOut",
    });

    tl.add(() => {
      setDisplayedIndex(activeIndex);
    });

    tl.to(currentNumberRef.current, {
      opacity: 1,
      // y: 0,
      duration: 0.4,
      ease: "power1.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [activeIndex, totalSlides, displayedIndex]);

  useEffect(() => {
    if (titleTimeline.current) {
      titleTimeline.current.kill();
      titleTimeline.current = null;
    }

    splitInstances.current.forEach((instance) => instance && instance.revert());
    splitInstances.current = [];

    setExitingIndex(null);
    hasPlayedInitial.current = false;

    titleRefs.current = titleRefs.current.slice(0, slides.length);

    titleRefs.current.forEach((title, index) => {
      if (!title) {
        return;
      }

      // Split into words and chars so wrapping respects whole words while animating letters
      const split = new SplitText(title, {
        type: "words,chars",
        wordsClass: "split-word",
        charsClass: "split-char",
      });
      splitInstances.current[index] = split;

      gsap.set(title, {
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
    });

    return () => {
      splitInstances.current.forEach(
        (instance) => instance && instance.revert(),
      );
      splitInstances.current = [];
    };
  }, [slides]);

  useEffect(() => {
    if (!splitInstances.current.length) {
      return;
    }

    if (titleTimeline.current) {
      titleTimeline.current.kill();
      titleTimeline.current = null;
    }

    const previousSplit =
      typeof exitingIndex === "number"
        ? splitInstances.current[exitingIndex]
        : null;
    const currentSplit = splitInstances.current[activeIndex];

    if (!currentSplit && !previousSplit) {
      return;
    }

    const hasExiting =
      typeof exitingIndex === "number" && exitingIndex !== activeIndex;
    const shouldAnimateInitial = !hasPlayedInitial.current && !!currentSplit;

    if (!hasExiting && !shouldAnimateInitial) {
      return;
    }

    const tl = gsap.timeline();
    titleTimeline.current = tl;

    if (previousSplit && exitingIndex !== activeIndex) {
      tl.fromTo(
        previousSplit.chars,
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.2,
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
            gsap.set(previousSplit.chars, {
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

    if (currentSplit) {
      tl.fromTo(
        currentSplit.chars,
        {
          opacity: 0,
          rotationX: 90,
          rotationY: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
        },
        {
          duration: 0.7,
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
        previousSplit && exitingIndex !== activeIndex ? "+=0.1" : 0,
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
      titleTimeline.current = null;
    };
  }, [activeIndex, exitingIndex]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    const sliderActivationTrigger = ScrollTrigger.create({
      trigger: valSection.current,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        setSliderActive(true);
        setActiveIndex(0);
        if (timerTweenRef.current) {
          timerTweenRef.current.resume();
        }
      },
      onEnterBack: () => {
        setSliderActive(true);
        if (timerTweenRef.current) {
          timerTweenRef.current.resume();
        }
      },
      onLeave: () => {
        setSliderActive(false);
        clearAutoplay();
        if (timerTweenRef.current) {
          timerTweenRef.current.pause();
        }
      },
      onLeaveBack: () => {
        setSliderActive(false);
        clearAutoplay();
        if (timerTweenRef.current) {
          timerTweenRef.current.pause();
        }
      },
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: valSection.current,
        start: "top center",
        end: "bottom top",
        scrub: true,
        // markers: true,
      },
    });
    tl.to(animText.current, {
      yPercent: 100,
      ease: "none",
      // duration: 3,
    });
    return () => {
      sliderActivationTrigger.kill();
      // overlayTween.scrollTrigger.kill();
      // overlayTween.kill();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={valSection}
      className="pt-[144px] [@media(max-width:900px)]:pt-0 [@media(max-width:900px)]:pb-0 pb-[208px] overflow-clip relative z-10 js-values-section max-md:bg-dark"
    >
      {/* <p
        ref={animText}
        className="absolute transform translate-y-[-80%] [@media(max-width:900px)]:hidden top-0 vertical-text-mode w-max h-max text-230 text-bigWhite bg-clip-text opacity-[0.75] mix-blend-overlay flex [text-shadow:2px_-1px_1px_rgba(255,255,255,0.20),-2px_1px_2px_rgba(0,0,0,0.35)]"
      >
        Legacy Through
      </p> */}

      <div
        className="absolute top-0 h-full w-[230px] [@media(max-width:900px)]:hidden"
        style={{
          mask: "linear-gradient(180deg, rgba(217,217,217,0) 0%, rgba(174,174,174,0.4) 25%, #737373 50%, rgba(115,115,115,0.4) 75%, rgba(115,115,115,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(217,217,217,0) 0%, rgba(174,174,174,0.4) 25%, #737373 50%, rgba(115,115,115,0.4) 75%, rgba(115,115,115,0) 100%)",
        }}
      >
        <Image
          ref={animText}
          src={"/icons/legacy-through.svg"}
          width={230}
          height={2076}
          alt="legacy text"
          className="absolute transform translate-y-[-80%] [@media(max-width:900px)]:hidden top-0 w-max h-max"
        />
      </div>

      <div className="js-values-inner relative [@media(max-width:900px)]:max-w-full max-w-[84.3%] w-full ml-auto flex max-md:flex-col">
        <div className="h-[220px] pl-6 border-l border-l-white/10 mt-6 max-md:hidden">
          <p className="text-11 opacity-40">{data.Title}</p>
        </div>
        <div className="relative w-full h-full md:h-[776px] max-md:h-[376px] overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full w-full"
            style={{ willChange: "transform" }}
          >
            {slides.map(({ Media, Title }, index) => (
              <div
                key={`${Title}-${index}`}
                className="relative h-full w-full flex-shrink-0 overflow-clip"
              >
                <div
                  className={`h-full w-full ${
                    activeIndex === index ? "scale-x-100" : "scale-x-125"
                  } duration-1600 transition-all ${
                    slideDirection === -1 ? "origin-right" : "origin-left"
                  }`}
                >
                  <AnimatedImage rootClass="h-full relative" end="bottom top">
                    <Image
                      src={`${ASSET_URL}${Media.url}`}
                      alt={Title || `Slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, 75vw"
                      style={{ objectFit: "cover" }}
                      quality={100}
                    />
                  </AnimatedImage>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute [@media(max-width:900px)]:relative [@media(max-width:900px)]:left-0 top-[35%] max-xl:min-h-[450px] max-md:min-h-[400px] min-h-[572px] left-[-8%] w-[408px] [@media(max-width:900px)]:w-full p-6 max-sm:p-4 max-sm:pl-[18px] flex items-start gap-6">
          <div
            className="absolute z-10 h-[calc(100%-48px)] max-sm:h-[calc(100%-32px)] w-px top-1/2 transform-gpu -translate-y-1/2 bg-beige overflow-hidden"
            style={
              isIOS
                ? undefined
                : { WebkitMaskImage: "-webkit-radial-gradient(white, black)" }
            }
          >
            <div
              ref={timerIndicatorRef}
              className="absolute inset-0 bg-amber-950 origin-top transform-gpu"
              style={{ transform: "scaleY(0) translateZ(0)" }}
            ></div>
          </div>
          <div
            data-cursor-area="light"
            className="values-slider md:min-h-[572px] absolute top-0 left-0 z-10 w-full text-wine flex flex-col justify-between max-xl:gap-[56px] max-sm:gap-[92px] gap-[228px] h-full max-sm:ml-6"
          >
            <div className="absolute top-0 left-0 p-6 pl-12 pointer-events-none">
              <div className="flex items-center gap-1 text-11">
                <p ref={currentNumberRef}>
                  {String(displayedIndex + 1).padStart(2)}
                </p>
                <p>-</p>
                <p>{String(totalSlides).padStart(2)}</p>
              </div>
            </div>
            {slides.map(({ Title, Description }, index) => {
              const isCurrent = index === activeIndex;
              const isVisible = isCurrent || index === exitingIndex;
              return (
                <div
                  key={`${Title}-${index}`}
                  className={`absolute p-6 pl-12 pb-[88px] inset-0 h-full md:min-h-[572px] w-[94%] flex flex-col justify-between transition-opacity duration-500 ease-out max-xl:gap-[56px] max-sm:gap-[92px] gap-[228px] ${
                    isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                  } ${isCurrent ? "z-20" : "z-10 pointer-events-none"}`}
                  aria-hidden={!isCurrent}
                >
                  <div className="flex flex-col gap-12 max-sm:gap-8">
                    <div
                      className="flex items-center gap-1 text-11 opacity-0 select-none"
                      aria-hidden="true"
                    >
                      <p>{String(index + 1).padStart(2)}</p>
                      <p>-</p>
                      <p>{String(totalSlides).padStart(2)}</p>
                    </div>
                    <h3 className="title-h2 max-sm:max-w-[61%] max-w-[79%]">
                      <span
                        ref={(el) => {
                          titleRefs.current[index] = el || null;
                        }}
                      >
                        {Title}
                      </span>
                    </h3>
                  </div>
                  <p
                    className={`text-14 max-sm:max-w-[85%] transition-opacity duration-400 ease-linear ${
                      isCurrent ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={!isCurrent}
                  >
                    {Description}
                  </p>
                </div>
              );
            })}
            <div className="absolute left-12 bottom-6 z-30 flex gap-2.5">
              <SliderNavButton
                onClick={handlePrev}
                className={`overflow-clip border-beige text-dark ${
                  isPrevDisabled
                    ? "opacity-40 !cursor-auto"
                    : "md:hover:text-textWhite md:hover:duration-500 md:hover:ease-[var(--ease-in)]"
                }`}
                ariaLabel="Previous slide"
                disabled={isPrevDisabled}
                fillClassName="bg-dark"
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
                    d="M5.76901 10.4165L10.5959 15.2434L10.0013 15.8332L4.16797 9.99984L10.0013 4.1665L10.5959 4.7563L5.76901 9.58317H15.8346V10.4165H5.76901Z"
                    fill="currentColor"
                  />
                </svg>
              </SliderNavButton>
              <SliderNavButton
                onClick={handleNext}
                className={`overflow-clip border-beige text-dark ${
                  isNextDisabled
                    ? "opacity-40 !cursor-auto"
                    : "md:hover:text-textWhite md:hover:duration-500 md:hover:ease-[var(--ease-in)]"
                }`}
                ariaLabel="Next slide"
                disabled={isNextDisabled}
                fillClassName="bg-dark"
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
          <Image
            className="max-md:hidden desktop-white-dec md:object-cover md:object-right md:min-h-[572px]"
            src={"/icons/mask/2.svg"}
            fill
            alt="decor"
          />
          <Image
            className="md:hidden absolute h-full w-[420px] right-0 top-0"
            src={"/icons/mask/2-mob.svg"}
            alt="decor"
            width={100}
            height={100}
          />
          <div className="md:hidden absolute top-0 left-0 h-full w-[60%] bg-textWhite"></div>
          <div className="desktop-spacer absolute top-0 left-0 h-full w-[60%] bg-textWhite"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeValues;
