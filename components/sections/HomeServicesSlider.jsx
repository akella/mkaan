"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HomeServicesSketch from "@/lib/three/HomeServicesSketch";
import Image from "next/image";
import SliderNavButton from "../ui/SliderNavButton";

const HomeServicesSlider = ({ data = [], hideUiInitially = false }) => {
  const containerRef = useRef(null);
  const sketchRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const titles = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => item?.Title ?? item?.title ?? item?.name)
      .filter(Boolean);
  }, [data]);

  useEffect(() => {
    if (!containerRef.current || titles.length === 0) {
      return undefined;
    }

    const sketch = new HomeServicesSketch(containerRef.current, {
      titles,
      repeat: 2,
      onIndexChange: (oneBasedIndex) => setCurrent(oneBasedIndex),
    });
    sketchRef.current = sketch;

    return () => {
      sketch.dispose();
      sketchRef.current = null;
    };
  }, [titles]);

  const handleNext = () => {
    sketchRef.current?.next();
  };

  const handlePrev = () => {
    sketchRef.current?.prev();
  };

  const sliderUiOpacityClass = hideUiInitially ? "opacity-0" : "opacity-100";

  return (
    <section data-slider-section className="relative transform md:scale-[1.3] md:will-change-transform h-screen md:pl-6 md:pr-9 max-md:px-4 max-md:pb-[26px] overflow-hidden flex items-center max-md:items-end justify-center max-md:justify-baseline max-md:bg-wine">
      <div
        data-slider-content
        className={`absolute inset-0 z-20 md:flex md:items-center ${sliderUiOpacityClass}`}
      >
        <div
          ref={containerRef}
          className="absolute z-10 max-md:z-30 top-0 left-0 right-0 bottom-0 max-md:left-4 max-md:right-4 max-md:bottom-[3%] pointer-events-none"
          aria-hidden
        />
        <div className="absolute inset-0 partner-overlay pointer-events-none z-20 max-md:w-[calc(100%-32px)] max-md:h-[97%] mx-auto-mobile" />
        <div className="relative px-6 max-md:px-4 max-md:pb-4 z-20 flex items-center justify-between w-full max-md:flex-col-reverse max-md:gap-[350px] max-md:items-start max-sm:gap-0 max-md:h-[97%]">
          <div className="flex max-md:px-4 items-center max-md:flex-row-reverse max-md:justify-between max-md:w-full gap-14">
            <div className="flex md:flex-col items-center gap-6 max-md:gap-2">
              <SliderNavButton
                onClick={handlePrev}
                className="border-brownDark max-md:-rotate-90"
                ariaLabel="Previous service"
                showFill={false}
                iconClassName=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.58464 15.8337V5.76803L4.75776 10.5949L4.16797 10.0003L10.0013 4.16699L15.8346 10.0003L15.2448 10.5949L10.418 5.76803V15.8337H9.58464Z"
                    fill="#F7F7EB"
                  />
                </svg>
              </SliderNavButton>
              <div className="w-1 h-1 bg-textWhite rounded-full max-md:hidden"></div>
              <SliderNavButton
                onClick={handleNext}
                className="border-brownDark max-md:-rotate-90"
                ariaLabel="Next service"
                showFill={false}
                iconClassName=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.58464 4.16699V14.2326L4.75776 9.40574L4.16797 10.0003L10.0013 15.8337L15.8346 10.0003L15.2448 9.40574L10.418 14.2326V4.16699H9.58464Z"
                    fill="#F7F7EB"
                  />
                </svg>
              </SliderNavButton>
            </div>
            <div className="flex items-center gap-0.5">
              <p className="max-md:hidden">Services</p>
              <div className="flex items-center gap-1 text-14">
                <p>{current}</p>
                <p>-</p>
                <p>{titles.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image
        src={"/images/services-image.jpg"}
        alt="slider image"
        fill
        data-slider-image
        className="object-cover max-md:object-[32%_40%] max-md:px-4 max-md:!h-[97%]"
        quality={100}
      />
    </section>
  );
};

export default HomeServicesSlider;
