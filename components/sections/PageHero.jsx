"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";
import AnimatedTitle from "../ui/AnimatedTitle";
import AnimatedImage from "../ui/AnimatedImage";
import {
  PROJECT_FILTER_CHANGE_EVENT,
  PROJECT_FILTER_UPDATED_EVENT,
} from "@/lib/constants";

const PageHero = ({
  title,
  subtitle,
  backgroundImage,
  scrollText = false,
  titleClassName,
  subtitleClassName,
  needFilters = false,
  needRange = false,
  needAmount = false,
  amount,
  needHeroAnimation = true,
  filters,
}) => {
  const normalizedFilters = useMemo(
    () => (Array.isArray(filters) ? filters : []),
    [filters],
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [imageLoaded, setImageLoaded] = useState(false);
  const pageHero = useRef(null);
  const heroImg = useRef(null);
  const scrollTriggerRef = useRef(null);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleExternalUpdate = (event) => {
      const { label, source } = event.detail ?? {};
      if (!label || source === "page-hero") return;
      setActiveFilter(label);
    };

    window.addEventListener(PROJECT_FILTER_UPDATED_EVENT, handleExternalUpdate);

    return () => {
      window.removeEventListener(
        PROJECT_FILTER_UPDATED_EVENT,
        handleExternalUpdate,
      );
    };
  }, []);

  const resolveCategoryId = (category) =>
    category?.id ?? category?.documentId ?? category?.document_id ?? null;

  const scrollToNextSection = () => {
    if (typeof window === "undefined") return;

    const trigger = scrollTriggerRef.current;
    if (trigger) {
      window.scrollTo({ top: trigger.end, behavior: "smooth" });
      return;
    }

    if (!pageHero.current) return;

    const nextSection = pageHero.current.nextElementSibling;
    if (!nextSection) return;

    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFilterClick = (label, categoryId = null) => {
    const normalizedLabel = label ?? "All";
    if (normalizedLabel === activeFilter) return;

    setActiveFilter(normalizedLabel);
    if (typeof window === "undefined") return;

    window.dispatchEvent(
      new CustomEvent(PROJECT_FILTER_CHANGE_EVENT, {
        detail: {
          label: normalizedLabel,
          categoryId,
          source: "page-hero",
        },
      }),
    );

    scrollToNextSection();
  };
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const nextSection = pageHero.current.nextElementSibling;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pageHero.current,
        start: "top top",
        end: "bottom 10%",
        scrub: true,
        pin: true,
        pinSpacing: false,
        // pinSpacer: false,
        // markers: true,
      },
    });

    scrollTriggerRef.current = tl.scrollTrigger;

    if (nextSection) {
      mm.add("(max-width: 767px)", () => {
        gsap.set(nextSection, {
          marginTop: "-88px",
        });
      });

      if (needHeroAnimation) {
        mm.add("(min-width: 768px)", () => {
          gsap.set(nextSection, {
            marginTop: "-88px",
            scaleX: 0.88,
          });

          tl.to(nextSection, {
            scaleX: 1,
            ease: "none",
            duration: 1,
          });
        });
      }
    }
    tl.fromTo(
      heroImg.current,
      { yPercent: -10 },
      { yPercent: 0, ease: "none", duration: 1 },
      0,
    );

    return () => {
      mm.revert();
    };
  }, [needHeroAnimation, pageHero]);
  return (
    <section
      ref={pageHero}
      className="h-screen md:overflow-clip relative pb-28 flex justify-center items-end bg-no-repeat bg-center bg-cover"
    >
      <div className="md:relative md:h-full md:justify-end z-10 flex flex-col gap-[202px] max-md:gap-[194px] max-w-[87%] px-4 w-full">
        <AnimatedTitle
          tag="h1"
          className={`title-h1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !tracking-[-2.5px] max-w-[800px] max-md:max-w-[300px] text-center max-md:!text-[52px] max-md:!leading-[44px] max-md:!tracking-[-1.3px] ${titleClassName}`}
        >
          {title}
        </AnimatedTitle>
        <div className="md:grid md:grid-cols-3 md:items-center flex justify-center">
          {scrollText && (
            <p className="md:justify-self-start text-14 text-grayDark max-md:hidden">
              Scroll & Explore
            </p>
          )}

          {subtitle && (
            <p
              className={`md:w-fit mx-auto-desktop text-center max-md:max-w-[250px] text-14 ${subtitleClassName}`}
            >
              {subtitle}
            </p>
          )}

          {needFilters && normalizedFilters.length > 0 && (
            <div className="md:w-fit mx-auto-desktop flex gap-4 text-14 [&_span]:last:hidden">
              <button
                className={
                  activeFilter === "All"
                    ? "opacity-100"
                    : "opacity-40 md:hover:opacity-100 md:transition-opacity md:duration-500 md:ease-[var(--ease-in-out)]"
                }
                onClick={() => handleFilterClick("All", null)}
              >
                All
              </button>
              <span className="opacity-20">/</span>
              {normalizedFilters.map((filter, index) => (
                <React.Fragment key={filter?.id ?? index}>
                  <button
                    className={
                      activeFilter === filter?.Type
                        ? "opacity-100"
                        : "opacity-40 md:hover:opacity-100 md:transition-opacity md:duration-500 md:ease-[var(--ease-in-out)]"
                    }
                    onClick={() =>
                      handleFilterClick(filter?.Type, resolveCategoryId(filter))
                    }
                  >
                    {filter?.Type}
                  </button>
                  <span className="opacity-20">/</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {needRange && (
            <div className="md:justify-self-end flex items-center text-14 text-grayDark max-md:hidden">
              <p>‘20</p>
              <p>—</p>
              <p>‘25</p>
            </div>
          )}
          {needAmount && (
            <p className="md:justify-self-end text-14 text-grayDark max-md:hidden">
              {needAmount ? amount : "16"}
            </p>
          )}
        </div>
      </div>
      {backgroundImage && (
        <Image
          ref={heroImg}
          src={backgroundImage}
          fill
          alt="hero image"
          className="object-cover !h-[120%] transition-opacity duration-500 ease-in-out"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={handleImageLoad}
          quality={100}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.90)_0%,_rgba(20,_9,_14,_0.30)_100%)]"></div>
    </section>
  );
};

export default PageHero;
