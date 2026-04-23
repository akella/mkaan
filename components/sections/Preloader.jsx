"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/SplitText";

const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const PRELOADER_COOKIE_KEY = "mkaan_preloader_seen";
const PRELOADER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const MAIN_HERO_SECTION_ID = "main-hero-section";

const Preloader = ({ data }) => {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
  const imagesWrapper = useRef(null);
  const firstImage = useRef(null);
  const textsRef = useRef(null);
  const leftDot = useRef(null);
  const rightDot = useRef(null);
  const textsWrap = useRef(null);
  const counter = useRef(null);
  const [shouldShowPreloader, setShouldShowPreloader] = useState(null);

  const durS = 0.4;
  const durM = 0.8;
  const durL = 1.2;
  const stagger = 0.1;
  const delayReveal = 0.2;
  const getWordsFromHtml = (html) => {
    let textOnly = html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/?p[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, "");

    textOnly = textOnly.replace(/\s+/g, " ").trim();

    return textOnly.split(" ");
  };

  const text = data.Words;
  const wordsArray = getWordsFromHtml(text);

  useEffect(() => {
    const hasPreloaderCookie = document.cookie
      .split("; ")
      .some((cookieRow) => cookieRow.startsWith(`${PRELOADER_COOKIE_KEY}=1`));

    if (hasPreloaderCookie) {
      const mainHeroSection = document.getElementById(MAIN_HERO_SECTION_ID);
      if (mainHeroSection) {
        mainHeroSection.style.pointerEvents = "auto";
      }
    }

    setShouldShowPreloader(!hasPreloaderCookie);
  }, []);

  useGSAP(() => {
    if (!shouldShowPreloader) {
      return;
    }

    CustomEase.create("InOut", "0.76,0,0.24,1");
    CustomEase.create("Out", "0.25,1,0.5,1");
    CustomEase.create("In", "0.5,0,0.75,0");
    CustomEase.create("ease", "0.25,0.1,0.25,1");
    CustomEase.create("Write", "0.333,0,0.667,1");

    const words = gsap.utils.toArray(".js-preloader-word");
    const wordWrappers = gsap.utils.toArray(".js-word-wrapper");

    const images = gsap.utils.toArray(".js-preloader-images");
    const gaps = gsap.utils.toArray(".js-preloader-gap");
    const nextSection = textsRef.current
      ? textsRef.current.nextElementSibling
      : null;

    gsap.set(imagesWrapper.current, { clipPath: "inset(0% 0% 100% 0%)" });

    const tl = gsap.timeline({ defaults: { ease: "Out", duration: durL } });

    const counterElement = counter.current
      ? counter.current.querySelector("p")
      : null;

    let hasHiddenCounter = false;

    if (counterElement) {
      gsap.set(counterElement, { textContent: 0, opacity: 1 });
      tl.eventCallback("onUpdate", () => {
        const progress = tl.progress();
        const normalized = Math.min(progress / 0.7, 1); // 0–100 за перші ~70–80% tl
        const value = Math.round(normalized * 100);
        counterElement.textContent = value.toString();

        if (!hasHiddenCounter && normalized >= 1) {
          hasHiddenCounter = true;
          gsap.to(counter.current, {
            opacity: 0,
            duration: 1,
            ease: "Out",
          });
        }
      });
    }

    tl.to(imagesWrapper.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "InOut",
      duration: 2.2,
    })
      .to(
        firstImage.current,
        {
          scale: 1,
          ease: "InOut",
          duration: 2.2,
        },
        0,
      )
      .to(
        words,
        {
          // opacity: 0,
          y: 0,
          stagger: stagger,
          ease: "Out",
          duration: 1.2,
        },
        `-=0.4`,
      )
      .to(
        [leftDot.current, rightDot.current],
        {
          opacity: 1,

          ease: "Out",
          duration: 1.2,
        },
        `-=0.8`,
      )
      .to(
        images,
        {
          scale: 1,
          stagger: 0.2,
          ease: "Out",
          duration: 1.2,
        },
        `-=0.5`,
      )
      .from(
        wordWrappers,
        {
          yPercent: 100,
          // opacity: 0,
          ease: "InOut",
          duration: 1.2,
          stagger: 0.1,
        },
        "<",
      )

      .to(
        gaps,
        {
          gap: "4px",
          ease: "InOut",
          duration: 1.2,
        },
        `-=0.5`,
      )
      .to(
        leftDot.current,
        {
          left: "-8px",
          ease: "InOut",
          duration: 1.2,
        },
        "<",
      )
      .to(
        rightDot.current,
        {
          right: "-8px",
          ease: "InOut",
          duration: 1.2,
        },
        "<",
      )
      .to(
        imagesWrapper.current,
        {
          scale: 0,
          ease: "InOut",
          duration: 1.2,
          // delay: delayReveal,
        },
        `-=1.2`,
      )
      .to(
        textsRef.current,
        {
          scale: 0,
          ease: "InOut",
          duration: 1.2,
          // delay: delayReveal,
        },
        `+=0.1`,
      )
      .fromTo(
        nextSection,
        {
          transform:
            "perspective(10000px) translate3d(0, 100vh, 500rem) perspective(4000px)",
          transformOrigin: "50% 50%",
          force3D: true,
         
        },
        {
          transform: "perspective(5882.35px) rotateX(180deg) scale(1, -1)",
          ease: "InOut",
          duration: durL,
         onComplete: () => {
          nextSection.style.pointerEvents = "auto";
         }
        },
        `-=0.3`,
      );

    tl.eventCallback("onComplete", () => {
      document.cookie = `${PRELOADER_COOKIE_KEY}=1; max-age=${PRELOADER_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
      setShouldShowPreloader(false);
    });

    return () => {
      tl.kill();
    };
  }, [shouldShowPreloader]);

  if (!shouldShowPreloader) {
    return null;
  }

  const otherImages = data.Slider ? data.Slider.slice(1) : [];

  return (
    <div ref={textsRef} className="fixed inset-0 bg-dark z-50">
      <div
        ref={imagesWrapper}
        className="absolute transform translate-x-0.5 inset-0 m-auto w-[204px] max-md:w-[151px] h-[260px] max-md:h-[192px] overflow-clip"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <Image
          ref={firstImage}
          fill
          src={data.Slider ? ASSET_URL + data.Slider[0].url : ""}
          alt={
            data.Slider
              ? data.Slider[0].alt || "Preloader Image"
              : "Preloader Image"
          }
          className="object-cover scale-150"
          quality={100}
        />
        {otherImages.map((item, index) => (
          <Image
            key={index}
            fill
            src={item.url ? ASSET_URL + item.url : ""}
            alt={item.alt || "Preloader Image"}
            className="object-cover js-preloader-images scale-0"
            quality={100}
          />
        ))}
      </div>
      <div
        ref={textsWrap}
        className="absolute inset-0 m-auto h-fit flex flex-col gap-[192px] max-md:gap-[152px] js-preloader-gap items-center text-center"
      >
        <div className="flex flex-col gap-[72px] js-preloader-gap">
          <div className="overflow-clip js-word-wrapper">
            <p className="text-14 text-textWhite js-preloader-word translate-y-5">
              {wordsArray[0]}
            </p>
          </div>
          <div className="flex gap-[176px] max-md:gap-16 js-preloader-gap js-word-wrapper">
            <div className="overflow-clip ">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[1]}
              </p>
            </div>
            <div className="overflow-clip">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[2]}
              </p>
            </div>
            <div className="overflow-clip">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[3]}
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-[144px] js-preloader-gap">
          <div
            ref={leftDot}
            className="absolute left-[-144px] w-1 h-1 bg-textWhite rounded-full opacity-0"
          ></div>
          <div className="flex gap-[556px] max-md:gap-[199px] js-preloader-gap js-word-wrapper">
            <div className="overflow-clip ">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[4]}
              </p>
            </div>
            <div className="overflow-clip ">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[5]}
              </p>
            </div>
          </div>
          <div
            ref={rightDot}
            className="absolute right-[-144px] w-1 h-1 bg-textWhite rounded-full opacity-0"
          ></div>
        </div>
        <div className="flex flex-col gap-[72px] js-preloader-gap">
          <div className="flex gap-[176px] max-md:gap-16 js-preloader-gap js-word-wrapper">
            <div className="overflow-clip ">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[6]}
              </p>
            </div>
            <div className="overflow-clip">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[7]}
              </p>
            </div>
            <div className="overflow-clip">
              <p className="text-14 text-textWhite js-preloader-word translate-y-5">
                {wordsArray[8]}
              </p>
            </div>
          </div>
          <div className="overflow-clip ">
            <p className="text-14 text-textWhite js-preloader-word translate-y-5">
              {wordsArray[9]}
            </p>
          </div>
        </div>
      </div>
      <div ref={counter} className="absolute flex bottom-6 right-6">
        <p>0</p>
        <span>%</span>
      </div>
    </div>
  );
};
export default Preloader;
