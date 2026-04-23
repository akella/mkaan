"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CURSOR_DOT_MOVE_EVENT } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMatchMedia";
import NavLink from "../NavLink";
import HoverTooltip from "../ui/HoverTooltip";
import { preloadImage } from "@/lib/preloadImage";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const MAIN_HERO_SECTION_ID = "main-hero-section";
const IMAGE_REVEAL_MS = 800;
const TEXT_REVEAL_DELAY_MS = 420;
const TEXT_REVEAL_TRANSITION_MS = 220;
const TEXT_HIDE_TRANSITION_MS = 700;

const MainHero = ({ ownPr, partnerPr, preloaderData }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pathTextTranslateY, setPathTextTranslateY] = useState("0%");
  const [pathTextTransitionMs, setPathTextTransitionMs] = useState(
    TEXT_REVEAL_TRANSITION_MS,
  );
  const router = useRouter();
  const navigationTimeoutRef = useRef(null);
  const textRevealTimeoutRef = useRef(null);
  const textRevealRafRef = useRef(null);
  const textRevealRafRef2 = useRef(null);
  const [tooltip, setTooltip] = useState({ index: null, x: 0, y: 0 });
  const tooltipFrame = useRef(null);
  const linkRefs = useRef({});
  const tooltipActiveRef = useRef(false);
  const activeTooltipRef = useRef(null);
  const lastCursorDotRef = useRef({ x: 0, y: 0 });

  const isMobile = useMediaQuery("(max-width: 1023px)");
  const isOwnHovered = hoveredSection === "own-with-mkaan";
  const isPartnerHovered = hoveredSection === "partner-with-mkaan";
  const isPathHovered = isOwnHovered || isPartnerHovered;
  const imageRevealTransition = `clip-path ${IMAGE_REVEAL_MS}ms var(--ease-in-out), opacity ${IMAGE_REVEAL_MS}ms var(--ease-in-out)`;

  useEffect(() => {
    if (textRevealTimeoutRef.current) {
      clearTimeout(textRevealTimeoutRef.current);
      textRevealTimeoutRef.current = null;
    }

    if (textRevealRafRef.current) {
      cancelAnimationFrame(textRevealRafRef.current);
      textRevealRafRef.current = null;
    }

    if (textRevealRafRef2.current) {
      cancelAnimationFrame(textRevealRafRef2.current);
      textRevealRafRef2.current = null;
    }

    if (isPathHovered) {
      setPathTextTransitionMs(TEXT_HIDE_TRANSITION_MS);
      setPathTextTranslateY("110%");
      return;
    }

    textRevealTimeoutRef.current = setTimeout(() => {
      // Move text above the mask with no transition, then animate it down into place.
      setPathTextTransitionMs(0);
      setPathTextTranslateY("-110%");

      textRevealRafRef.current = requestAnimationFrame(() => {
        textRevealRafRef2.current = requestAnimationFrame(() => {
          setPathTextTransitionMs(TEXT_REVEAL_TRANSITION_MS);
          setPathTextTranslateY("0%");
          textRevealRafRef2.current = null;
        });
        textRevealRafRef.current = null;
      });

      textRevealTimeoutRef.current = null;
    }, TEXT_REVEAL_DELAY_MS);
  }, [isPathHovered]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      if (textRevealTimeoutRef.current) {
        clearTimeout(textRevealTimeoutRef.current);
      }
      if (textRevealRafRef.current) {
        cancelAnimationFrame(textRevealRafRef.current);
      }
      if (textRevealRafRef2.current) {
        cancelAnimationFrame(textRevealRafRef2.current);
      }
    };
  }, []);

  const clearTooltipFrame = useCallback(() => {
    if (tooltipFrame.current) {
      cancelAnimationFrame(tooltipFrame.current);
      tooltipFrame.current = null;
    }
  }, []);

  const updateTooltipPosition = useCallback(
    (targetId, coords) => {
      if (!tooltipActiveRef.current || !targetId) {
        return;
      }

      const target = linkRefs.current[targetId];
      if (!target) {
        return;
      }

      const source = coords ?? lastCursorDotRef.current;
      if (
        !source ||
        typeof source.x !== "number" ||
        typeof source.y !== "number" ||
        Number.isNaN(source.x) ||
        Number.isNaN(source.y)
      ) {
        return;
      }

      const nextX = source.x;
      const nextY = source.y;

      clearTooltipFrame();

      tooltipFrame.current = requestAnimationFrame(() => {
        setTooltip((prev) => {
          if (
            prev.index === targetId &&
            Math.abs(prev.x - nextX) < 0.1 &&
            Math.abs(prev.y - nextY) < 0.1
          ) {
            return prev;
          }

          return { index: targetId, x: nextX, y: nextY };
        });
        tooltipFrame.current = null;
      });
    },
    [clearTooltipFrame],
  );

  const handleTooltipEnter = useCallback(
    (event, targetId) => {
      tooltipActiveRef.current = true;
      activeTooltipRef.current = targetId;

      const initialX = event ? event.clientX : 0;
      const initialY = event ? event.clientY : 0;

      setTooltip((prev) =>
        prev.index === targetId
          ? prev
          : { index: targetId, x: initialX, y: initialY },
      );
      updateTooltipPosition(targetId, { x: event.clientX, y: event.clientY });
    },
    [updateTooltipPosition],
  );

  const handleTooltipLeave = useCallback(() => {
    tooltipActiveRef.current = false;
    activeTooltipRef.current = null;
    clearTooltipFrame();
    setTooltip({ index: null, x: 0, y: 0 });
  }, [clearTooltipFrame]);

  const handleHover = (id) => {
    if (isNavigating) {
      return;
    }

    const photoUrl =
      id === "own-with-mkaan"
        ? ownPr?.Hero_section_project?.Photo?.url
        : partnerPr?.Hero_section_project?.Photo?.url;
    if (photoUrl) preloadImage(`${ASSET_URL}${photoUrl}`);

    setHoveredSection(id);
  };

  const handleLeave = () => {
    if (isNavigating) {
      return;
    }

    setHoveredSection(null);
  };

  const handleNavigate = (event, target) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (isNavigating) {
      return;
    }

    setHoveredSection(target);
    setIsNavigating(true);

    navigationTimeoutRef.current = setTimeout(() => {
      router.push(
        target === "own-with-mkaan" ? "/own-with-mkaan" : "/partner-with-mkaan",
      );
      navigationTimeoutRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    const handleCursorDotMove = (event) => {
      const { x, y } = event.detail || {};
      if (typeof x !== "number" || typeof y !== "number") {
        return;
      }

      lastCursorDotRef.current = { x, y };

      if (!tooltipActiveRef.current || !activeTooltipRef.current) {
        return;
      }

      updateTooltipPosition(activeTooltipRef.current, { x, y });
    };

    window.addEventListener(CURSOR_DOT_MOVE_EVENT, handleCursorDotMove);

    return () => {
      window.removeEventListener(CURSOR_DOT_MOVE_EVENT, handleCursorDotMove);
      clearTooltipFrame();
    };
  }, [clearTooltipFrame, updateTooltipPosition]);

  return (
    <section
      id={MAIN_HERO_SECTION_ID}
      className="pointer-events-none h-screen max-md:h-auto relative overflow-clip flex items-end max-lg:pt-[156px] max-lg:pb-9 bg-dark"
    >
      <div className="relative max-lg:hidden max-lg:flex-col max-lg:items-center z-10 flex justify-between w-full h-1/2 max-lg:h-full items-end bg-dark">
        <Link
          data-no-dot
          id="own-with-mkaan"
          ref={(node) => {
            if (node) {
              linkRefs.current["own-with-mkaan"] = node;
            } else {
              delete linkRefs.current["own-with-mkaan"];
            }
          }}
          className={`main-hero-link h-full flex flex-col justify-between max-lg:h-fit max-lg:justify-start max-lg:items-center max-lg:!pl-0 gap-[12px] pl-24 [@media(max-width:1220px)]:pl-6 items-start min-w-[32%] w-1/2 group transition-all duration-1320 ease-[var(--ease-in-out)] ${
            isNavigating
              ? "pointer-events-none opacity-0 -translate-x-100"
              : "opacity-100 translate-x-0"
          }`}
          onMouseEnter={
            !isMobile
              ? (e) => {
                  handleHover("own-with-mkaan");
                  handleTooltipEnter(e, "own-with-mkaan");
                }
              : undefined
          }
          onMouseLeave={
            !isMobile
              ? () => {
                  handleLeave();
                  handleTooltipLeave();
                }
              : undefined
          }
          onClick={
            !isMobile
              ? (event) => handleNavigate(event, "own-with-mkaan")
              : undefined
          }
          href={"/own-with-mkaan"}
        >
          <HoverTooltip
            visible={tooltip.index === "own-with-mkaan"}
            x={tooltip.x}
            y={tooltip.y - 8}
            className="max-lg:hidden"
            rowClassName="mix-blend-difference"
            showDot
            text="Go to Own"
            textStyle={{ fontSize: 12 }}
            labelClassName="text-dark bg-textWhite"
          />

          <div className="flex -translate-y-1/2 max-lg:flex-col max-lg:items-center items-start gap-12 max-lg:gap-4 ">
            <p className="lg:pt-[88px] text-14 lg:group-hover:-translate-x-14 transition-transform duration-600 ease-[var(--ease-in)]">
              Own with Mkaan
            </p>
            <div className="relative w-[194px] h-[194px] flex items-center justify-center main-hero-left max-lg:w-[120px] max-lg:h-[120px]">
              <div className="relative z-10 p-[94px] max-lg:p-[57px] border border-textWhite/10 rounded-full flex items-center justify-center lg:group-hover:p-[43.09px] transition-all duration-600 ease-[var(--ease-in-out)] lg:group-hover:border-none lg:group-hover:bg-textWhite">
                <div className="w-1 h-1 rounded-full bg-textWhite lg:group-hover:bg-dark"></div>
              </div>
              <Image
                src={"/images/dot-decor.png"}
                width={294}
                height={294}
                alt="decor"
                className="main-circle-dots max-lg:hidden min-w-[294px] h-[294px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-600 ease-[var(--ease-in)]"
              />
            </div>
          </div>

          <div
            className="transform translate-x-[140px] max-lg:hidden"
            data-cursor-area="light"
          >
            <svg
              width="336"
              height="190"
              viewBox="240 0 336 190"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1167.17 1115.5V1114.92C1215.4 1189.77 1251.57 1240.34 1275.68 1266.93C1299.8 1293.23 1327.07 1314.03 1357.21 1329.35V1350.16H1055.5V1329.35C1085.93 1309.99 1100.85 1291.2 1100.85 1273.29C1100.85 1253.92 1091.09 1229.65 1071.86 1200.46L923.153 967.535H918.893L852.378 860.898H854.829L453.781 234.659L424.787 188.999L63.9277 755.696L62.7539 755.664L32.0254 805.795L-3.24609 861.188L-2.95801 860.898H-1.74902L-67.1113 967.535H-68.9863L-188.985 1156.82C-223.435 1212.31 -240.658 1253.35 -240.658 1279.64C-240.658 1299.01 -228.889 1315.77 -205.636 1329.64V1350.45H-493V1329.64C-461.422 1315.77 -435.01 1296.98 -414.341 1273.58C-393.671 1249.88 -357.213 1197.28 -304.678 1115.5L354.74 93.6328C328.616 63 298.186 38.7249 263.736 20.8076V0H445.743L1167.17 1115.5Z"
                strokeWidth="1px"
                stroke="rgba(247, 247, 235, 0.10)"
                fill="transparent"
                className="group-hover:fill-textWhite transition-fill duration-600 ease-[var(--ease-in)]"
              />
            </svg>
          </div>
        </Link>
        <div className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 flex items-center gap-8 max-lg:hidden">
          <div className="overflow-hidden lg:mr-[25px]">
            <p
              className="text-14 text-center whitespace-nowrap"
              style={{
                transform: `translate3d(0, ${pathTextTranslateY}, 0)`,
                transition: `transform ${pathTextTransitionMs}ms var(--ease-in-out)`,
              }}
            >
              {preloaderData.Select_your_path_title}
            </p>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col justify-end pb-[24px] max-lg:hidden">
          <p
            className={`text-14 text-center max-w-[215px] mx-auto transition-opacity duration-500 ease-out lg:mr-[24px] ${
              isNavigating ? "opacity-0" : "opacity-100"
            }`}
          >
            {preloaderData.Bottom_description}
          </p>
        </div>
        <div className="lg:hidden max-w-[279px]">
          <div
            className={`flex overflow-hidden h-[180px]  main-hero-img transition-transform duration-1320 ease-[var(--ease-in-out)] `}
          >
            <Image
              width={1440}
              height={900}
              quality={100}
              alt="hero img"
              src={
                ownPr.Hero_section_project?.Photo
                  ? `${ASSET_URL}${ownPr.Hero_section_project.Photo.url}`
                  : "/images/main-hero.jpg"
              }
              id="own-with-mkaan"
              className={`w-full h-full opacity-100 transition-all duration-600 ease-[var(--ease-in)] object-cover origin-right ${
                hoveredSection === "own-with-mkaan" ? "opacity-100 " : ""
              } ${
                hoveredSection === "partner-with-mkaan"
                  ? "-translate-x-full scale-x-125"
                  : ""
              }`}
            />
            <Image
              width={1440}
              height={900}
              quality={100}
              alt="hero img"
              src={
                partnerPr.Hero_section_project?.Photo
                  ? `${ASSET_URL}${partnerPr.Hero_section_project.Photo.url}`
                  : "/images/main-hero-2.jpg"
              }
              className={`w-full h-full scale-x-150 transform transition-all duration-600 ease-[var(--ease-in)] object-cover ${
                hoveredSection === "partner-with-mkaan"
                  ? "opacity-100 -translate-x-full origin-top !scale-x-100"
                  : "origin-left"
              }`}
              id="partner-with-mkaan"
            />
          </div>
          <p className="text-14 text-center mt-4 max-w-[210px] mx-auto">
            {preloaderData.Bottom_description}
          </p>
        </div>
        <Link
          data-no-dot
          href={"/partner-with-mkaan"}
          id="partner-with-mkaan"
          ref={(node) => {
            if (node) {
              linkRefs.current["partner-with-mkaan"] = node;
            } else {
              delete linkRefs.current["partner-with-mkaan"];
            }
          }}
          className={`main-hero-link h-full max-lg:justify-end max-lg:h-fit max-lg:items-center max-lg:!pr-0 flex flex-col gap-[12px] pr-24 [@media(max-width:1220px)]:pr-6 justify-between items-end min-w-[32%] w-1/2 group transition-all duration-1320 ease-[var(--ease-in-out)] ${
            isNavigating
              ? "pointer-events-none opacity-0 translate-x-100"
              : "opacity-100 translate-x-0"
          }`}
          onMouseEnter={
            !isMobile
              ? (e) => {
                  handleHover("partner-with-mkaan");
                  handleTooltipEnter(e, "partner-with-mkaan");
                }
              : undefined
          }
          onMouseLeave={
            !isMobile
              ? () => {
                  handleLeave();
                  handleTooltipLeave();
                }
              : undefined
          }
          onClick={
            !isMobile
              ? (event) => handleNavigate(event, "partner-with-mkaan")
              : undefined
          }
        >
          <HoverTooltip
            visible={tooltip.index === "partner-with-mkaan"}
            x={tooltip.x}
            y={tooltip.y - 8}
            className="max-lg:hidden"
            rowClassName="mix-blend-difference"
            showDot
            text="Go to Partner"
            textStyle={{ fontSize: 12 }}
            labelClassName="text-dark bg-textWhite"
          />
          <div className="flex -translate-y-1/2 max-lg:flex-col max-lg:items-center items-start gap-12 max-lg:gap-4 lg:mr-3">
            <div className="relative w-[194px] h-[194px] flex items-center justify-center main-hero-right max-lg:w-[120px] max-lg:h-[120px]">
              <div className="p-[94px] max-lg:p-[57px] border border-textWhite/10 rounded-full flex items-center justify-center lg:group-hover:p-[43.09px] transition-all duration-600 ease-[var(--ease-in-out)] lg:group-hover:border-none lg:group-hover:bg-textWhite">
                <div className="w-1 h-1 rounded-full bg-textWhite lg:group-hover:bg-dark"></div>
              </div>
              <Image
                src={"/images/dot-decor.png"}
                width={294}
                height={294}
                quality={100}
                alt="decor"
                className="main-circle-dots max-lg:hidden min-w-[294px] h-[294px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-600 ease-[var(--ease-in)]"
              />
            </div>
            <p className="pt-[88px] max-lg:pt-0 text-14 lg:group-hover:translate-x-14 transition-transform duration-600 ease-[var(--ease-in)]">
              Partner with Mkaan
            </p>
          </div>

          <div
            className="transform translate-x-[-50px] max-lg:hidden"
            data-cursor-area="light"
          >
            <svg
              width="336"
              height="190"
              viewBox="240 0 336 190"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1167.17 1115.5V1114.92C1215.4 1189.77 1251.57 1240.34 1275.68 1266.93C1299.8 1293.23 1327.07 1314.03 1357.21 1329.35V1350.16H1055.5V1329.35C1085.93 1309.99 1100.85 1291.2 1100.85 1273.29C1100.85 1253.92 1091.09 1229.65 1071.86 1200.46L923.153 967.535H918.893L852.378 860.898H854.829L453.781 234.659L424.787 188.999L63.9277 755.696L62.7539 755.664L32.0254 805.795L-3.24609 861.188L-2.95801 860.898H-1.74902L-67.1113 967.535H-68.9863L-188.985 1156.82C-223.435 1212.31 -240.658 1253.35 -240.658 1279.64C-240.658 1299.01 -228.889 1315.77 -205.636 1329.64V1350.45H-493V1329.64C-461.422 1315.77 -435.01 1296.98 -414.341 1273.58C-393.671 1249.88 -357.213 1197.28 -304.678 1115.5L354.74 93.6328C328.616 63 298.186 38.7249 263.736 20.8076V0H445.743L1167.17 1115.5Z"
                strokeWidth="1px"
                stroke="rgba(247, 247, 235, 0.10)"
                fill="transparent"
                className="group-hover:fill-textWhite transition-fill duration-600 ease-[var(--ease-in)]"
              />
            </svg>
          </div>
        </Link>
      </div>
      <div className="relative z-10 bg-dark lg:hidden mx-auto w-[calc(210px+20px)] h-full flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-[176px] h-[176px] rounded-full bg-textWhite/7 flex items-center justify-center">
            <p className="text-14 text-center">
              Partner <br /> with Mkaan
            </p>
          </div>
          <Image
            src={"/icons/mobile-dots.svg"}
            fill
            alt="dots icon"
            className="!w-[200px] !h-[200px] max-w-none !top-1/2 !left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          <NavLink href="/partner-with-mkaan" className="absolute inset-0" />
        </div>
        <div className="w-px h-10 bg-brownDark mt-6"></div>
        <p className="text-14 my-4">{preloaderData.Select_your_path_title}</p>
        <div className="w-px h-10 bg-brownDark mb-6"></div>
        <div className="relative">
          <div className="w-[176px] h-[176px] rounded-full bg-textWhite/7 flex items-center justify-center">
            <p className="text-14 text-center">
              Own <br /> with Mkaan
            </p>
          </div>
          <Image
            src={"/icons/mobile-dots.svg"}
            fill
            alt="dots icon"
            className="!w-[200px] !h-[200px] max-w-none !top-1/2 !left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          <NavLink href="/own-with-mkaan" className="absolute inset-0" />
        </div>
        <p className="text-14 text-center max-w-[210px] mt-11">
          {preloaderData.Bottom_description}
        </p>
      </div>
      {/* <div className="absolute inset-0 lg:mix-blend-multiply bg-dark opacity-70"></div> */}
      <div
        id="images-wrap"
        className={`max-lg:hidden pointer-events-none absolute z-20 top-1/2 left-[calc(50%)] transform -translate-x-1/2 overflow-hidden -translate-y-1/2 h-full w-[calc(100%)] main-hero-img transition-transform duration-1320 ease-[var(--ease-in-out)] ${
          isNavigating ? "scale-[1] " : "scale-[0.2]"
        }`}
      >
        <Image
          width={1440}
          height={900}
          quality={100}
          alt="hero img"
          src={
            ownPr.Hero_section_project?.Photo
              ? `${ASSET_URL}${ownPr.Hero_section_project.Photo.url}`
              : "/images/main-hero.jpg"
          }
          id="own-with-mkaan"
          className="absolute inset-0 w-full h-[150vh] object-cover"
          style={{
            clipPath: isOwnHovered
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0% 0% 0%)",
            opacity: isOwnHovered ? 1 : 0,
            transition: imageRevealTransition,
          }}
        />
        <Image
          width={1440}
          height={900}
          quality={100}
          alt="hero img"
          src={
            partnerPr.Hero_section_project?.Photo
              ? `${ASSET_URL}${partnerPr.Hero_section_project.Photo.url}`
              : "/images/main-hero-2.jpg"
          }
          className="absolute inset-0 w-full h-[150vh] object-cover"
          style={{
            clipPath: isPartnerHovered
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0% 0% 0%)",
            opacity: isPartnerHovered ? 1 : 0,
            transition: imageRevealTransition,
          }}
          id="partner-with-mkaan"
        />
      </div>
      <div className="lg:hidden w-[620px] h-[620px] rounded-full border border-brownDark absolute left-1/2 -translate-x-1/2 -top-4"></div>
      <div className="lg:hidden w-[620px] h-[620px] rounded-full border border-brownDark absolute left-1/2 -translate-x-1/2 -bottom-4"></div>
    </section>
  );
};

export default MainHero;
