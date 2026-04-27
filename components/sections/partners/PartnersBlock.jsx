"use client";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PartnersGroup from "./PartnersGroup";
import ButtonLink from "@/components/ui/ButtonLink";
import { useModal } from "@/components/context/ModalContext";

const partnersMockData = [
  {
    specialization: "Architecture & Design",
    img: "/images/partners/gr-1.jpg",
    partners: [
      {
        name: "Bugatti",
        logo: "/icons/partners/logo-7.svg",
        logoWidth: 120,
        logoHeight: 86,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Dezeen",
        logo: "/icons/partners/logo-4.svg",
        logoWidth: 94,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "i-D",
        logo: "/icons/partners/logo-6.svg",
        logoWidth: 78,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
    ],
  },
  {
    specialization: "Surfaces & Finishes Floor",
    img: "/images/partners/gr-2.jpg",
    partners: [
      {
        name: "Elle Decoration",
        logo: "/icons/partners/logo-1.svg",
        logoWidth: 107,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Robb Report",
        logo: "/icons/partners/logo-3.svg",
        logoWidth: 140,
        logoHeight: 26,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Robb Report",
        logo: "/icons/partners/logo-3.svg",
        logoWidth: 140,
        logoHeight: 26,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
    ],
  },
  {
    specialization: "Interior Systems",
    img: "/images/partners/gr-3.jpg",
    partners: [
      {
        name: "Elle Decoration",
        logo: "/icons/partners/logo-1.svg",
        logoWidth: 107,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Robb Report",
        logo: "/icons/partners/logo-3.svg",
        logoWidth: 140,
        logoHeight: 26,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
    ],
  },
  {
    specialization: "Smart Home & Sustainability",
    img: "/images/partners/gr-4.jpg",
    partners: [
      {
        name: "Elle Decoration",
        logo: "/icons/partners/logo-1.svg",
        logoWidth: 107,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Robb Report",
        logo: "/icons/partners/logo-3.svg",
        logoWidth: 140,
        logoHeight: 26,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
    ],
  },
  {
    specialization: "Glazing Systems",
    img: "/images/partners/gr-5.jpg",
    partners: [
      {
        name: "Elle Decoration",
        logo: "/icons/partners/logo-1.svg",
        logoWidth: 107,
        logoHeight: 48,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Robb Report",
        logo: "/icons/partners/logo-3.svg",
        logoWidth: 140,
        logoHeight: 26,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
      {
        name: "Wallpaper*",
        logo: "/icons/partners/logo-2.svg",
        logoWidth: 148,
        logoHeight: 34,
        description:
          "Vogue brings its editorial mastery and design sensibility to Mkaan’s residential storytelling. Through curated visual direction, brand placement, and lifestyle strategy.",
      },
    ],
  },
];

const PartnersBlock = ({ data = partnersMockData, partnersData }) => {
  const rootData = partnersData.Hero_partner;
  const partnersList = partnersData.Partner_info;

  const sectionRef = useRef(null);
  const partnersTrack = useRef(null);
  const sidebarRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  const { openModal } = useModal();

  const clampSidebar = useCallback(() => {
    const section = sectionRef.current;
    const track = partnersTrack.current;
    const sidebar = sidebarRef.current;
    if (!section || !track || !sidebar) return;

    const sidebarWidth = sidebar.offsetWidth;
    const sidebarTravel = section.offsetWidth - sidebarWidth;
    const shift = Number(gsap.getProperty(track, "x"));
    const next = gsap.utils.clamp(-sidebarTravel, 0, shift);
    gsap.set(sidebar, { x: next });
  }, []);

  const scrollToBlock = useCallback(
    (targetId) => {
      const track = partnersTrack.current;
      const section = sectionRef.current;
      const scrollTrigger = scrollTriggerRef.current;
      if (!track || !section || !scrollTrigger) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const offsetLeft = target.offsetLeft;
      const maxShift = Math.max(track.scrollWidth - section.offsetWidth, 0);
      const desiredShift = Math.min(offsetLeft, maxShift);

      const targetScroll = scrollTrigger.start + desiredShift - 480;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [clampSidebar],
  );

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const section = sectionRef.current;
    const track = partnersTrack.current;
    const sidebar = sidebarRef.current;
    if (!section || !track || !sidebar) return;

    mm.add("(min-width: 767px)", () => {
      const getScrollLength = () =>
        Math.max(track.scrollWidth - section.offsetWidth, 0);

      const animation = gsap.to(track, {
        x: () => -getScrollLength(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollLength()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: clampSidebar,
          onRefresh: clampSidebar,
        },
      });
      scrollTriggerRef.current = animation.scrollTrigger;

      gsap.set(sidebar, { x: 0 });
      clampSidebar();

      return () => {
        scrollTriggerRef.current = null;
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    });
  }, [clampSidebar]);
  return (
    <section
      ref={sectionRef}
      className="relative md:h-screen bg-dark md:overflow-hidden"
    >
      <div
        ref={partnersTrack}
        className="flex h-full md:w-max md:will-change-transform max-md:flex-col"
      >
        <div className="relative flex items-end pb-6 pl-36 [@media(max-width:1120px)]:pl-6 h-full md:w-[calc(100vw-16px)] max-md:w-full max-md:h-screen max-md:!p-4">
          <div className="flex items-end h-[57%] max-md:h-1/2 w-full pr-[504px] max-lg:pr-52 max-md:!p-0 justify-between relative z-10">
            <div className="flex flex-col justify-between h-full">
              <h1 className="title-h1 capitalize max-w-[430px] max-sm:max-w-[240px] max-lg:!text-[46px] max-md:!text-[40px] max-lg:!leading-[36px]">
                {rootData.Title}
              </h1>
              <p className="text-14 max-w-[310px]">{rootData.Description}</p>
            </div>
            <div className="p-2.5 rounded-full border border-brownDark max-md:rotate-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M14.2297 10.418H4.16406V9.58464H14.2297L9.40281 4.75776L9.9974 4.16797L15.8307 10.0013L9.9974 15.8346L9.40281 15.2448L14.2297 10.418Z"
                  fill="#F7F7EB"
                />
              </svg>
            </div>
          </div>
          <Image
            src={"/images/partners/1.jpg"}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out"
            style={{ opacity: bgImageLoaded ? 1 : 0 }}
            onLoad={() => setBgImageLoaded(true)}
            alt="partners background image"
            quality={100}
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.75)_0%,_rgba(20,_9,_14,_0.00)_100%)]"></div>
          <div className="absolute inset-0 bg-bgOverlay"></div>
        </div>
        <PartnersGroup data={partnersList} />
        <div className="flex items-center justify-center md:w-[456px] h-full bg-dark max-md:py-24 max-md:px-4">
          <div className="max-md:w-full">
            <div className="relative md:max-w-[264px] md:h-[328px] w-full p-6 border border-brownDark max-md:h-[427px] overflow-clip">
              <Image
                src={"/images/about-small.jpg"}
                width={216}
                height={280}
                alt="partner cta image"
                className="max-md:w-full max-w-none h-full object-cover"
                quality={100}
              />
              <ButtonLink
                onClick={() => openModal("partnership")}
                text="Become Partner"
                className={
                  "!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                }
              />
            </div>
            <p className="text-14 mt-6 max-w-[190px] text-center mx-auto">
              Your Expertise. Our Vision. One Landmark Future.
            </p>
          </div>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className="max-md:hidden absolute right-0 top-0 z-10 h-full pl-[120px] max-lg:pl-8 max-w-[480px] max-lg:max-w-[390px] w-full py-6 pr-16 bg-black"
      >
        <div className="flex flex-col justify-between h-full pl-6 border-l border-brownDark">
          <h2 className="text-36 pt-[73px]">{rootData.Sub_description}</h2>
          <div>
            <p className="text-14 opacity-40">Partner Specialization</p>
            <ul className="flex flex-col gap-2 mt-4">
              {partnersList.map((group, index) => (
                <li key={index}>
                  <button
                    className="group flex items-center gap-4"
                    onClick={() =>
                      scrollToBlock(
                        group.partner_specialization.Specialization_of_partner,
                      )
                    }
                  >
                    <div className="flex items-center gap-1">
                      <p
                        className={`transition-opacity duration-400 opacity-40 group-hover:opacity-100`}
                      >
                        [
                      </p>
                      <div
                        className={`w-1 h-1 bg-textWhite rounded-full transition-opacity duration-400 opacity-0 group-hover:opacity-100`}
                      ></div>
                      <p
                        className={`transition-opacity duration-400 opacity-40 group-hover:opacity-100`}
                      >
                        ]
                      </p>
                    </div>
                    {group.partner_specialization.Specialization_of_partner}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersBlock;
