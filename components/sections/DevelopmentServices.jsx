"use client";
import Image from "next/image";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import CustomEase from "gsap/CustomEase";
import AnimatedImage from "../ui/AnimatedImage";
import parse from "html-react-parser";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const DevelopmentServices = ({ data }) => {
  const leftText = useRef(null);
  const rightText = useRef(null);
  const devSection = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    CustomEase.create("custom", "0.5,0,0.75,0");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: devSection.current,
          start: "-20% top",
          end: "center 20%",
          scrub: true,
          ease: "custom",
          duration: 1.2,
          // markers: true,
        },
      });

      tl.to(
        leftText.current,
        { xPercent: 200, ease: "custom", duration: 1.2 },
        0,
      ).to(
        rightText.current,
        { xPercent: -200, ease: "custom", duration: 1.2 },
        0,
      );
    });
  }, []);
  return (
    <section
      ref={devSection}
      className="relative bg-dark py-36 max-md:py-24 text-textWhite flex flex-col items-center overflow-clip px-4"
    >
      <div className="flex flex-col gap-6 items-center max-w-[560px] max-md:text-center max-sm:max-w-[320px]">
        <p className="text-11 opacity-40">{data.Title}</p>
        <h2 className="title-h2">{parse(data.Description)}</h2>
      </div>
      <AnimatedImage rootClass={"mt-[72px] max-md:mt-16 max-sm:w-[75%]"}>
        <Image
          src={data.Photo ? ASSET_URL + data.Photo.url : "/images/case-2.jpg"}
          width={432}
          height={552}
          alt="place iamge"
          quality={100}
        />
      </AnimatedImage>
      <div className="[&_p]:first-letter:!text-[40px] [&_p]:first-letter:leading-[40px] sm:pl-6 flex flex-col gap-6 sm:max-w-[330px] sm:border-l sm:border-l-brownDark sm:ml-24 mt-12 max-md:mt-10 text-14">
        {parse(data.Bottom_description)}
      </div>
      <Image
        src={"/icons/legacy.svg"}
        alt="legacy icon"
        width={840}
        height={230}
        className="absolute left-6 top-[485px] -z-10 max-md:hidden"
        ref={leftText}
        quality={100}
      />
      <Image
        src={"/icons/formed.svg"}
        alt="formed icon"
        width={953}
        height={230}
        className="absolute right-6 top-[679px] -z-10 max-md:hidden"
        ref={rightText}
      />
    </section>
  );
};

export default DevelopmentServices;
