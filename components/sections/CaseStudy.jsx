"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, useCallback, useEffect, useState } from "react";
import ButtonLink from "../ui/ButtonLink";
import HoverTooltip from "../ui/HoverTooltip";
import NavLink from "../NavLink";
import Image from "next/image";
import { CURSOR_DOT_MOVE_EVENT } from "@/lib/constants";
import { div } from "three/src/nodes/TSL";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const mockData = [
  {
    image: "/images/cases/1.jpg",
    name: "Alma Residence",
    location: "UAE, Dubai. 2025",
    link: "#",
  },
  {
    image: "/images/cases/2.jpg",
    name: "Waldorf Astoria Residences",
    location: "UAE, Dubai",
    link: "/",
  },
];

const CaseStudy = ({ data = mockData, pageData, casesData }) => {
  const caseBlock = useRef(null);
  const caseInfoRef = useRef(null);
  const caseLink = useRef(null);
  const mainDescription = useRef(null);

  const [tooltip, setTooltip] = useState({ index: null, x: 0, y: 0 });
  const activeSlideRef = useRef(null);
  const tooltipRootRef = useRef(null);

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
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const mm = gsap.matchMedia();

    const slideImages = document.querySelector(".js-slide-images");
    const overlay = slideImages?.querySelector(".js-overlay");
    const images = gsap.utils.toArray(".js-big-image");
    const smallImages = gsap.utils.toArray(".js-small-img");
    const caseNames = gsap.utils.toArray(".js-case-name");
    const caseLocations = gsap.utils.toArray(".js-case-location");
    const progressFill =
      caseInfoRef.current?.querySelector(".js-progress-fill");
    const totalImages = Array.isArray(casesData) ? casesData.length : 0;
    const stripsCount = 25;
    const setProgressFill = progressFill
      ? gsap.quickTo(progressFill, "scaleY", {
          duration: 0.2,
          ease: "power2.out",
        })
      : null;
    const infoTextDelay = 0.35;
    const infoSplits = [];

    const createCharSplits = (elements, charsClass) =>
      elements.map((el) => {
        const split = new SplitText(el, {
          type: "words,chars",
          mask: "chars",
          charsClass,
        });

        infoSplits.push(split);
        return {
          el,
          split,
        };
      });

    const caseNameSplitData = createCharSplits(caseNames, "case-name-char");
    const caseLocationSplitData = createCharSplits(
      caseLocations,
      "case-location-char",
    );

    const animateInfoSplit = (
      splitData,
      fromIndex,
      toIndex,
      visibleAlpha,
      direction,
      enterDelay = 0.35,
    ) => {
      if (fromIndex === toIndex) return;

      const previous = splitData[fromIndex];
      const next = splitData[toIndex];

      if (previous?.split) {
        gsap.set(previous.el, { autoAlpha: 1 });
        gsap.to(previous.split.chars, {
          yPercent: -100 * direction,
          // autoAlpha: 0,
          duration: 0.5,
          stagger: 0.008,
          ease: "power2.in",
          delay: infoTextDelay,
          overwrite: true,
          onComplete: () => {
            gsap.set(previous.el, { autoAlpha: 0 });
          },
        });
      }

      if (next?.split) {
        gsap.set(next.el, { autoAlpha: 1 });
        gsap.fromTo(
          next.split.chars,
          {
            yPercent: 100 * direction,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: visibleAlpha,
            duration: 0.75,
            stagger: 0.012,
            ease: "power3.out",
            delay: infoTextDelay + enterDelay,
            overwrite: true,
          },
        );
      }
    };

    if (!slideImages || totalImages === 0) {
      return;
    }

    const imageMeta = [];
    const setStripClip = (strip, lowerBound, upperBound) => {
      strip.style.clipPath = `polygon(0% ${lowerBound}%, 100% ${lowerBound}%, 100% ${upperBound}%, 0% ${upperBound}%)`;
    };
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalImages; i++) {
      const imgContainer = document.createElement("div");
      const imgContainerOverlay = document.createElement("div");
      imgContainer.classList.add("img-container");
      imgContainer.id = `img-container-${i + 1}`;
      imgContainer.style.opacity = "0";
      // imgContainerOverlay.style.opacity = "0";
      const stripsMeta = [];

      for (let j = 0; j < stripsCount; j++) {
        const strip = document.createElement("div");
        strip.classList.add("strip");

        const img = document.createElement("img");
        img.src = `${ASSET_URL}${casesData[i].Hero_section_case.Photo.url}`;
        img.alt = "case image";

        const stripPositionFromBottom = stripsCount - j - 1;
        const stripLowerBound =
          (stripPositionFromBottom + 1) * (100 / stripsCount);
        const stripUpperBound = stripPositionFromBottom * (100 / stripsCount);
        const openedUpperBound = stripUpperBound - 0.1;

        setStripClip(strip, stripLowerBound, openedUpperBound);
        stripsMeta.push({
          strip,
          lowerBound: stripLowerBound,
          openedUpperBound,
          revealDelay: (j / stripsCount) * 0.5,
          closeDelay: (j / stripsCount) * 0.5,
        });

        strip.appendChild(img);
        imgContainer.appendChild(strip);
        imgContainerOverlay.classList.add("img-container-overlay");
        imgContainer.appendChild(imgContainerOverlay);
      }
      fragment.appendChild(imgContainer);
      imageMeta.push({
        container: imgContainer,
        overlay: imgContainerOverlay,
        strips: stripsMeta,
      });
    }
    slideImages.appendChild(fragment);

    const imageOverlays = gsap.utils.toArray(".img-container-overlay");
    gsap.set(imageOverlays, { display: "none" });

    const transitionCount = totalImages + 1; // extra slice for overlay fade after last image
    const scrollDistancePerTransition = 1000;
    const initialScrollDelay = 300;
    const finalScrollDelay = 300;
    const totalScrollDistance =
      transitionCount * scrollDistancePerTransition +
      initialScrollDelay +
      finalScrollDelay;

    const transitionRange = [];

    let currentScrollPosition = initialScrollDelay;

    for (let k = 0; k < transitionCount; k++) {
      const transitionStart = currentScrollPosition;
      const transitionEnd = transitionStart + scrollDistancePerTransition;

      transitionRange.push({
        transition: k,
        startVh: transitionStart,
        endVh: transitionEnd,
        startPercent: transitionStart / totalScrollDistance,
        endPercent: transitionEnd / totalScrollDistance,
      });
      currentScrollPosition = transitionEnd;
    }

    function calculateImageProgress(scrollProgress) {
      let imageProgress = 0;

      if (scrollProgress < transitionRange[0].startPercent) {
        return 0;
      }

      if (
        scrollProgress > transitionRange[transitionRange.length - 1].endPercent
      ) {
        return transitionRange.length - 0.001; // clamp so last phase stays in range
      }

      for (let m = 0; m < transitionRange.length; m++) {
        const range = transitionRange[m];
        if (
          scrollProgress >= range.startPercent &&
          scrollProgress <= range.endPercent
        ) {
          const rangeSize = range.endPercent - range.startPercent;
          const normalizedProgress =
            (scrollProgress - range.startPercent) / rangeSize;
          imageProgress = m + normalizedProgress;
          break;
        } else if (scrollProgress > range.endPercent) {
          imageProgress = m + 1;
        }
      }
      return imageProgress;
    }

    let lastImageProgress = 0;
    let lastInfoIndex = 0;

    // init case info: first item visible, progress at first step
    gsap.set(caseNames, { autoAlpha: 0 });
    gsap.set(caseLocations, { autoAlpha: 0 });
    caseNameSplitData.forEach(({ split }) => {
      gsap.set(split.chars, { yPercent: 100, autoAlpha: 0 });
    });
    caseLocationSplitData.forEach(({ split }) => {
      gsap.set(split.chars, { yPercent: 100, autoAlpha: 0 });
    });
    if (caseNameSplitData[0]) {
      gsap.set(caseNameSplitData[0].el, { autoAlpha: 1 });
      gsap.set(caseNameSplitData[0].split.chars, { yPercent: 0, autoAlpha: 1 });
    }
    if (caseLocationSplitData[0]) {
      gsap.set(caseLocationSplitData[0].el, { autoAlpha: 1 });
      gsap.set(caseLocationSplitData[0].split.chars, {
        yPercent: 0,
        autoAlpha: 0.4,
      });
    }
    if (progressFill) gsap.set(progressFill, { scaleY: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: caseBlock.current,
        start: "top top",
        end: "+=300%",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const imageProgress = calculateImageProgress(self.progress);
          if (typeof imageProgress === "number") {
            const scrollDirection =
              imageProgress > lastImageProgress ? "down" : "up";
            const currentImageIndex = Math.floor(imageProgress);
            const imageSpecificProgress = imageProgress - currentImageIndex;

            const lastImageIndex = totalImages - 1;
            const overlayPhaseProgress = Math.min(
              1,
              Math.max(0, imageProgress - totalImages),
            );

            for (let n = 0; n < totalImages; n++) {
              const transitionIndex = n;
              const currentImage = imageMeta[n];
              if (!currentImage) continue;
              const imgContainer = currentImage.container;
              // hide previous images during overlay phase to avoid bleed-through
              if (
                overlayPhaseProgress > 0 &&
                transitionIndex < lastImageIndex
              ) {
                imgContainer.style.opacity = "0";
                continue;
              }

              imgContainer.style.opacity = "1";
              imgContainer.style.visibility = "visible";

              const strips = currentImage.strips;

              if (transitionIndex < lastImageIndex) {
                if (transitionIndex < currentImageIndex) {
                  strips.forEach((stripMeta) => {
                    setStripClip(
                      stripMeta.strip,
                      stripMeta.lowerBound,
                      stripMeta.openedUpperBound,
                    );
                  });
                } else if (transitionIndex === currentImageIndex) {
                  strips.forEach((stripMeta) => {
                    const adjustedProgress = Math.max(
                      0,
                      Math.min(
                        1,
                        (imageSpecificProgress - stripMeta.revealDelay) * 2,
                      ),
                    );

                    const currentStripUpperBound =
                      stripMeta.lowerBound -
                      (stripMeta.lowerBound - stripMeta.openedUpperBound) *
                        adjustedProgress;
                    setStripClip(
                      stripMeta.strip,
                      stripMeta.lowerBound,
                      currentStripUpperBound,
                    );
                  });
                } else {
                  strips.forEach((stripMeta) => {
                    setStripClip(
                      stripMeta.strip,
                      stripMeta.lowerBound,
                      stripMeta.lowerBound,
                    );
                  });
                }
              } else {
                // last image: open, then close during overlay phase
                strips.forEach((stripMeta) => {
                  const revealProgress = Math.min(
                    1,
                    Math.max(
                      0,
                      (imageProgress - lastImageIndex - stripMeta.revealDelay) *
                        2,
                    ),
                  );

                  const closingProgress = Math.min(
                    1,
                    Math.max(0, overlayPhaseProgress - stripMeta.closeDelay),
                  );

                  // invert close so it starts open and goes shut
                  const effectiveProgress = Math.max(
                    0,
                    Math.min(1, revealProgress - closingProgress),
                  );

                  const currentStripUpperBound =
                    stripMeta.lowerBound -
                    (stripMeta.lowerBound - stripMeta.openedUpperBound) *
                      effectiveProgress;
                  setStripClip(
                    stripMeta.strip,
                    stripMeta.lowerBound,
                    currentStripUpperBound,
                  );
                });

                // hide the final container only after the overlay takes over to avoid strip artefacts
                const hideFinalThreshold = 0.98;
                const hideFinalFrame =
                  overlayPhaseProgress >= hideFinalThreshold;
                imgContainer.style.opacity = hideFinalFrame ? "0" : "1";
                imgContainer.style.visibility = hideFinalFrame
                  ? "hidden"
                  : "visible";
              }
            }

            if (overlay) {
              const overlayRevealThreshold = 0.85; // wait until strips finish closing
              const overlayAlpha = Math.max(
                0,
                Math.min(
                  1,
                  (overlayPhaseProgress - overlayRevealThreshold) /
                    (1 - overlayRevealThreshold),
                ),
              );

              overlay.style.opacity = `${overlayAlpha}`;
              overlay.style.pointerEvents = overlayAlpha > 0 ? "auto" : "none";
            }
            lastImageProgress = imageProgress;

            // update case info visibility and progress
            const infoIndex = Math.min(
              totalImages - 1,
              Math.max(0, Math.floor(imageProgress)),
            );
            if (infoIndex !== lastInfoIndex) {
              const textDirection = infoIndex > lastInfoIndex ? 1 : -1;

              animateInfoSplit(
                caseNameSplitData,
                lastInfoIndex,
                infoIndex,
                1,
                textDirection,
              );

              animateInfoSplit(
                caseLocationSplitData,
                lastInfoIndex,
                infoIndex,
                0.4,
                textDirection,
                0.55,
              );

              lastInfoIndex = infoIndex;
            }
            if (progressFill) {
              let slideProgress = 0;

              if (imageProgress <= 0) {
                slideProgress = 0;
              } else if (imageProgress >= totalImages) {
                // when overlay/last phase starts, keep bar filled
                slideProgress = 1;
              } else {
                slideProgress = Math.min(1, Math.max(0, imageSpecificProgress));
              }

              setProgressFill?.(slideProgress);
            }
          }
        },
        onToggle: (self) => {
          gsap.set(imageOverlays, {
            display: self.isActive ? "block" : "none",
            // duration: 1,
            // ease: "power2.out",
            // overwrite: true,
          });
        },
      },
    });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: caseBlock.current,
        start: "top top",
        end: "+=300%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Sync the first center image reveal with the first big-image shutter start.
    const firstSmallImageStartOffset =
      (initialScrollDelay / scrollDistancePerTransition) * 4;

    // Fade title out while the first image covers it
    tl2.to(
      mainDescription.current,
      { opacity: 0, duration: 2 },
      firstSmallImageStartOffset,
    );

    smallImages.forEach((img, i) => {
      const smallImageStartPosition =
        i === 0 ? firstSmallImageStartOffset : i * 4;

      tl2
        .to(
          img,
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 2,
          },
          smallImageStartPosition,
        )
        .to(
          caseInfoRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          "+=0.2",
        )
        .to(
          caseLink.current,
          {
            pointerEvents: "auto",
          },
          "<",
        );
    });

    tl2.to(
      smallImages,
      {
        clipPath: "polygon(0 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
      },
      ">",
    );

    return () => {
      infoSplits.forEach((split) => split.revert());
      mm.revert();
    };
  }, []);

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
  return (
    <section
      ref={caseBlock}
      className="h-screen relative flex items-center justify-center max-sm:overflow-x-clip"
    >
      <div
        ref={caseInfoRef}
        className="absolute z-10 max-w-[300px] w-full left-[120px] max-lg:left-[20px] max-md:left-4 max-md:bottom-[26px] md:top-1/2 transform md:-translate-y-1/2 h-[120px] max-md:h-[110px] flex gap-6 opacity-0"
      >
        <div className="relative w-px h-full bg-brown">
          <div className="absolute inset-0 bg-textWhite scale-y-0 origin-top js-progress-fill"></div>
        </div>
        <div className="flex flex-col h-full justify-between max-w-[240px] w-full">
          <div className="relative ">
            {casesData.map((item, index) => (
              <p key={index} className="absolute text-28 js-case-name">
                {item.Hero_section_case.Title}
              </p>
            ))}
          </div>

          <div className="relative  max-md:-top-10">
            {casesData.map((item, index) => (
              <p
                key={index}
                className="text-14 opacity-40 absolute top-0 js-case-location"
              >
                {item.Hero_section_case.Location} {item.Hero_section_case.Year}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={caseLink}
        className="case-card-link relative z-10 p-6 max-sm:p-4 border border-textWhite/10 max-w-[480px] max-lg:max-w-[334px] max-md:max-w-[calc(100%-36px)] h-[600px] max-md:h-[429px] w-full md:hover:scale-95 md:hover:border-textWhite md:transition-all md:duration-400 md:ease-in-out pointer-events-none"
      >
        <div
          ref={mainDescription}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 items-center max-w-[300px] w-full mx-auto"
        >
          <p className="text-11 opacity-40">
            {pageData.Title ? pageData.Title : "flagship case study"}
          </p>
          <p className="title-h2 text-center"> {pageData.Big_title}</p>
        </div>
        <div className="relative w-full h-full case-card-link">
          <HoverTooltip
            visible={tooltip.index !== null}
            x={tooltip.x}
            y={tooltip.y}
            rootRef={tooltipRootRef}
            text="Read Case study"
            textStyle={{ fontSize: 14 }}
          />
          {casesData.map((item, index) => (
            <div key={index}>
              <NavLink
                href={`/case-study/${item.Hero_section_case.Slug}`}
                className="absolute inset-0 case-small-img js-small-img case-card-link"
                onMouseEnter={(event) => handleMouseEnter(event, index)}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  key={index}
                  src={`${ASSET_URL}${item.Hero_section_case.Photo.url}`}
                  width={2920}
                  height={1020}
                  alt="case image "
                  className="w-full h-full object-cover object-center absolute inset-0 "
                  quality={70}
                />
                <ButtonLink
                  className={
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden"
                  }
                  text={"Read Case study"}
                />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      <div className="js-slide-images absolute inset-0">
        <div className="js-overlay absolute inset-0 bg-dark opacity-0 pointer-events-none z-30 flex items-center justify-center p-6 max-sm:p-4">
          <div className="relative z-10 p-6 max-sm:p-4 pb-[72px] max-sm:pb-16 border border-textWhite/10 max-w-[480px] max-lg:max-w-[334px] max-md:max-w-[calc(100%-5px)] flex items-end w-full h-[600px] max-md:h-[429px]">
            <div className="flex flex-col gap-[158px] max-md:gap-[80px] items-center max-w-[300px] w-full mx-auto">
              <p className="text-14 text-center">
                {pageData.Bottom_description}
              </p>
              <ButtonLink
                tag="a"
                href={`/case-study`}
                text={"all case studies"}
              />
            </div>
          </div>
        </div>
        <div className="case-bg-gradient ab"></div>
      </div>
    </section>
  );
};

export default CaseStudy;
