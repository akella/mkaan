"use client";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeServicesSlider from "@/components/sections/HomeServicesSlider";

const HomeServices = ({ data, sliderData = [] }) => {
  const splitTitle = data.Middle_title.split("\n");
  const sliderHoldDuration = 0.35;

  const servicesRef = useRef(null);
  const infoCardRef = useRef(null);
  const topTitle = useRef(null);
  const bottomTitle = useRef(null);
  const sliderRef = useRef(null);
  const leftText = useRef(null);
  const rightText = useRef(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const sliderUiRef = sliderRef.current?.querySelector(
        "[data-slider-content]",
      );
        const sliderUiSectionRef = sliderRef.current?.querySelector(
        "[data-slider-section]",
      );
      const sliderImageRef = sliderRef.current?.querySelector(
        "[data-slider-image]",
      );
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          // pinSpacing: false,
          // pinSpacer: false,
        },
      });
      tl.to(infoCardRef.current, { scale: 1, ease: "none", duration: 1 }, 0)
        .to(leftText.current, { x: 0, duration: 1.4 }, 0)
        .to(rightText.current, { x: 0, duration: 1.4 }, 0)
        .to(topTitle.current, { y: "-32vh", duration: 1.4 }, 0)
        .to(bottomTitle.current, { y: "32vh", duration: 1.4 }, 0)
        .to(sliderRef.current, { scale: 0.1, ease: "none", duration: 1 }, 0)
        .to(sliderUiSectionRef, {
          scale: 1.2,
          duration: 1,
          ease: "none",
        }, 0)
        .fromTo(
          sliderImageRef,
          { scale: 1.3 },
          { scale: 1.2, duration: 1, ease: "none" },
          0,
        )
        .to(
          sliderRef.current,
          {
            scale: 1,
            duration: 2,
          },
          1.05,
        )
        .to(
          sliderUiSectionRef,
          {
            scale: 1,
            duration: 2,
          },
          1.05,
        )
        .to(
          sliderImageRef,
          {
            scale: 1,
            duration: 2,
          },
          1.05,
        )
        .to(
          sliderUiRef,
          {
            opacity: 1,
            duration: 0.85,
            ease: "power1.out",
          },
          ">-1.55",
        )
        .to({}, { duration: sliderHoldDuration });
    });

    return () => mm.revert();
  }, []);
  return (
    <section
      ref={servicesRef}
      className="relative overflow-clip flex max-md:flex-col max-md:gap-8 items-center md:h-screen max-md:pt-[88px] max-md:pb-[16px] px-6 max-md:px-[16px] md:bg-[radial-gradient(85.67%_97.28%_at_100%_0%,_#592D42_0%,_var(--Wine-Shadow,_#3A1A29)_100%)] max-md:bg-wine"
    >
      <div className="relative z-10 flex max-md:flex-col max-md:gap-4 items-center max-md:items-start justify-between max-md:justify-center w-full max-md:pl-4 max-md:border-l max-md:border-brownDark">
        <p className="text-14 md:hidden">Services We Offer</p>
        <p
          ref={leftText}
          className="max-md:hidden transform translate-x-[170px]"
        >
          {data.Short_title_left}
        </p>
        <div className="title-h2 md:text-center">
          <p ref={topTitle}>{splitTitle[0]}</p>
          <p ref={bottomTitle}>{splitTitle[1]}</p>
        </div>
        <p
          ref={rightText}
          className="max-md:hidden transform translate-x-[-170px]"
        >
          {data.Short_title_right}
        </p>
        <p className="md:hidden mt-24">
          Design Vision Defines the Beginning, Precision Defines the Result.
          Each Mkaan Project is Built with Mastery that Endures. Precision
        </p>
      </div>
      <div
        ref={infoCardRef}
        className="max-md:hidden absolute max-md:relative max-md:pt-12 max-md:pb-[43px] max-md:!w-full z-10 left-1/2 max-md:left-0 top-1/2 max-md:top-0 max-md:-translate-x-0 max-md:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-[28.1%] [@media(max-width:950px)]:w-[35%] h-[60.6%] md:scale-0"
      >
        <div className="relative z-10 flex flex-col gap-4 md:gap-[108px] justify-center items-center h-full text-wine">
          <div className="flex flex-col gap-4 items-center text-14 max-w-[240px] w-full text-center">
            <p className="md:mr-auto">Design</p>
            <p>
              Vision Defines <br /> the Beginning, Precision <br /> Defines the
              Result.
            </p>
          </div>
          <div className="md:hidden relative max-w-[240px] max-md:overflow-hidden [@media(max-width:1135px)]:max-w-[160px] [@media(max-width:1135px)]:max-h-[98px] max-h-[148px]">
            <Image
              src={"/images/services-image.jpg"}
              alt="services image"
              width={1920}
              height={720}
              quality={100}
              className="h-full max-md:object-bottom max-md:object-cover"
            />
          </div>
          <div className="flex flex-col gap-4 items-center text-14 max-w-[240px] w-full text-center">
            <p>
              Each Mkaan Project <br /> is Built with Mastery <br /> that
              Endures.
            </p>
            <p className="md:ml-auto">Precision</p>
          </div>
        </div>
        <Image
          src={"/icons/mask/5.svg"}
          fill
          alt="decor"
          className="max-md:object-cover max-sm:hidden"
        />
        <Image
          src={"/icons/mask/5-mob.svg"}
          fill
          alt="decor"
          className="sm:hidden"
        />
      </div>
      {/* <p className=" max-md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-230 !text-[312px] max-md:!text-[176px] max-md:rotate-90 text-bigWhite bg-clip-text opacity-[0.75] mix-blend-overlay [text-shadow:2px_-1px_1px_rgba(255,255,255,0.20),-2px_1px_2px_rgba(0,0,0,0.35)]">
        Services
      </p> */}
      <Image
        src={"/icons/services.svg"}
        width={1440}
        height={312}
        alt="services icon"
        className="max-md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={sliderRef}
        className="max-md:hidden overflow-clip absolute inset-0 z-20 transform scale-0"
      >
        <HomeServicesSlider data={sliderData} hideUiInitially />
      </div>
    </section>
  );
};

export default HomeServices;
