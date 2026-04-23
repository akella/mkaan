"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import UaeClock from "@/components/ui/UaeClock";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";
import SocialLinks from "@/components/ui/SocilaLinks";
import useMediaQuery from "@/hooks/useMatchMedia";

const OVERLAY_FADE_MS = 1000;
const PANEL_TRANSITION_MS = 620;
const FIRST_PANEL_ENTER_DELAY_MS = 10;
const SECOND_PANEL_ENTER_DELAY_DESKTOP = FIRST_PANEL_ENTER_DELAY_MS + 200-200;
const SECOND_PANEL_ENTER_DELAY_MOBILE =
  FIRST_PANEL_ENTER_DELAY_MS + PANEL_TRANSITION_MS - 450;
const PANEL_EXIT_DELAY_MS = 150;

const ActiveDot = ({ isVisible }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute z-20 left-[-28px] max-md:left-[-20px] top-1/2 w-2 h-2 rounded-full bg-dark transition-opacity duration-300 ease-out ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}
    style={{ transform: "translateY(-50%)" }}
  ></span>
);

const HeaderClient = ({ pageName, rootClassname, isRootPage = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [indicatorOffset, setIndicatorOffset] = useState(0);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(null);
  const [subMenuMaxHeight, setSubMenuMaxHeight] = useState(0);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemsRef = useRef([]);
  const subMenuContentRef = useRef(null);
  const menuCloseTimeoutRef = useRef(null);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const secondPanelDelay = isMobile
    ? SECOND_PANEL_ENTER_DELAY_MOBILE
    : SECOND_PANEL_ENTER_DELAY_DESKTOP;
  const menuTransitionDuration = Math.max(
    OVERLAY_FADE_MS,
    secondPanelDelay + PANEL_TRANSITION_MS + PANEL_EXIT_DELAY_MS,
  );

  const lenis = useLenis();
  const pathname = usePathname();

  const getPageUrl = (page) => {
    switch (page) {
      case "Own With Mkaan":
        return "/own-with-mkaan";
      case "Partner With Mkaan":
        return "/partner-with-mkaan";
      default:
        return "/";
    }
  };

  const mainLinks = useMemo(
    () => [
      { label: "About Us", href: "/about" },
      { label: "Development", href: "/development" },
      { label: "Portfolio", href: "/projects" },
      { label: "Case Study", href: "/case-study" },
      { label: "Partners", href: "/partners" },
    ],
    [],
  );

  const homeSubLinks = useMemo(
    () => [
      { label: "Own With Mkaan", href: "/own-with-mkaan" },
      { label: "Partner With Mkaan", href: "/partner-with-mkaan" },
    ],
    [],
  );

  const getIndicatorOffset = useCallback((index, dotElement) => {
    const navElement = navRef.current;
    const targetElement = itemsRef.current[index];

    if (!navElement || !targetElement || !dotElement) {
      return null;
    }

    const navRect = navElement.getBoundingClientRect();
    const itemRect = targetElement.getBoundingClientRect();

    return (
      itemRect.top -
      navRect.top +
      itemRect.height / 2 -
      dotElement.offsetHeight / 2
    );
  }, []);

  const resolveActiveRouteIndex = useCallback(() => {
    if (!pathname) {
      return null;
    }

    if (
      pathname === "/" ||
      homeSubLinks.some((link) => link.href === pathname)
    ) {
      return 0;
    }

    const matchedIndex = mainLinks.findIndex((link) => {
      if (!link.href || link.href === "/") {
        return false;
      }
      return pathname === link.href || pathname.startsWith(`${link.href}/`);
    });

    return matchedIndex >= 0 ? matchedIndex + 1 : null;
  }, [pathname, homeSubLinks, mainLinks]);

  useEffect(() => {
    setActivePageIndex(resolveActiveRouteIndex());
  }, [resolveActiveRouteIndex]);

  const handleToggleMenu = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setIsMenuOpen(false);
      setIsSubMenuOpen(false);
      return;
    }

    setIsClosing(false);
    setIsMenuVisible(true);
    window.requestAnimationFrame(() => {
      setIsMenuOpen(true);
    });
  };

  const updateIndicatorPosition = useCallback(
    (index) => {
      const dotElement = indicatorRef.current;
      const offset = getIndicatorOffset(index, dotElement);

      if (typeof offset !== "number") {
        return;
      }

      setIndicatorOffset(offset);
      setActiveNavIndex(index);
    },
    [getIndicatorOffset],
  );

  const handleIndicatorTarget = useCallback(
    (index) => {
      setIsIndicatorVisible(true);
      updateIndicatorPosition(index);
    },
    [updateIndicatorPosition],
  );

  const isNavItemActive = useCallback(
    (index) => typeof activePageIndex === "number" && activePageIndex === index,
    [activePageIndex],
  );

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "auto";
      lenis?.start();
      setIsIndicatorVisible(false);
    }
  }, [isMenuOpen, lenis]);

  useEffect(() => {
    if (!isMenuOpen) {
      itemsRef.current = [];
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const initialIndex =
        typeof activePageIndex === "number" ? activePageIndex : 0;
      updateIndicatorPosition(initialIndex);
      setIsIndicatorVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isMenuOpen, updateIndicatorPosition, activePageIndex]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      updateIndicatorPosition(activeNavIndex);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isSubMenuOpen, activeNavIndex, updateIndicatorPosition]);

  useEffect(() => {
    if (!isMenuOpen) {
      setSubMenuMaxHeight(0);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (subMenuContentRef.current) {
        setSubMenuMaxHeight(subMenuContentRef.current.scrollHeight);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isMenuOpen, isSubMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleResize = () => {
      updateIndicatorPosition(activeNavIndex);
      if (subMenuContentRef.current) {
        setSubMenuMaxHeight(subMenuContentRef.current.scrollHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen, activeNavIndex, updateIndicatorPosition]);

  useEffect(() => {
    if (isMenuOpen) {
      if (menuCloseTimeoutRef.current) {
        window.clearTimeout(menuCloseTimeoutRef.current);
        menuCloseTimeoutRef.current = null;
      }
      return;
    }

    if (!isMenuVisible) {
      return;
    }

    menuCloseTimeoutRef.current = window.setTimeout(() => {
      setIsMenuVisible(false);
      setIsClosing(false);
    }, menuTransitionDuration);

    return () => {
      if (menuCloseTimeoutRef.current) {
        window.clearTimeout(menuCloseTimeoutRef.current);
        menuCloseTimeoutRef.current = null;
      }
    };
  }, [isMenuOpen, isMenuVisible]);

  return (
    <>
      <header
        className={`p-6 pointer-events-none max-sm:px-4 flex justify-between items-center text-textWhite ${
          !isMenuOpen ? "header-bg" : ""
        } fixed w-full z-40 ${rootClassname ? rootClassname : ""}`}
      >
        {!isRootPage && (
          <div className="absolute left-0 -z-10 top-0 h-[90%] w-full backdrop-blur-[4.5px] [mask-image:linear-gradient(180deg,black,black,transparent)] [mask-repeat:no-repeat] [mask-size:100%]"></div>
        )}

        <div
          className={`flex relative items-center gap-6 pointer-events-auto transition-all duration-300 ${isMenuOpen ? "max-md:text-dark z-40" : ""}`}
        >
          <NavLink href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="25"
              viewBox="0 0 38 25"
              fill="none"
              className="transition-all duration-500"
            >
              <path
                d="M24.0146 20.7471V20.7383C24.7122 21.8249 25.2352 22.5593 25.584 22.9453C25.9327 23.327 26.3269 23.6292 26.7627 23.8516V24.1543H22.3984V23.8516C22.8384 23.5706 23.0545 23.2981 23.0547 23.0381C23.0547 22.757 22.9139 22.4042 22.6357 21.9805L20.4844 18.5986H20.4238L19.4619 17.0498H19.4961L13.6953 7.95801L13.2754 7.29492L8.05566 15.5215H8.03906L7.58789 16.2598L7.08398 17.0547L7.08887 17.0498H7.10547L6.16016 18.5986H6.13379L4.39746 21.3467C3.89923 22.1522 3.65046 22.7481 3.65039 23.1299C3.65039 23.411 3.82087 23.6541 4.15723 23.8555V24.1582H0V23.8555C0.456682 23.6541 0.838748 23.3818 1.1377 23.042C1.43668 22.6979 1.9647 21.9345 2.72461 20.7471L12.2627 5.91016C11.8848 5.4654 11.4446 5.11268 10.9463 4.85254V4.55078H13.5791L24.0146 20.7471Z"
                fill="currentColor"
              />
              <path
                d="M35.252 20.7461V20.7383C35.9496 21.825 36.4735 22.5593 36.8223 22.9453C37.171 23.327 37.5651 23.6292 38.001 23.8516V24.1533H33.6367V23.8516C34.0769 23.5704 34.293 23.2973 34.293 23.0371C34.2928 22.7561 34.1519 22.4039 33.874 21.9805L31.7227 18.5986H31.6621L30.7002 17.0498H30.7344L24.9336 7.95801L24.5137 7.29492L19.2939 15.5215H19.2773L18.8408 16.2363L18.3223 17.0537L18.3262 17.0498H18.3438L17.3984 18.5986H17.3711L15.6357 21.3467C15.1375 22.1522 14.8887 22.7481 14.8887 23.1299C14.8887 23.4109 15.0584 23.6541 15.3945 23.8555V24.1582H11.2383V23.8555C11.6949 23.6541 12.077 23.3817 12.376 23.042C12.675 22.6979 13.202 21.9335 13.9619 20.7461L23.501 5.91016C23.1231 5.46545 22.6828 5.11267 22.1846 4.85254V4.55078H24.8174L35.252 20.7461Z"
                fill="currentColor"
              />
              <path
                d="M23.6212 2.35182C24.2707 2.35182 24.7971 1.82535 24.7971 1.17591C24.7971 0.526473 24.2707 0 23.6212 0C22.9718 0 22.4453 0.526473 22.4453 1.17591C22.4453 1.82535 22.9718 2.35182 23.6212 2.35182Z"
                fill="currentColor"
              />
              <path
                d="M12.3986 2.35182C13.048 2.35182 13.5745 1.82535 13.5745 1.17591C13.5745 0.526473 13.048 0 12.3986 0C11.7491 0 11.2227 0.526473 11.2227 1.17591C11.2227 1.82535 11.7491 2.35182 12.3986 2.35182Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          {pageName && (
            <div className="flex items-center gap-6 max-md:hidden">
              <div className="h-3 w-px bg-brownDark"></div>
              <div className="flex gap-4">
                {pageName.map((part, index) => (
                  <NavLink
                    href={getPageUrl(part)}
                    key={index}
                    className="relative group overflow-y-hidden text-14 capitalize"
                  >
                    <span className="transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full flex">
                      {part}
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                      {part}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
        {!isRootPage && (
          <div
            className={`flex relative z-40 items-center gap-6 transition-all pointer-events-auto duration-500 ${
              isMenuOpen ? "text-dark " : ""
            }`}
          >
            <div>
              <p className="text-14">العربية</p>
            </div>
            <div
              className={`h-3 w-px  ${isMenuOpen ? "bg-beige" : "bg-brownDark"}`}
            ></div>
            <div>
              <button
                onClick={handleToggleMenu}
                className={`group flex items-center gap-2 `}
              >
                <div className="text-14 relative overflow-y-hidden group">
                  <p className="transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                    {isMenuOpen ? "Close" : "Menu"}
                  </p>
                  <p className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                    {isMenuOpen ? "Close" : "Menu"}
                  </p>
                </div>
                <div>
                  <div className="relative h-3 w-3 text-current">
                    <span
                      className={`absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-standard)] group-hover:translate-x-[4.5px] group-hover:translate-y-[4.5px] ${
                        isMenuOpen
                          ? "translate-x-[4.5px] translate-y-[4.5px]"
                          : ""
                      }`}
                    ></span>
                    <span
                      className={`absolute right-0 top-0 h-[3px] w-[3px] rounded-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-standard)] group-hover:-translate-x-[4.5px] group-hover:translate-y-[4.5px] ${
                        isMenuOpen
                          ? "-translate-x-[4.5px] translate-y-[4.5px]"
                          : ""
                      }`}
                    ></span>
                    <span
                      className={`absolute bottom-0 left-0 h-[3px] w-[3px] rounded-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-standard)] group-hover:translate-x-[4.5px] group-hover:-translate-y-[4.5px] ${
                        isMenuOpen
                          ? "translate-x-[4.5px] -translate-y-[4.5px]"
                          : ""
                      }`}
                    ></span>
                    <span
                      className={`absolute bottom-0 right-0 h-[3px] w-[3px] rounded-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-standard)] group-hover:-translate-x-[4.5px] group-hover:-translate-y-[4.5px] ${
                        isMenuOpen
                          ? "-translate-x-[4.5px] -translate-y-[4.5px]"
                          : ""
                      }`}
                    ></span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        {isMenuVisible && (
          <div
            data-lenis-prevent
            className={`fixed inset-0 z-30 pb-6 transition-opacity max-md:overflow-y-auto pointer-events-auto `}
            style={{
              transitionDuration: `${OVERLAY_FADE_MS}ms`,
              transitionTimingFunction: isMenuOpen
                ? " var(--ease-out)"
                : "var(--ease-in)",
            }}
          >
            <div
              onClick={() => setIsMenuOpen(false)}
              className={`bg-menuOverlay absolute inset-0 ${isMenuOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-700 ease-in-out`}
            ></div>
            <div className="h-full flex justify-end items-start">
              <div
                className={`text-textWhite flex flex-col justify-between max-md:justify-end max-w-[264px] max-md:max-w-full w-full h-[87.5%] max-md:h-[652px] menu-gradient p-6 max-md:p-4 pr-3.5 transform transition-all will-change-transform max-md:absolute max-md:top-[230px] max-md:left-0 ${
                  isMenuOpen
                    ? "translate-x-0 translate-y-0 opacity-100"
                    : "md:translate-x-[600%] max-md:translate-y-[calc(-100%_-_230px)] md:opacity-0"
                }`}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                  transitionDelay: isMenuOpen
                    ? `${secondPanelDelay}ms`
                    : "0ms",
                  transitionTimingFunction: isMenuOpen
                    ? " var(--ease-out)"
                    : "var(--ease-in)",
                }}
              >
                <div className="text-14 max-md:hidden">
                  <UaeClock />
                  <p>UAE, Dubai</p>
                </div>
                <Image
                  src="/icons/logo-menu.svg"
                  width={126}
                  height={80}
                  alt="Description"
                  className="ml-auto mr-[21px]"
                />
                <ul className="flex flex-col gap-6 text-14 max-md:gap-4">
                  <li>
                    <p className="opacity-40">E.</p>
                    <Link
                      className="relative overflow-y-hidden block group"
                      href="mailto:hello@mkaan.com"
                    >
                      <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                        hello@mkaan.com
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                        hello@mkaan.com
                      </span>
                    </Link>
                  </li>
                  <li>
                    <p className="opacity-40">M.</p>
                    <Link
                      className="relative overflow-y-hidden block group"
                      href="tel:+97145235096"
                    >
                      <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                        +971 4 523 5096
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                        +971 4 523 5096
                      </span>
                    </Link>
                  </li>
                  <li>
                    <p className="opacity-40">A.</p>
                    <div className="group">
                      <p className="relative overflow-y-hidden cursor-pointer">
                        <span className="block transition-transform duration-600 delay-75 ease-[var(--ease-link)] group-hover:-translate-y-full">
                          Level 4, Office 404-06
                        </span>
                        <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 delay-75 ease-[var(--ease-link)] group-hover:translate-y-0">
                          Level 4, Office 404-06
                        </span>
                      </p>
                      <p className="relative overflow-y-hidden cursor-pointer">
                        <span className="block transition-transform duration-600 delay-200 ease-[var(--ease-link)] group-hover:-translate-y-full">
                          Deyaar Head Office Building
                        </span>
                        <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 delay-200 ease-[var(--ease-link)] group-hover:translate-y-0">
                          Deyaar Head Office Building
                        </span>
                      </p>
                      <p className="relative overflow-y-hidden cursor-pointer">
                        <span className="block transition-transform duration-600 delay-300 ease-[var(--ease-link)] group-hover:-translate-y-full">
                          Al Barsha1, Dubai UAE
                        </span>
                        <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 delay-300 ease-[var(--ease-link)] group-hover:translate-y-0">
                          Al Barsha1, Dubai UAE
                        </span>
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="text-14 md:hidden mt-14">
                  <UaeClock />
                  <p>UAE, Dubai</p>
                </div>
              </div>

              <div
                data-cursor-area="light"
                className={`relative max-w-[600px] max-md:max-w-full w-full pl-[120px] max-md:pl-4 py-6 pr-6 max-md:py-4 max-md:pr-4 bg-textWhite h-full max-md:h-auto max-md:min-h-[559px] max-md:pt-24 transform transition-transform will-change-transform ${
                  isMenuOpen
                    ? "translate-x-0 translate-y-0"
                    : "md:translate-x-full max-md:-translate-y-full"
                }`}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                  transitionDelay: isMenuOpen
                    ? `${FIRST_PANEL_ENTER_DELAY_MS}ms`
                    : `${secondPanelDelay}ms`,
                  transitionTimingFunction: isMenuOpen
                    ? "var(--ease-out)"
                    : "var(--ease-in)",
                }}
              >
                <div className="flex flex-col justify-between max-md:gap-[132px] h-full border-l border-beige pl-6 max-md:pl-4 max-md:pt-[32px]">
                  <p className="text-11 text-gray max-md:hidden invisible">
                    menu
                  </p>
                  <nav
                    ref={navRef}
                    className="relative text-dark text-28 flex flex-col gap-4 max-md:gap-2"
                  >
                    <div>
                      <button
                        type="button"
                        ref={(el) => {
                          itemsRef.current[0] = el;
                        }}
                        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                        onMouseEnter={() => handleIndicatorTarget(0)}
                        onFocus={() => handleIndicatorTarget(0)}
                        aria-expanded={isSubMenuOpen}
                        aria-controls="header-home-submenu"
                        className="relative flex items-start max-md:items-center gap-2 cursor-pointer text-left bg-transparent border-0 p-0"
                      >
                        <ActiveDot
                          isVisible={pathname === "/" || isNavItemActive(0)}
                        />
                        <p>Home</p>
                        <div className="relative flex h-7 max-md:w-5 w-7 max-md:h-5 items-center justify-center">
                          <span className="block h-px w-5 bg-dark transition-opacity duration-300 ease-in-out" />
                          <span
                            className={`absolute block h-5 w-px bg-dark transition-transform duration-700 ease-in-out origin-center ${
                              isSubMenuOpen ? "rotate-z-90" : "rotate-z-0"
                            }`}
                          />
                        </div>
                      </button>
                      <div
                        className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
                        style={{
                          maxHeight: isSubMenuOpen
                            ? `${subMenuMaxHeight || 0}px`
                            : "0px",
                        }}
                      >
                        <ul
                          id="header-home-submenu"
                          ref={subMenuContentRef}
                          className="text-20 flex flex-col gap-3 pt-6 pb-2"
                        >
                          {homeSubLinks.map((item) => (
                            <li key={item.label}>
                              <NavLink
                                className="relative overflow-y-hidden group block"
                                href={item.href}
                              >
                                <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                                  {item.label}
                                </span>
                                <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                                  {item.label}
                                </span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-4 max-md:gap-2">
                      {mainLinks.map((item, index) => (
                        <li
                          className="relative"
                          key={item.label}
                          ref={(el) => {
                            itemsRef.current[index + 1] = el;
                          }}
                          onMouseEnter={() => handleIndicatorTarget(index + 1)}
                        >
                          <ActiveDot isVisible={isNavItemActive(index + 1)} />
                          <NavLink
                            href={item.href}
                            onFocus={() => handleIndicatorTarget(index + 1)}
                            className="relative overflow-y-hidden group block"
                          >
                            <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                              {item.label}
                            </span>
                            <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                              {item.label}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <div
                      ref={indicatorRef}
                      aria-hidden="true"
                      className="absolute max-md:left-[-20px] left-[-28px] w-2 h-2 rounded-full pointer-events-none transition-transform duration-700 ease-out"
                      style={{
                        top: 0,
                        transform: `translateY(${indicatorOffset}px)`,
                        background: "var(--color-bgBeige)",
                        opacity: isIndicatorVisible ? 1 : 0,
                      }}
                    ></div>
                  </nav>
                  <div className="flex items-end justify-between">
                    <nav>
                      <ul className="flex flex-col gap-2 text-14 text-gray2">
                        <li>
                          <NavLink
                            className="relative overflow-y-hidden block group opacity-40 hover:opacity-100 transition-all duration-400 ease-in-out"
                            href="/news"
                          >
                            <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                              News Room
                            </span>
                            <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                              News Room
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className="relative overflow-y-hidden block group opacity-40 hover:opacity-100 transition-all duration-400 ease-in-out"
                            href="/career"
                          >
                            <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                              Career
                            </span>
                            <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                              Career
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className="relative overflow-y-hidden block group opacity-40 hover:opacity-100 transition-all duration-400 ease-in-out"
                            href="/contact"
                          >
                            <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                              Contact
                            </span>
                            <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                              Contact
                            </span>
                          </NavLink>
                        </li>
                      </ul>
                    </nav>
                    <SocialLinks variant={"dark"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderClient;
