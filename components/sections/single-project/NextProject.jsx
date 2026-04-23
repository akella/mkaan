"use client";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import NavLink from "@/components/NavLink";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const getProjectHeroTitleTargetLeft = () =>
  window.innerWidth >= 1000 ? 144 : 16;

const NextProject = ({ data }) => {
  const router = useRouter();
  const lenis = useLenis();
  const lenisRef = useRef(null);
  lenisRef.current = lenis;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const pinnedScreen = useRef(null);
  const nextHeroScreen = useRef(null);
  const leftIndicator = useRef(null);
  const rightIndicator = useRef(null);
  const leftIndicatorWrap = useRef(null);
  const rightIndicatorWrap = useRef(null);
  const scrollLabelRef = useRef(null);
  const nextPrLink = useRef(null);
  const nextPrTitleRef = useRef(null);
  const splitInstanceRef = useRef(null);
  const hoverTimelineRef = useRef(null);
  const transitionTitleSplitRef = useRef(null);
  const indicatorWrap = useRef(null);
  const nextBlockAnimationRef = useRef(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    const titleText = data?.Hero_section_project?.Title;
    const titleEl = nextPrTitleRef.current;

    if (!titleEl || !titleText) {
      return undefined;
    }

    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
      splitInstanceRef.current = null;
    }

    const split = new SplitText(titleEl, {
      type: "words,chars",
      wordsClass: "split-word",
      charsClass: "split-char",
    });
    splitInstanceRef.current = split;

    gsap.set(titleEl, {
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
      opacity: 1,
      rotationX: 0,
    });

    const hoverTimeline = gsap
      .timeline({ paused: true })
      .to(split.chars, {
        duration: 0.25,
        opacity: 0,
        rotationX: -90,
        ease: "power1.in",
        stagger: {
          each: 0.015,
          from: "start",
        },
      })
      .set(split.chars, {
        rotationX: 90,
        opacity: 0,
      })
      .to(split.chars, {
        duration: 0.55,
        opacity: 1,
        rotationX: 0,
        ease: "expo.out",
        stagger: {
          each: 0.015,
          from: "start",
        },
      });

    hoverTimelineRef.current = hoverTimeline;

    return () => {
      hoverTimeline.kill();
      split.revert();
      hoverTimelineRef.current = null;
      splitInstanceRef.current = null;

      if (transitionTitleSplitRef.current) {
        transitionTitleSplitRef.current.revert();
        transitionTitleSplitRef.current = null;
      }
    };
  }, [data?.Hero_section_project?.Title]);

  const handleLinkMouseEnter = () => {
    if (hoverTimelineRef.current) {
      hoverTimelineRef.current.play(0);
    }
  };

  const handleLinkMouseLeave = () => {
    if (hoverTimelineRef.current) {
      hoverTimelineRef.current.reverse();
    }
  };
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const scrollLabelSplit = scrollLabelRef.current
      ? new SplitText(scrollLabelRef.current, {
          type: "chars",
          charsClass: "scroll-label-char",
        })
      : null;

    mm.add("(max-width: 767px)", () => {
      gsap.set(nextHeroScreen.current, {
        scaleX: 0.9,
        yPercent: -6,
      });
    });

    if (scrollLabelSplit?.chars?.length) {
      gsap.set(scrollLabelSplit.chars, {
        opacity: 0.4,
      });
    }

    gsap.set(leftIndicator.current, {
      transformOrigin: "100% 50%",
    });

    gsap.set(rightIndicator.current, {
      transformOrigin: "0% 50%",
    });

    gsap.set(nextHeroScreen.current, {
      scaleX: 0.88,
      yPercent: -6,
    });

    const nextBlockAnimation = () => {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";

      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
        hoverTimelineRef.current = null;
      }

      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
        splitInstanceRef.current = null;
      }

      if (transitionTitleSplitRef.current) {
        transitionTitleSplitRef.current.revert();
        transitionTitleSplitRef.current = null;
      }

      const transitionTitleSplit = nextPrTitleRef.current
        ? new SplitText(nextPrTitleRef.current, {
            type: "lines",
            linesClass: "next-project-title-line",
          })
        : null;

      transitionTitleSplitRef.current = transitionTitleSplit;

      if (transitionTitleSplit?.lines?.length) {
        gsap.set(transitionTitleSplit.lines, {
          display: "block",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          x: 0,
        });
      }

      const targetTitleLeft = getProjectHeroTitleTargetLeft();
      const lineShiftX = transitionTitleSplit?.lines?.map((line) => {
        const { left } = line.getBoundingClientRect();
        return targetTitleLeft - left;
      });

      const nextBlockTl = gsap.timeline({
        onComplete: () => {
          router.push(`/projects/${data.Hero_section_project.Slug}`);
          document.body.style.overflow = "";
          lenisRef.current?.start();
        },
      });

      nextBlockTl.to(nextHeroScreen.current, {
        scaleX: 1,
        duration: 1,
        yPercent: -100,
        ease: "power1.inOut",
      });

      if (transitionTitleSplit?.lines?.length) {
        nextBlockTl.to(
          transitionTitleSplit.lines,
          {
            x: (index) => lineShiftX?.[index] ?? 0,
            duration: 1,
            ease: "power2.out",
            stagger: -0.1,
          },
          0.7,
        );
      }
    };

    nextBlockAnimationRef.current = nextBlockAnimation;

    const tl = gsap.timeline({
      // onComplete: () => nextBlockAnimation(),
      scrollTrigger: {
        trigger: pinnedScreen.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        // markers: true,
        pinSpacing: false,
        anticipatePin: 1,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!hasFiredRef.current && self.progress >= 0.98) {
            hasFiredRef.current = true;
            nextBlockAnimation();
          }
        },
        onLeaveBack: () => {
          hasFiredRef.current = false;
        },
      },
    });
    tl.to(scrollLabelSplit?.chars || [], {
      opacity: 1,
      ease: "none",
      duration: 0.18,
      stagger: {
        each: 0.04,
        from: "center",
      },
    }).to(
      [leftIndicator.current, rightIndicator.current],
      {
        scaleX: 1,
        ease: "none",
        duration: 1,
      },
      ">",
    );

    return () => {
      if (scrollLabelSplit) {
        scrollLabelSplit.revert();
      }
      if (transitionTitleSplitRef.current) {
        transitionTitleSplitRef.current.revert();
        transitionTitleSplitRef.current = null;
      }
      mm.revert();
    };
  }, []);
  return (
    <div ref={pinnedScreen} className="relative">
      <div className="h-screen max-md:pb-14 relative">
        <div className="flex flex-col gap-[184px] max-md:gap-[220px] max-md:px-4 items-center justify-center h-full">
          <div className="max-w-[450px] max-md:max-w-[260px] w-full mb-14 max-md:mb-28">
            <p className="text-11 opacity-40 text-center">next project</p>
            <NavLink
              ref={nextPrLink}
              href={`/projects/${data.Hero_section_project.Slug}`}
              className="flex justify-center title-h1 text-center mt-6 relative z-10"
              onMouseEnter={handleLinkMouseEnter}
              onMouseLeave={handleLinkMouseLeave}
              onClick={(e) => {
                e.preventDefault();
                if (hasFiredRef.current) return;
                hasFiredRef.current = true;
                if (nextBlockAnimationRef.current) {
                  nextBlockAnimationRef.current();
                }
              }}
            >
              <span ref={nextPrTitleRef}>
                {data.Hero_section_project.Title}
              </span>
            </NavLink>
          </div>
          <div
            ref={indicatorWrap}
            className="absolute bottom-[80px] max-md:w-[calc(100%-54px)] flex items-center gap-6 max-md:gap-6 w-full md:max-w-[88%]"
          >
            <div
              ref={leftIndicatorWrap}
              className="relative h-px bg-brown grow"
            >
              <div
                ref={leftIndicator}
                className="absolute inset-0 bg-textWhite transform scale-x-0 origin-right"
              ></div>
            </div>
            <p className="text-14">
              <span ref={scrollLabelRef} className="block">
                Keep Scrolling
              </span>
            </p>
            <div
              ref={rightIndicatorWrap}
              className="relative h-px bg-brown grow"
            >
              <div
                ref={rightIndicator}
                className="absolute inset-0 bg-textWhite transform scale-x-0 origin-left"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={nextHeroScreen}
        className="h-[100vh] flex items-center [@media(max-width:999px)]:items-end relative overflow-hidden"
      >
        <Image
          src={ASSET_URL + data.Hero_section_project.Photo.url}
          alt="Next Project Image"
          fill
          className="object-cover object-top !h-[200vh]"
          quality={100}
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.75)_0%,_rgba(20,_9,_14,_0.28)_100%)]"></div>
      </div>
    </div>
  );
};

export default NextProject;
