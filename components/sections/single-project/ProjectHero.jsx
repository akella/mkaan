"use client";

import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import parse, { domToReact } from "html-react-parser";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const ProjectHero = ({ data }) => {
  const renderWithoutSpans = (html) => {
    if (!html) return null;

    return parse(html, {
      replace: (domNode) => {
        if (domNode.type === "tag" && domNode.name === "span") {
          return <>{domToReact(domNode.children)}</>;
        }
      },
    });
  };
  const prHeroRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const nextSection = prHeroRef.current.nextElementSibling;

    gsap.set(nextSection, {
      marginTop: "-88px",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: prHeroRef.current,
        start: "bottom bottom",
        end: "+=80%",
        scrub: true,
        pin: true,
        pinSpacing: false,
        // pinSpacer: false,
        // markers: true,
      },
    });
    mm.add("(min-width: 768px)", () => {
      gsap.set(nextSection, {
        scaleX: 0.88,
      });

      tl.to(nextSection, {
        scaleX: 1,
        ease: "none",
        duration: 1,
      });
    });
  }, []);
  return (
    <section ref={prHeroRef} className="relative">
      <div className="h-screen max-md:h-dvh relative z-10 flex items-end [@media(min-width:1000px)]:items-center">
        <div className="flex flex-col items-start [@media(max-width:1000px)]:h-[60%] justify-between pb-6 pl-36 [@media(max-width:999px)]:pl-4 [@media(max-width:999px)]:pr-4 [@media(max-width:999px)]:w-full">
          <h1 className="title-h1 max-w-[450px]">{data?.Title}</h1>
          <div className="[@media(min-width:1000px)]:absolute [@media(min-width:1000px)]:bottom-6 [@media(max-width:999px)]:flex [@media(max-width:999px)]:w-full [@media(max-width:999px)]:items-end [@media(max-width:999px)]:justify-between">
            <div className="basis-1/2 pl-6 border-l border-l-brown flex flex-col gap-12 text-14 [@media(min-width:1000px)]:hidden">
              <p>{data.Location}</p>
              <p>{data?.Year}</p>
            </div>
            <Link
              href="#hero-inner"
              className="relative group flex p-2.5 rounded-full border-brownDark border duration-600 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:duration-400 hover:text-wine text-textWhite"
            >
              <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 transition-all duration-600 ease-[var(--ease-in-out)] group-hover:scale-100 group-hover:duration-400 group-hover:ease-[var(--ease-in)]"></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10 animated-arrow"
              >
                <path
                  d="M9.58464 4.16663V14.2323L4.75776 9.40538L4.16797 9.99996L10.0013 15.8333L15.8346 9.99996L15.2448 9.40538L10.418 14.2323V4.16663H9.58464Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div
        id="hero-inner"
        className="md:h-screen relative z-10 scroll-mt-12 md:mt-12"
      >
        <div className="flex items-start pl-[120px] max-md:pb-28 [@media(max-width:999px)]:pl-4 pr-36 [@media(max-width:999px)]:pr-4 [@media(max-width:999px)]:w-full max-md:pt-[88px] h-[60%]">
          <div className="basis-1/2 pl-6 border-l border-l-brown flex flex-col gap-12 text-14 [@media(max-width:999px)]:hidden">
            <p>{data.Location}</p>
            <p>{data?.Year}</p>
          </div>
          <div className="basis-1/2 [@media(max-width:999px)]:!basis-full flex flex-col gap-[120px] max-md:gap-20">
            <div>
              <p className="text-11 text-grayDark">about</p>
              <div className="text-20 mt-6">
                {renderWithoutSpans(data?.About)}
              </div>
            </div>
            <div>
              <p className="text-11 opacity-40 pb-6 border-b border-brown">
                Specification
              </p>
              <ul className="grid grid-cols-2 gap-y-6 gap-x-12 max-md:gap-x-4 lg:w-[75%]  mt-6">
                {data.Specification_project.map((spec, index) => (
                  <li key={index} className="flex flex-col gap-2">
                    <p className="text-11 opacity-40">{spec.Title}</p>
                    <p className="text-14">{spec.Description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={
          data?.Photo
            ? `${ASSET_URL}${data.Photo.url}`
            : "/images/single-pr-hero.jpg"
        }
        alt="project image"
        fill
        className="object-cover object-top !h-[200vh]"
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.75)_0%,_rgba(20,_9,_14,_0.28)_100%)]"></div>
    </section>
  );
};

export default ProjectHero;
