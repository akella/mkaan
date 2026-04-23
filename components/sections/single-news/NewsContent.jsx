"use client";

import Image from "next/image";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useLenis } from "lenis/react";
import ButtonLink from "@/components/ui/ButtonLink";
import useMediaQuery from "@/hooks/useMatchMedia";
import { useModal } from "@/components/context/ModalContext";
import AnimatedImage from "@/components/ui/AnimatedImage";
import SocialLinks from "@/components/ui/SocilaLinks";
import parse, { domToReact } from "html-react-parser";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

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

const renderWithoutTags = (html) => {
  if (!html) return "";

  // SSR-safe and deterministic text extraction to avoid hydration mismatches.
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const NewsContent = ({ data }) => {
  // sections

  const hero = data?.Hero_section;
  const quoteSection = data?.Main_body;
  const lastBlock = data?.Conclusion_text;

  const splitDate = hero.Date.split(" ");

  const articleContent = useRef(null);
  const scrollProgress = useRef(null);
  const goToTopBtn = useRef(null);
  const goBackBtn = useRef(null);
  const formBlock = useRef(null);
  const scrollDownArrow = useRef(null);
  const newSection = useRef(null);
  const articleBody = useRef(null);
  const overscrollAccumulator = useRef(0);
  const isFormRevealed = useRef(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
 
  const lenis = useLenis();

  const { openModal } = useModal();

  const goBack = () => {
    window.history.back();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToNextBlock = () => {
    const target = articleBody.current;
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!articleBody.current) return;
    let refreshTimeout = null;
    const observer = new ResizeObserver(() => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
    observer.observe(articleBody.current);
    return () => {
      observer.disconnect();
      if (refreshTimeout) clearTimeout(refreshTimeout);
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const mm = gsap.matchMedia();
    CustomEase.create("easeOut", "0.25, 1, 0.5, 1");

    const isDesk = window.matchMedia("(min-width: 768px)").matches;


    gsap.to(scrollDownArrow.current, {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: {
        trigger: articleBody.current,

        start: "top top",
        toggleActions: "play none none reverse",

        // markers: true,
      },
    });

    gsap.to(scrollProgress.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: articleContent.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
      },
    });


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: articleContent.current,
          start: isDesk ? "100%+=22px bottom" : "100% bottom",
          pin: true,
          pinSpacing: true,
          scrub: true,
         
          // markers: true,
        },
      });
      tl.to(formBlock.current, {
        y: "0%",
        ease: "none",
      });

    mm.add("(max-width: 768px)", () => {
      const header = document.querySelector("header");
      if (!header) return;
      gsap.to(header, {
        color: "#10070B",
        ease: "none",
        scrollTrigger: {
          trigger: articleBody.current,
          start: "-1% top",
          toggleActions: "play none none reverse",
        },
      });
      gsap.to(goBackBtn.current, {
        color: "#10070B",
        borderColor: "rgba(16, 7, 11, 0.1)",
        ease: "none",
        scrollTrigger: {
          trigger: articleBody.current,
          start: "-5% top",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <section ref={newSection} className="md:pb-[22px] max-md:pt-[360px]">
      <div className="fixed h-[calc(100%-120px)] max-md:h-[100px] w-[121px] max-lg:w-[90px] left-0 top-[96px] z-10 pl-6 max-md:pl-4 flex flex-col justify-between items-start">
        <button
          onClick={goBack}
          ref={goBackBtn}
          className="relative group duration-600 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:duration-400 hover:text-wine text-textWhite p-2.5 rounded-full border border-brownDark"
        >
          <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 transition-all duration-600 ease-[var(--ease-in-out)] group-hover:scale-100 group-hover:duration-400 group-hover:ease-[var(--ease-in)]"></div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="relative z-10"
          >
            <path
              d="M5.76901 10.4165L10.5959 15.2434L10.0013 15.8332L4.16797 9.99984L10.0013 4.1665L10.5959 4.7563L5.76901 9.58317H15.8346V10.4165H5.76901Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollToNextBlock}
          ref={scrollDownArrow}
          aria-label="Scroll to article"
          className="text-textWhite p-2.5 rounded-full border border-brownDark max-md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="animated-arrow"
          >
            <path
              d="M9.58464 4.16663V14.2323L4.75776 9.40538L4.16797 9.99996L10.0013 15.8333L15.8346 9.99996L15.2448 9.40538L10.418 14.2323V4.16663H9.58464Z"
              fill="#F7F7EB"
            />
          </svg>
        </button>
        <div className="absolute right-0 w-px h-full bg-brown max-md:hidden">
          <div
            ref={scrollProgress}
            className="absolute inset-0 bg-textWhite transform scale-y-0 origin-top"
          ></div>
        </div>
      </div>
      <div
        id="next-block"
        ref={articleContent}
        className="w-full ml-[144px] max-lg:ml-[110px] max-md:ml-0 md:pt-[63vh] text-dark"
      >
        <div
          ref={articleBody}
          data-cursor-area="light"
          className="relative bg-textWhite max-w-[696px] max-lg:max-w-[650px] max-md:max-w-full p-6 max-md:p-4 max-md:overflow-x-clip"
        >
          <div className="flex flex-col gap-24 max-md:gap-[72px] border-b border-beige pb-24 max-md:pb-[72px]">
            <p className="text-40">
              {splitDate[0]} <span className="text-14">{splitDate[1]}</span>
            </p>
            <h2 className="title-h3">{hero.Title}</h2>
          </div>
          {hero.Main_text && (
            <div className="news-content pl-[219px] max-md:pl-[62px] pt-12 max-md:pt-10">
              {renderWithoutSpans(hero.Main_text)}
            </div>
          )}
          {quoteSection.Media.url && (
            <div className="news-content__image">
              <AnimatedImage>
                <Image
                  width={648}
                  height={440}
                  alt="news image"
                  src={ASSET_URL + quoteSection.Media.url}
                  quality={100}
                />
              </AnimatedImage>
              <p>{quoteSection.Media_quote}</p>
            </div>
          )}
          {quoteSection.Quote && (
            <blockquote>
              <h3 className="text-40">
                {renderWithoutTags(quoteSection.Quote)}
              </h3>
              <div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center min-w-10 min-h-10 bg-wine rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 38 25"
                      fill="none"
                    >
                      <path
                        d="M24.0146 20.7471V20.7383C24.7122 21.8249 25.2352 22.5593 25.584 22.9453C25.9327 23.327 26.3269 23.6292 26.7627 23.8516V24.1543H22.3984V23.8516C22.8384 23.5706 23.0545 23.2981 23.0547 23.0381C23.0547 22.757 22.9139 22.4042 22.6357 21.9805L20.4844 18.5986H20.4238L19.4619 17.0498H19.4961L13.6953 7.95801L13.2754 7.29492L8.05566 15.5215H8.03906L7.58789 16.2598L7.08398 17.0547L7.08887 17.0498H7.10547L6.16016 18.5986H6.13379L4.39746 21.3467C3.89923 22.1522 3.65046 22.7481 3.65039 23.1299C3.65039 23.411 3.82087 23.6541 4.15723 23.8555V24.1582H0V23.8555C0.456682 23.6541 0.838748 23.3818 1.1377 23.042C1.43668 22.6979 1.9647 21.9345 2.72461 20.7471L12.2627 5.91016C11.8848 5.4654 11.4446 5.11268 10.9463 4.85254V4.55078H13.5791L24.0146 20.7471Z"
                        fill="#F7F7EB"
                      />
                      <path
                        d="M35.252 20.7461V20.7383C35.9496 21.825 36.4735 22.5593 36.8223 22.9453C37.171 23.327 37.5651 23.6292 38.001 23.8516V24.1533H33.6367V23.8516C34.0769 23.5704 34.293 23.2973 34.293 23.0371C34.2928 22.7561 34.1519 22.4039 33.874 21.9805L31.7227 18.5986H31.6621L30.7002 17.0498H30.7344L24.9336 7.95801L24.5137 7.29492L19.2939 15.5215H19.2773L18.8408 16.2363L18.3223 17.0537L18.3262 17.0498H18.3438L17.3984 18.5986H17.3711L15.6357 21.3467C15.1375 22.1522 14.8887 22.7481 14.8887 23.1299C14.8887 23.4109 15.0584 23.6541 15.3945 23.8555V24.1582H11.2383V23.8555C11.6949 23.6541 12.077 23.3817 12.376 23.042C12.675 22.6979 13.202 21.9335 13.9619 20.7461L23.501 5.91016C23.1231 5.46545 22.6828 5.11267 22.1846 4.85254V4.55078H24.8174L35.252 20.7461Z"
                        fill="#F7F7EB"
                      />
                      <path
                        d="M23.6212 2.35182C24.2707 2.35182 24.7971 1.82535 24.7971 1.17591C24.7971 0.526473 24.2707 0 23.6212 0C22.9718 0 22.4453 0.526473 22.4453 1.17591C22.4453 1.82535 22.9718 2.35182 23.6212 2.35182Z"
                        fill="#F7F7EB"
                      />
                      <path
                        d="M12.3986 2.35182C13.048 2.35182 13.5745 1.82535 13.5745 1.17591C13.5745 0.526473 13.048 0 12.3986 0C11.7491 0 11.2227 0.526473 11.2227 1.17591C11.2227 1.82535 11.7491 2.35182 12.3986 2.35182Z"
                        fill="#F7F7EB"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-end min-w-10 min-h-10 rounded-full overflow-clip transform -translate-x-4 bg-textWhite">
                    <Image
                      src={ASSET_URL + quoteSection.Author_image.url}
                      alt="founder"
                      width={32}
                      height={32}
                      className="rounded-full object-cover max-w-9 max-h-9 "
                      quality={100}
                    />
                  </div>
                </div>
                <div>
                  <p>{quoteSection.Author_name}</p>
                  <p>Founder of Mkaan</p>
                </div>
              </div>
            </blockquote>
          )}
          {lastBlock && (
            <>
              <div className="news-content pl-[229px] max-md:pl-[56px] pt-12 max-md:pt-10">
                {renderWithoutSpans(lastBlock.Text)}
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2 mt-12">
                {lastBlock.Media.map((mediaItem, index) => (
                  <AnimatedImage
                    key={index}
                    rootClass={"min-h-[440px] max-md:min-h-[473px]"}
                  >
                    <Image
                      src={ASSET_URL + mediaItem.url}
                      width={320}
                      height={440}
                      className="object-cover max-sm:w-full h-full"
                      alt="news image"
                      quality={100}
                    />
                  </AnimatedImage>
                ))}
              </div>
              <div className="news-content pl-[229px] max-md:pl-[56px] pt-12 max-md:pt-10">
                {renderWithoutSpans(lastBlock.Conclusion)}
              </div>
            </>
          )}
          <div className="mt-12 pt-12 max-md:pt-10 border-t border-beige flex items-end gap-[184px] max-md:gap-[50px] max-sm:gap-4">
            <button
              onClick={scrollToTop}
              ref={goToTopBtn}
              className="group relative text-black p-2.5 rounded-full border border-beige transition-all duration-600 hover:duration-400 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:text-textWhite"
            >
              <div className="absolute inset-0 rounded-full bg-wine transform scale-0 transition-all duration-600 ease-[var(--ease-in-out)] group-hover:scale-100 group-hover:duration-400 group-hover:ease-[var(--ease-in)]"></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M9.58464 15.8333V5.76767L4.75776 10.5945L4.16797 9.99996L10.0013 4.16663L15.8346 9.99996L15.2448 10.5945L10.418 5.76767V15.8333H9.58464Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="flex flex-col gap-4">
              <p className="text-14">Share Article</p>

              <SocialLinks
                variant={"dark"}
                needCopyBtn={true}
                isShareLinks={true}
              />
            </div>
          </div>
          <div
            ref={formBlock}
            className="absolute z-10 max-w-[383px] max-lg:max-w-[288px] w-full h-[505px] max-lg:h-[480px] bottom-[131px] max-md:bottom-[16px] max-md:right-4 -right-[195px] transform translate-y-[150%] py-6 max-md:pb-4 flex flex-col items-center justify-between"
          >
            <Image
              src={"/icons/logo-form.svg"}
              width={51}
              height={32}
              alt="logo"
            />
            <div className="w-px h-[129px] bg-brownDark"></div>
            <ButtonLink onClick={openModal} text={"fill form"} />
            <div className="w-px h-[120px] bg-brownDark"></div>
            <p className="text-14 text-textWhite text-center max-w-[173px]">
              Let’s discuss how we can build something together.
            </p>
            <Image
              src={"/icons/mask/7.svg"}
              fill
              alt="decor"
              className="-z-10 max-lg:hidden"
            />
            <Image
              src={"/icons/mask/7-mobile.svg"}
              fill
              alt="decor"
              className="-z-10 lg:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsContent;
