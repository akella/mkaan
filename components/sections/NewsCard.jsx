"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CURSOR_DOT_MOVE_EVENT } from "@/lib/constants";
import AnimatedImage from "../ui/AnimatedImage";
import NavLink from "../NavLink";
import useMediaQuery from "@/hooks/useMatchMedia";

gsap.registerPlugin(SplitText);

const formatNewsDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    const rawValue = `${dateString ?? ""}`.trim();
    const splitMatch = rawValue.match(/^(\d{1,2})\s+([A-Za-z]{3,})$/);

    if (splitMatch) {
      const [, fallbackDay, fallbackMonth] = splitMatch;
      return { day: fallbackDay.replace(/^0/, ""), month: fallbackMonth };
    }

    return { day: rawValue, month: "" };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).formatToParts(date);

  const day = (parts.find((part) => part.type === "day")?.value ?? "").replace(
    /^0/,
    "",
  );
  const month = parts.find((part) => part.type === "month")?.value ?? "";

  return { day, month };
};

const NewsCard = ({
  title,
  date,
  imageSrc,
  link = "#",
  className = "",
  infoBlockClassName = "",
  tooltipLabel = "Label",
}) => {
  const titleRef = useRef(null);
  const infoTitleRef = useRef(null);
  const splitRef = useRef(null);
  const infoSplitRef = useRef(null);
  const infoBlockRef = useRef(null);
  const tooltipFrame = useRef(null);
  const tooltipActiveRef = useRef(false);
  const lastCursorDotRef = useRef({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState({ active: false, x: 0, y: 0 });

  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    return () => {
      splitRef.current?.revert?.();
      infoSplitRef.current?.revert?.();
      if (tooltipFrame.current) {
        cancelAnimationFrame(tooltipFrame.current);
        tooltipFrame.current = null;
      }
    };
  }, []);

  const animateSplitText = useCallback(
    (targetRef, storeRef, direction, config = {}) => {
      const target = targetRef.current;
      if (!target) return;

      let splitInstance = storeRef.current;
      if (!splitInstance) {
        splitInstance = new SplitText(target, { type: "lines", mask: "lines" });
        storeRef.current = splitInstance;
        gsap.set(target, { display: "block", overflow: "hidden" });
        if (config.initialHidden) {
          gsap.set(splitInstance.lines, { yPercent: config.outY ?? -100 });
        }
      }

      const { lines } = splitInstance;
      if (!lines?.length) return;

      gsap.killTweensOf(lines);

      const {
        duration = 0.85,
        stagger = 0.05,
        ease = "power3.inOut",
        outY = -100,
        inDelay = 0.5,
      } = config;

      const isHide = direction === "out";
      gsap.to(lines, {
        yPercent: isHide ? outY : 0,
        duration,
        stagger,
        ease,
        delay: isHide ? 0 : inDelay,
      });
    },
    [],
  );

  const handleHoverIn = useCallback(() => {
    animateSplitText(titleRef, splitRef, "out");
    animateSplitText(infoTitleRef, infoSplitRef, "in", {
      duration: 0.60,
      inDelay: 0.2,
      initialHidden: true,
      outY: 100,
    });
  }, [animateSplitText]);

  const updateTooltipPosition = useCallback(({ x, y }) => {
    if (!tooltipActiveRef.current) {
      return;
    }
    const block = infoBlockRef.current;
    if (!block || typeof x !== "number" || typeof y !== "number") {
      return;
    }

    const rect = block.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;

    if (tooltipFrame.current) {
      cancelAnimationFrame(tooltipFrame.current);
    }

    tooltipFrame.current = requestAnimationFrame(() => {
      setTooltip((prev) => {
        if (
          Math.abs(prev.x - localX) < 0.1 &&
          Math.abs(prev.y - localY) < 0.1
        ) {
          return prev;
        }
        return { ...prev, x: localX, y: localY };
      });
      tooltipFrame.current = null;
    });
  }, []);

  const handleTooltipMove = useCallback(() => {
    if (!tooltipActiveRef.current) {
      tooltipActiveRef.current = true;
      setTooltip((prev) => (prev.active ? prev : { ...prev, active: true }));
    }
    updateTooltipPosition(lastCursorDotRef.current);
  }, [updateTooltipPosition]);

  const handleTooltipLeave = useCallback(() => {
    tooltipActiveRef.current = false;
    if (tooltipFrame.current) {
      cancelAnimationFrame(tooltipFrame.current);
      tooltipFrame.current = null;
    }

    setTooltip({ active: false, x: 0, y: 0 });
  }, []);

  const handleHoverOut = useCallback(() => {
    animateSplitText(titleRef, splitRef, "in");
    animateSplitText(infoTitleRef, infoSplitRef, "out", {
      duration: 0.90,
      inDelay: 0,
      outY: 100,
    });
    handleTooltipLeave();
  }, [animateSplitText, handleTooltipLeave]);

  useEffect(() => {
    const handleCursorDotMove = (event) => {
      const { x, y } = event.detail || {};
      if (typeof x !== "number" || typeof y !== "number") {
        return;
      }
      lastCursorDotRef.current = { x, y };
      updateTooltipPosition({ x, y });
    };

    window.addEventListener(CURSOR_DOT_MOVE_EVENT, handleCursorDotMove);

    return () => {
      window.removeEventListener(CURSOR_DOT_MOVE_EVENT, handleCursorDotMove);
      if (tooltipFrame.current) {
        cancelAnimationFrame(tooltipFrame.current);
        tooltipFrame.current = null;
      }
    };
  }, [updateTooltipPosition]);

  const { day, month } = formatNewsDate(date);

  return (
    <article
      className={`news-card-el group relative overflow-y-clip w-full aspect-[4/5] flex items-end ${className}`}
      onMouseEnter={isMobile ? undefined : handleHoverIn}
      onMouseLeave={isMobile ? undefined : handleHoverOut}
    >
      <h3
        ref={titleRef}
        className="relative z-10 max-w-[80%] max-lg:max-w-full text-20 overflow-hidden"
      >
        {title}
      </h3>
      <AnimatedImage
        end="bottom bottom"
        yEnd={0}
        rootClass={"absolute inset-0"}
      >
        <Image src={imageSrc} alt="News" fill quality={100} className="object-cover" />
      </AnimatedImage>
      <div className="md:group-hover:opacity-0 md:transition-opacity md:duration-500 md:ease-[var(--ease-in-out)] delay-400 absolute inset-0 bg-[linear-gradient(0deg,rgba(20,9,14,0.75)_0%,rgba(20,9,14,0)_100%)]"></div>
      <div
        ref={infoBlockRef}
        className={`absolute cursor-f news-info-block md:group-hover:opacity-100 md:transition-opacity md:duration-400 md:ease-[var(--ease-in-out)] z-20 w-[82.4%] h-[91.3%] p-6 pr-[52px] bg-textWhite top-6 left-6 text-dark flex flex-col justify-between ${infoBlockClassName}`}
        onMouseEnter={handleTooltipMove}
        onMouseLeave={handleTooltipLeave}
        data-cursor-area="light"
      >
        <div className="flex items-end">
          <p className="flex items-baseline gap-1 text-40">
            <span>{day}</span>
            {month && <span className="text-14">{month}</span>}
          </p>
        </div>
        <p ref={infoTitleRef} className="text-20 overflow-hidden">
          {title}
        </p>
        <NavLink
          href={`${link}`}
          className="relative w-fit text-14 after:content-[''] after:absolute after:-bottom-[0.5px] after:left-0 after:right-0 after:origin-left after:h-[1px] after:bg-dark md:hover:after:-scale-x-0 md:hover:after:origin-right md:after:transition-transform md:after:duration-400"
        >
          Read Article
        </NavLink>
        <NavLink href={`${link}`} className="absolute inset-0"></NavLink>
      </div>
      <NavLink href={`${link}`} className="absolute inset-0"></NavLink>
    </article>
  );
};

export default NewsCard;
