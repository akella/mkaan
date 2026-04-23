"use client";
import Image from "next/image";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import AnimatedImage from "../ui/AnimatedImage";

import FAQAccordion from "../ui/FAQAccordion";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const mockData = [
  {
    img: "/images/dev/1.jpg",
    title: "Business Development",
    text: `We create distinctive branded concepts and establish powerful partnerships — like the Waldorf Astoria Residences — that define new benchmarks in luxury living and investment potential.`,
  },
  {
    img: "/images/dev/2.jpg",
    title: "Consultant Selection",
    text: `Waldorf Astoria Residences — that define new benchmarks in luxury living and investment potential.`,
  },
  {
    img: "/images/dev/3.jpg",
    title: "Design Development",
    text: `We create distinctive branded concepts and establish powerful partnerships — like the Waldorf Astoria Residences`,
  },
  {
    img: "/images/dev/1.jpg",
    title: "Marketing & Sales",
    text: `We create distinctive branded concepts and establish powerful partnerships — like the Waldorf Astoria Residences — that define new benchmarks in luxury living and investment potential.`,
  },
  {
    img: "/images/dev/2.jpg",
    title: "Delivery & Financial Return",
    text: `That define new benchmarks in luxury living and investment potential.`,
  },
];

const DevelopmentList = ({ data }) => {
  const rootBlock = useRef(null);
  const devList = useRef(null);
  const imageTrackRef = useRef(null);
  const textBlock = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  const animateImageTrack = (index) => {
    if (!imageTrackRef.current) {
      return;
    }

    gsap.killTweensOf(imageTrackRef.current);
    gsap.to(imageTrackRef.current, {
      duration: 1.4,
      xPercent: -index * 100,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      const animateContent = () => {
        if (!textBlock.current) {
          return;
        }

        gsap.fromTo(
          textBlock.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      };

      mm.add("(min-width: 1024px)", () => {
        const listNode = devList.current;
        const sectionNode = rootBlock.current;

        if (!listNode || !sectionNode) {
          return;
        }

        const listItems = gsap.utils.toArray(listNode.querySelectorAll("li"));
        if (!listItems.length) {
          return;
        }

        const stepSize =
          listItems.length > 1
            ? Math.abs(listItems[1].offsetTop - listItems[0].offsetTop)
            : listItems[0].getBoundingClientRect().height;

        if (!stepSize) {
          return;
        }

        const stepsCount = data.length - 1;
        const scrollDistance = Math.max(stepsCount, 1) * 100;

        gsap.set(listNode, { y: 0 });
        let currentIndex = activeIndex;

        animateImageTrack(currentIndex);
        animateContent();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionNode,
            start: "top top",
            end: `+=${scrollDistance}%`,
            pin: true,
            pinSpacer: false,
            scrub: true,
            onUpdate: () => {
              const shift =
                Math.abs(Number(gsap.getProperty(listNode, "y"))) || 0;
              const rawIndex = shift / stepSize;
              const nextIndex = Math.min(stepsCount, Math.round(rawIndex));

              if (nextIndex !== currentIndex) {
                setSlideDirection(nextIndex > currentIndex ? -1 : 1);
                currentIndex = nextIndex;
                flushSync(() => setActiveIndex(nextIndex));
                animateImageTrack(nextIndex);
                animateContent();
              }
            },
          },
        });

        // Move list with a single continuous tween tied to scroll.
        tl.to(listNode, {
          y: -stepSize * stepsCount,
          ease: "none",
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    [],
    rootBlock,
  );

  const activeItem = data[activeIndex] ?? data[0];
  const getOpacityClass = (index) => {
    if (index === activeIndex) return "opacity-100";
    if (Math.abs(index - activeIndex) === 1) return "opacity-20";
    return "opacity-10";
  };
  const accordionItems = data.map((item) => ({
    question: item.Title,
    answer: (
      <div className="flex flex-col gap-6">
        <Image
          src={ASSET_URL + item.Photo.url}
          alt={item.Title}
          width={192}
          height={240}
          quality={100}
        />
        <p className="text-14">{item.Description}</p>
      </div>
    ),
  }));
  return (
    <section
      ref={rootBlock}
      className="lg:h-screen bg-dark lg:flex lg:flex-col lg:justify-end pl-36 max-lg:pl-9 pr-24 max-lg:pr-9 max-md:px-4 overflow-clip max-md:pt-32 max-lg:pb-20 pb-[120px]"
    >
      <div className="max-lg:hidden relative flex gap-24 justify-between h-[65.5%] [@media(max-height:770px)_and_(min-width:1024px)]:h-[75%] before:absolute before:content-[''] before:-top-6 before:left-0 before:w-[95%] before:h-px before:bg-brownDark before:z-10 before:pointer-events-none">
        <div className="flex flex-col justify-between pb-6 gap-36 max-w-[312px]">
          <div className="w-[192px] h-[240px] overflow-hidden">
            <div
              ref={imageTrackRef}
              className="flex h-full w-full"
              style={{ willChange: "transform" }}
            >
              {data.map((item, index) => (
                <div
                  key={`${item.Title}-${index}`}
                  className="relative h-full w-full flex-shrink-0 overflow-clip"
                >
                  {/* <AnimatedImage> */}
                  <Image
                    src={
                      item?.Photo?.url
                        ? ASSET_URL + item.Photo.url
                        : "/images/dev/1.jpg"
                    }
                    alt={item?.Title || `Development slide ${index + 1}`}
                    fill
                    sizes="192px"
                    quality={100}
                    className={`object-cover ${
                      activeIndex === index ? "scale-x-100" : "scale-x-125"
                    } duration-1600 transition-all ${
                      slideDirection === -1 ? "origin-right" : "origin-left"
                    }`}
                    priority={index === 0}
                  />
                  {/* </AnimatedImage> */}
                </div>
              ))}
            </div>
          </div>
          <div ref={textBlock}>
            <p className="text-14">{activeItem.Description}</p>
          </div>
        </div>
        <ul
          ref={devList}
          className="max-w-[720px] w-full text-100 flex flex-col gap-6"
        >
          {data.map((item, index) => (
            <li
              key={item.Title}
              className={`transition-opacity duration-300 ${getOpacityClass(
                index,
              )}`}
            >
              {item.Title}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:hidden w-full">
        <FAQAccordion
          items={accordionItems}
          className="border-t border-b border-brownDark"
          itemClassName="border-b border-brownDark last:border-b-0"
          buttonClassName="w-full flex items-center justify-between gap-18 py-5 text-left"
          questionClassName="text-28"
          answerClassName="pt-[64px] pb-8 text-14 flex flex-col gap-6"
        />
      </div>
    </section>
  );
};
export default DevelopmentList;
