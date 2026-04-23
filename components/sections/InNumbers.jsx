"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import Image from "next/image";
import ButtonLink from "../ui/ButtonLink";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;
const InNumbers = ({ title = "Mkaan The Art Of Calm", data }) => {
  const numberSection = useRef(null);
  const imgRef = useRef(null);
  const quoteRef = useRef(null);
  const founderRef = useRef(null);
  const descriptionTitleRef = useRef(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: numberSection.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
      },
    });
    mm.add("(min-width: 1024px)", () => {
      
      tl.to(founderRef.current, { yPercent: -170, ease: "none" }, 0)
        .to(quoteRef.current, { yPercent: -100, ease: "none" }, 0)
        .to(imgRef.current, { yPercent: -45, ease: "none" }, 0);
    });
    mm.add("(max-width: 1023px)", () => {
      tl.to(quoteRef.current, { yPercent: -90, ease: "none", duration: 0.7 }, 0)
        .to(founderRef.current, { yPercent: -200, ease: "none" }, 0)
        .to(imgRef.current, { y: 0, ease: "none", duration: 0.1, delay: 0.1 }, 0);
    });
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      if (!descriptionTitleRef.current) return;

      const splitDescriptionWords = new SplitText(descriptionTitleRef.current, {
        type: "words",
        wordsClass: "desc-word",
      });

      if (splitDescriptionWords.words[0]) {
        splitDescriptionWords.words[0].classList.add("desc-word-first");
      }

      gsap.set(splitDescriptionWords.words, { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: descriptionTitleRef.current,
          start: "top 85%",
          once: true,
        },
      });

      tl.to(splitDescriptionWords.words, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.015,
        duration: 0.6,
        ease: "power2.out",
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        splitDescriptionWords.revert();
      };
    },
    { dependencies: [data?.Description_title] },
  );
  return (
    <section
      ref={numberSection}
      className="relative pt-[88px] max-sm:overflow-x-clip max-lg:pt-[232px] pb-[72px] max-md:pb-16 pl-36 max-lg:pl-4 "
    >
      <div className="flex items-end max-lg:w-fit lg:justify-end [@media(min-width:1700px)]:justify-center mr-[120px] max-lg:relative max-lg:mx-auto max-sm:mx-0">
        <div
          ref={founderRef}
          className="bg-textWhite p-2 w-fit lg:mr-[-110px] relative z-10 max-lg:z-20 max-lg:absolute max-lg:-right-[60px] max-sm:-right-[15px] max-lg:bottom-[-100px] max-lg:max-w-[144px] max-lg:h-[192px]"
        >
          <Image
            src={
              data?.Author_image?.url
                ? `${ASSET_URL}${data?.Author_image?.url}`
                : "/images/founder.jpg"
            }
            alt={data?.Author_image?.alternativeText || "founder"}
            width={176}
            height={224}
            className="max-lg:object-cover max-lg:w-full max-lg:h-full"
            quality={100}
          />
        </div>
        <div
          ref={quoteRef}
          className="relative z-2 max-w-[480px] max-lg:max-w-[288px] py-6 max-lg:py-4 h-[600px] max-lg:h-[480px] pl-[120px] max-lg:pl-4 lg:mr-[-120px] max-lg:absolute max-lg:z-20 max-lg:-right-14 max-lg:-top-[40%]"
        >
          <div className="relative z-10 px-6 border-l border-beige h-full">
            <p className="text-28 text-gray">“</p>
            <h2 className="text-28 text-dark mt-[154px] max-lg:mt-[126px]">
              {data?.Quote}
            </h2>
            <div className="flex flex-col gap-1 mt-[234px] max-lg:mt-[118px]">
              <h3 className="text-14 text-dark">{data?.Author}</h3>
              <p className="text-11 text-gray">{data?.Position}</p>
            </div>
          </div>
          <Image
            src={"/icons/mask/1.svg"}
            alt="decor"
            fill
            className="max-md:object-cover max-md:object-right"
            quality={100}
          />
        </div>
        <div
          ref={imgRef}
          className="bg-textWhite p-2 w-fit lg:-mb-[200px] max-lg:translate-y-[300px] relative z-10 max-lg:max-w-[288px] max-lg:h-[480px]"
        >
          <Image
            src={
              data.Media.url
                ? `${ASSET_URL}${data.Media.url}`
                : "/images/about.jpg"
            }
            alt="about image"
            width={464}
            height={584}
            className="object-cover max-lg:w-full max-lg:h-full md:h-[600px]"
            quality={100}
          />
        </div>
      </div>
      <div className="relative z-10 max-w-[312px] max-md:max-w-[288px] w-full max-lg:mt-[72px]">
        <p className="text-11 text-grayDark">{data?.Mkaan_in_numbers_title}</p>
        <p
          ref={descriptionTitleRef}
          className="first-letter:text-[40px] text-14 mt-12 max-md:mt-10"
        >
          {data?.Description_title}
        </p>
        <ul className="flex flex-col gap-6 mt-[70px] max-md:mt-16">
          {data?.Numbers_list.map((item, index) => (
            <li
              key={index}
              className="flex items-end justify-between pb-6 border-b border-brownDark"
            >
              <p className="title-h2">{item.Title}</p>
              <p className="text-14 text-grayDark mb-1">{item.Description}</p>
            </li>
          ))}
        </ul>
        <ButtonLink
          className={"mt-12 max-md:mt-10 flex w-fit"}
          href="/about"
          text={"About Us"}
          tag="a"
        />
      </div>
      <div className="z-1 absolute top-[32px] left-6 w-full pr-12 max-lg:hidden mix-blend-overlay opacity-[0.75] pointer-events-none">
        {title.split(" ").map((word, index) => (
          <span
            className="nth-[3]:justify-center nth-[4]:justify-end nth-[5]:justify-end text-230 text-bigWhite flex [text-shadow:2px_-1px_1px_rgba(255,255,255,0.20),-2px_1px_2px_rgba(0,0,0,0.35)]"
            key={index}
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
};

export default InNumbers;
