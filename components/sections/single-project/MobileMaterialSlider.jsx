"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useRef, useState } from "react";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MATERIAL_SLIDES = [
  {
    img: "/images/single-pr/materials/1.jpg",
    title: "textile",
  },
  {
    img: "/images/single-pr/materials/2.jpg",
    title: "onyx light panel",
  },
  {
    img: "/images/single-pr/materials/3.jpg",
    title: "textile",
  },
  {
    img: "/images/single-pr/materials/4.jpg",
    title: "glass bricks",
  },
  {
    img: "/images/single-pr/materials/5.jpg",
    title: "stone №1",
  },
  {
    img: "/images/single-pr/materials/6.jpg",
    title: "stone №2",
  },
];

const MobileMaterialSlider = ({ data }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = data.length;
  return (
    <div className="relative mt-8 md:hidden">
      <Swiper
        spaceBetween={12}
        slidesPerView={1.15}
        centeredSlides={true}
        centeredSlidesBounds={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const nextIndex = swiper.realIndex ?? swiper.activeIndex ?? 0;
          setActiveIndex(nextIndex);
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper !px-4"
      >
        {data.map((slide, index) => (
          <SwiperSlide key={`${slide.title}-${index}`}>
            <div className="p-4 border border-brownDark">
              {slide.Media && (
                <div>
                  <Image
                    src={`${ASSET_URL}${slide.Media.url}`}
                    width={264}
                    height={284}
                    alt={`${slide.title} material`}
                    className="w-full object-cover"
                    quality={100}
                  />
                </div>
              )}
              <h3 className="mt-4 text-11">{slide.Title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between px-4 mt-6">
        <div className="flex items-center gap-1 text-14">
          <p>{activeIndex + 1}</p>
          <p>-</p>
          <p>{totalSlides}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="previous slide"
            className="text-textWhite p-2.5 rounded-full border border-brownDark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.76901 10.4165L10.5959 15.2434L10.0013 15.8332L4.16797 9.99984L10.0013 4.1665L10.5959 4.7563L5.76901 9.58317H15.8346V10.4165H5.76901Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="next slide"
            className="text-textWhite p-2.5 rounded-full border border-brownDark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.2297 10.418H4.16406V9.58464H14.2297L9.40281 4.75776L9.9974 4.16797L15.8307 10.0013L9.9974 15.8346L9.40281 15.2448L14.2297 10.418Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMaterialSlider;
