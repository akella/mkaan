"use client";

import Image from "next/image";
import ButtonLink from "../ui/ButtonLink";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useMediaQuery from "@/hooks/useMatchMedia";
import { useLenis } from "lenis/react";
import { useEffect } from "react";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const HomePartners = ({ bgImg, data }) => {
  const lenis = useLenis();
  const partnersArray = data?.one_partners;
  const partnersBlock = useRef(null);
  const partnersInner = useRef(null);
  const partnersInnerMob = useRef(null);
  const partnersImage = useRef(null);
  const [activePartner, setActivePartner] = useState(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const handlePartnerClick = (partnerId) => {
    if (isMobile) {
      setActivePartner(partnerId);
      setIsMobileModalOpen(true);
    } else {
      setActivePartner((prev) => (prev === partnerId ? null : partnerId));
    }
  };

  const handleCloseMobileModal = () => {
    setIsMobileModalOpen(false);
    setActivePartner(null);
  };

  const getPartnerConfig = (partnerId) => {
    switch (partnerId) {
      case "elle":
        return {
          partner: partnersArray?.[0],
          fallbackSrc: "/icons/partners/logo-1.svg",
          width: 107,
          height: 48,
        };
      case "wallpaper":
        return {
          partner: partnersArray?.[1],
          fallbackSrc: "/icons/partners/logo-2.svg",
          width: 148,
          height: 34,
        };
      case "robb":
        return {
          partner: partnersArray?.[2],
          fallbackSrc: "/icons/partners/logo-3.svg",
          width: 140,
          height: 26,
        };
      case "dezeen":
        return {
          partner: partnersArray?.[3],
          fallbackSrc: "/icons/partners/logo-4.svg",
          width: 94,
          height: 48,
        };
      case "vogue":
        return {
          partner: partnersArray?.[4],
          fallbackSrc: "/icons/partners/logo-1-f.svg",
          width: 107,
          height: 48,
        };
      case "i-d":
        return {
          partner: partnersArray?.[5],
          fallbackSrc: "/icons/partners/logo-6.svg",
          width: 78,
          height: 48,
        };
      case "bugatti":
        return {
          partner: partnersArray?.[6],
          fallbackSrc: "/icons/partners/logo-7.svg",
          width: 120,
          height: 86,
        };
      default:
        return { partner: null, fallbackSrc: "", width: 0, height: 0 };
    }
  };

  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "auto";
      lenis?.start();
    }
  }, [isMobileModalOpen, lenis]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const pinTrigger = ScrollTrigger.create({
      trigger: partnersBlock.current,
      start: "bottom 90%",
      end: "+=500",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // mm.add("(min-width: 768px) and (max-height: 950px)", () => {
    //   const tl2 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: partnersInner.current,
    //       start: "top 30%",
    //       end: "bottom bottom",
    //       scrub: 2,

    //       // markers: true,
    //     },
    //   });
    //   tl2.to(partnersInner.current, {
    //     bottom: "0%",
    //     ease: "power3.inOut",
    //     duration: 2,
    //   });
    // });
    // mm.add("(min-height: 950px) and (min-width: 767px)", () => {
    //   const tl2 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: partnersInner.current,
    //       start: "top center",
    //       end: "bottom bottom",
    //       scrub: 2,

    //       // markers: true,
    //     },
    //   });
    //   tl2.to(partnersInner.current, {
    //     bottom: "0%",
    //     ease: "power3.inOut",
    //     // duration: 1,
    //   });
    // });

    // mm.add("(max-width: 767px)", () => {
    //   const tl2 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: partnersBlock.current,
    //       start: "center center",
    //       end: "bottom bottom",
    //       scrub: true,

    //       // markers: true,
    //     },
    //   });

    //   tl2.to([partnersInner.current, partnersInnerMob.current], {
    //     bottom: "0%",
    //     ease: "power3.inOut",
    //     // duration: 1,
    //   });
    // });

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: partnersBlock.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,

        // markers: true,
      },
    });

    tl3.fromTo(
      partnersImage.current,
      { yPercent: -10 },
      { yPercent: 10, ease: "none" },
      0,
    );

    return () => {
      tl3.kill();
      pinTrigger.kill();
    };
  }, []);
  return (
    <section
      ref={partnersBlock}
      className="relative max-md:pt-[46px] overflow-y-clip [transform:translateZ(0)] [backface-visibility:hidden]"
    >
      <div className="absolute z-10 w-[450px] max-md:w-[245px] left-1/2 top-[144px] max-md:top-[100px] -translate-x-1/2 flex flex-col gap-6 items-center">
        <p className="text-11 opacity-40">{data?.Title || "our partners"} </p>
        <h2 className="title-h1 text-center">
          {data?.Big_title || "Our Partners in Precision"}
        </h2>
      </div>
      <div className="relative z-10 flex flex-wrap">
        <div
          id="empty-cell"
          className="max-md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"
        ></div>
        <div
          id="empty-cell"
          className="max-md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"
        ></div>
        <div
          id="empty-cell"
          className="flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] md:border-t border-r border-r-brown md:border-t-brown"
        ></div>
        <div
          id="empty-cell"
          className="flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] md:border-t border-r border-r-brown border-t-brown"
        ></div>
        <div
          id="elle"
          className="group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown p-6 max-md:p-3 flex items-center justify-center"
        >
          {partnersArray[0]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[0].Logo
                      ? ASSET_URL + partnersArray[0].Logo.url
                      : "/icons/partners/logo-1.svg"
                  }
                  alt="logo"
                  width={107}
                  height={48}
                />
                <button
                  id="elle"
                  onClick={() => handlePartnerClick("elle")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "elle"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[0].Description || ""}
                </p>
                <div className="flex items-end max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[0].Logo
                        ? ASSET_URL + partnersArray[0].Logo.url
                        : "/icons/partners/logo-1.svg"
                    }
                    alt="logo"
                    width={107}
                    height={48}
                    className="partner-inner-logo"
                  />

                  <button
                    id="elle"
                    onClick={() => handlePartnerClick("elle")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="wallpaper"
          className="group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown p-6 max-md:p-3 flex items-center justify-center"
        >
          {partnersArray[1] && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[1].Logo
                      ? ASSET_URL + partnersArray[1].Logo.url
                      : "/icons/partners/logo-2.svg"
                  }
                  alt="logo"
                  width={148}
                  height={34}
                />
                <button
                  id="wallpaper"
                  onClick={() => handlePartnerClick("wallpaper")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "wallpaper"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[1].Description || ""}
                </p>
                <div className="flex items-end max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[1].Logo
                        ? ASSET_URL + partnersArray[1].Logo.url
                        : "/icons/partners/logo-2.svg"
                    }
                    alt="logo"
                    width={148}
                    height={34}
                    className="partner-inner-logo"
                  />

                  <button
                    id="wallpaper"
                    onClick={() => handlePartnerClick("wallpaper")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="max-md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"></div>
        <div
          id="robb"
          className="group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] max-md:p-3 border-t border-r border-r-brown border-t-brown p-6 flex items-center justify-center"
        >
          {partnersArray[2]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[2]?.Logo
                      ? ASSET_URL + partnersArray[2].Logo.url
                      : "/icons/partners/logo-3.svg"
                  }
                  alt="logo"
                  width={140}
                  height={26}
                />
                <button
                  id="robb"
                  onClick={() => handlePartnerClick("robb")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "robb"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[2]?.Description || ""}
                </p>
                <div className="flex items-end max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[2]?.Logo
                        ? ASSET_URL + partnersArray[2].Logo.url
                        : "/icons/partners/logo-3.svg"
                    }
                    alt="logo"
                    width={140}
                    height={26}
                    className="partner-inner-logo"
                  />
                  <button
                    id="robb"
                    onClick={() => handlePartnerClick("robb")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"></div>
        <div
          id="dezeen"
          className=" group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] max-md:p-3 border-t border-r border-r-brown border-t-brown p-6 flex items-center justify-center"
        >
          {partnersArray[3]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[3]?.Logo
                      ? ASSET_URL + partnersArray[3].Logo.url
                      : "/icons/partners/logo-4.svg"
                  }
                  alt="logo"
                  width={94}
                  height={48}
                />
                <button
                  id="dezeen"
                  onClick={() => handlePartnerClick("dezeen")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "dezeen"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[3]?.Description || ""}
                </p>
                <div className="flex items-start max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[3]?.Logo
                        ? ASSET_URL + partnersArray[3].Logo.url
                        : "/icons/partners/logo-4.svg"
                    }
                    alt="logo"
                    width={94}
                    height={48}
                    className="partner-inner-logo"
                  />

                  <button
                    id="dezeen"
                    onClick={() => handlePartnerClick("dezeen")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="vogue"
          className=" group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] max-md:p-3 border-t border-r border-r-brown border-t-brown p-6 flex items-center justify-center"
        >
          {partnersArray[4]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[4]?.Logo
                      ? ASSET_URL + partnersArray[4].Logo.url
                      : "/icons/partners/logo-5.svg"
                  }
                  alt="logo"
                  width={136}
                  height={36}
                />
                <button
                  id="vogue"
                  onClick={() => handlePartnerClick("vogue")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "vogue"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[4]?.Description || ""}
                </p>
                <div className="flex items-start max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[4]?.Logo
                        ? ASSET_URL + partnersArray[4].Logo.url
                        : "/icons/partners/logo-1-f.svg"
                    }
                    alt="logo"
                    width={107}
                    height={48}
                    className="max-md:w-[45%]"
                  />

                  <button
                    id="vogue"
                    onClick={() => handlePartnerClick("vogue")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="i-d"
          className=" group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] max-md:p-3 border-t border-r border-r-brown border-t-brown p-6 flex items-center justify-center"
        >
          {partnersArray[5]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[5]?.Logo
                      ? ASSET_URL + partnersArray[5].Logo.url
                      : "/icons/partners/logo-6.svg"
                  }
                  alt="logo"
                  width={78}
                  height={48}
                />
                <button
                  id="i-d"
                  onClick={() => handlePartnerClick("i-d")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "i-d"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[5]?.Description || ""}
                </p>
                <div className="flex items-start max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[5]?.Logo
                        ? ASSET_URL + partnersArray[5].Logo.url
                        : "/icons/partners/logo-6.svg"
                    }
                    alt="logo"
                    width={78}
                    height={48}
                    className="partner-inner-logo"
                  />

                  <button
                    id="i-d"
                    onClick={() => handlePartnerClick("i-d")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="empty-cell"
          className="max-md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"
        ></div>
        <div
          id="empty-cell"
          className="max-md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"
        ></div>
        <div
          id="bugatti"
          className="group relative flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] max-md:p-3 border-t border-r border-r-brown border-t-brown p-6 flex items-center justify-center"
        >
          {partnersArray[6]?.Logo && (
            <>
              <div className="flex flex-col gap-[104px] items-center w-full">
                <Image
                  src={
                    partnersArray[6]?.Logo
                      ? ASSET_URL + partnersArray[6].Logo.url
                      : "/icons/partners/logo-7.svg"
                  }
                  alt="logo"
                  width={120}
                  height={86}
                />
                <button
                  id="bugatti"
                  onClick={() => handlePartnerClick("bugatti")}
                  className="p-2.5 rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="#F7F7EB"
                      className="group-hover:fill-wine duration-400 ease-[--ease-in]"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`group absolute inset-0 bg-textWhite p-6 max-md:p-3 flex flex-col gap-24 max-md:gap-1.5 items-end justify-end max-md:hidden ${
                  activePartner === "bugatti"
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                } transition-opacity duration-400`}
              >
                <p className="text-14 text-dark">
                  {partnersArray[6]?.Description || ""}
                </p>
                <div className="flex items-start max-md:items-end justify-between w-full">
                  <Image
                    src={
                      partnersArray[6]?.Logo
                        ? ASSET_URL + partnersArray[6].Logo.url
                        : "/icons/partners/logo-7.svg"
                    }
                    alt="logo"
                    width={120}
                    height={86}
                    className="partner-inner-logo max-md:w-[45%]"
                  />
                  <button
                    id="bugatti"
                    onClick={() => handlePartnerClick("bugatti")}
                    className="relative p-2.5 rounded-full border border-beige ml-auto"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 group-hover:scale-100 transition-transform duration-400 ease-[--ease-in]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative"
                    >
                      <path
                        d="M5.83203 10.4163V9.58301H14.1654V10.4163H5.83203Z"
                        fill="#10070B"
                        className="group-hover:fill-textWhite duration-400 ease-[--ease-in]"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="md:hidden flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown"></div>

        <div className="flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 h-[384px] max-md:h-[250px] border-t border-r border-r-brown border-t-brown flex items-center justify-center">
          <ButtonLink tag="a" text={"all Partners"} href="/partners" />
        </div>
      </div>
      <Image
        src={bgImg ? bgImg : "/images/pr-with-mkaan/pr.jpg"}
        fill
        alt="bg image"
        className="object-cover !h-[120%] will-change-transform [transform:translateZ(0)]"
        ref={partnersImage}
      />
      <div className="absolute inset-0 partner-overlay"></div>
      <div className="absolute inset-0 bg-bgOverlay12"></div>
      <div className="absolute h-[200px] partner-overlay-mob md:hidden"></div>
      {isMobile &&
        isMobileModalOpen &&
        activePartner &&
        (() => {
          const { partner, fallbackSrc, width, height } =
            getPartnerConfig(activePartner);

          if (!partner) return null;

          return (
            <div className="fixed inset-0 z-40 bg-menuOverlay flex items-end justify-start">
              <div
                className="absolute inset-0"
                onClick={handleCloseMobileModal}
              ></div>
              <div className="relative z-10 w-full max-w-[344px] bg-textWhite text-dark p-4 pt-[132px]">
                <button
                  type="button"
                  onClick={handleCloseMobileModal}
                  className="absolute top-4 right-4 p-2.5 rounded-full border border-beige text-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5.33198 15.2566L4.74219 14.6668L9.40885 10.0001L4.74219 5.33344L5.33198 4.74365L9.99865 9.41032L14.6653 4.74365L15.2551 5.33344L10.5884 10.0001L15.2551 14.6668L14.6653 15.2566L9.99865 10.5899L5.33198 15.2566Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <p className="text-14 mb-[68px]">{partner.Description || ""}</p>
                <div className="flex items-end justify-between">
                  <Image
                    src={
                      partner.Logo ? ASSET_URL + partner.Logo.url : fallbackSrc
                    }
                    alt="logo"
                    width={width}
                    height={height}
                    className="partner-inner-logo"
                  />
                </div>
              </div>
            </div>
          );
        })()}
      <div
        ref={partnersInner}
        className="max-md:hidden absolute bottom-0 left-0 w-1/2 max-lg:w-2/3 h-[384px] pl-[120px] py-6 "
      >
        <div className="relative z-10 flex flex-col justify-between h-full pl-6 border-l border-l-dark/10 text-dark max-w-[300px]">
          <p className="text-20 ">
            {data?.Title_lower ||
              "Every Mkaan residence is the result of true partnership"}
          </p>
          <p className="text-14">
            {data?.Description ||
              " We collaborate with the world’s most respected design and technology brands to deliver homes defined by craftsmanship, performance, and timeless beauty."}
          </p>
        </div>
        <div className="[@media(max-width:1439px)]:hidden bg-textWhite absolute inset-0 w-[90%]"></div>
        <Image
          src={"/icons/mask/4.svg"}
          fill
          alt="decor"
          className="w-full h-full max-lg:object-contain max-lg:object-bottom-right [@media(min-width:1440px)]:object-contain [@media(min-width:1440px)]:object-right"
        />
      </div>
      <div
        ref={partnersInnerMob}
        className="md:hidden relative py-4 pl-4 z-10 will-change-[bottom,transform] [transform:translateZ(0)]"
      >
        <div className="relative z-10 flex flex-col justify-between gap-[216px] h-full pl-4 border-l border-l-dark/10 text-dark max-w-[315px]">
          <p className="text-20 ">
            {data?.Title_lower ||
              "Every Mkaan residence is the result of true partnership"}
          </p>
          <p className="text-14">
            {data?.Description ||
              " We collaborate with the world’s most respected design and technology brands to deliver homes defined by craftsmanship, performance, and timeless beauty."}
          </p>
        </div>
        <Image
          src={"/icons/mask/4.svg"}
          fill
          alt="decor"
          className="w-full h-full object-cover object-[97%_50%]"
        />
      </div>
    </section>
  );
};

export default HomePartners;
