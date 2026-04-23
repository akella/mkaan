"use client";
import Image from "next/image";
import Link from "next/link";
import ButtonLink from "../ui/ButtonLink";
import { useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UaeClock from "../ui/UaeClock";
import SocialLinks from "../ui/SocilaLinks";
import NavLink from "../NavLink";

import { useModal } from "../context/ModalContext";
import FAQAccordion from "../ui/FAQAccordion";

import { ScrollTrigger } from "gsap/ScrollTrigger";

const Contacts = ({ data }) => {
  const faqList = data?.Common_questions?.FAQ_slider ?? [];
  const normalizedFaqList = useMemo(() => {
    if (!faqList.length) return [];
    return faqList.map((item) => {
      if (!item) return { Title: "", Description: "" };
      const { Text, Title, ...rest } = item;
      return {
        ...rest,
        Title: Title ?? "",
        Description: Text ?? "",
      };
    });
  }, [faqList]);
  gsap.registerPlugin(ScrollTrigger);

  const { openModal } = useModal();

  const faq = useMemo(
    () => [
      {
        q: "What does Mkaan specialize in?",
        a: "Mkaan focuses on creating ultra‑luxury branded residences and managing full‑cycle developments — from concept to delivery — across the UAE and selected global markets.",
      },
      {
        q: "How is Mkaan different from other developers?",
        a: "We combine boutique attention to detail with institutional delivery standards, partnering with world‑class architects and suppliers to realize distinctive, enduring places.",
      },
      {
        q: "Where are Mkaan projects located?",
        a: "Primarily across the UAE with selected opportunities in global gateway cities where our brand and partner ecosystem can deliver exceptional value.",
      },
      {
        q: "Does Mkaan collaborate with investors or landowners?",
        a: "Yes — we structure co‑development and JV models that align interests and leverage our product, design, and delivery expertise.",
      },
      {
        q: "What brands and suppliers does Mkaan work with?",
        a: "We curate premium partners across architecture, interiors, materials, and services — selected for innovation, reliability, and aesthetic alignment.",
      },
      {
        q: "Can I invest or co‑develop with Mkaan?",
        a: "We actively review strategic partnerships. Share basic details and our team will explore suitable collaboration formats.",
      },
      {
        q: "How can I inquire about a specific project?",
        a: "Use the form or contact our team directly — we’ll provide availability, specifications, and timelines for the project you’re interested in.",
      },
      {
        q: "Does Mkaan operate outside the UAE?",
        a: "Selectively, where the opportunity and partners meet our standards. Reach out to discuss markets of interest.",
      },
    ],
    [],
  );

  const footerBottomC = useRef(null);
  const contactImgRef = useRef(null);
  const contactSecRef = useRef(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [subMenuMaxHeight, setSubMenuMaxHeight] = useState(0);
  const [showBarMobile, setShowBarMobile] = useState(false);
  const subMenuContentRef = useRef(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (subMenuContentRef.current) {
        setSubMenuMaxHeight(subMenuContentRef.current.scrollHeight);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isSubMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const SHOW_WITHIN_PX = 150;
    let ticking = false;

    const check = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const distanceFromBottom =
        document.documentElement.scrollHeight - scrollBottom;
      setShowBarMobile(distanceFromBottom < SHOW_WITHIN_PX);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(check);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    check();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        contactImgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: contactSecRef.current,
            start: "top top",
            end: "center top",
            scrub: true,
            // markers: true,
          },
        },
      );

      ScrollTrigger.create({
        trigger: footerBottomC.current,
        pin: true,
        pinSpacer: true,
        start: "bottom bottom",
        end: "+=60px",
        // markers: true,

        // end: "top top",
      });
    });

  }, []);

  return (
    <>
    
    <section
      ref={contactSecRef}
      className="relative z-20 pt-[168px] max-md:pt-32 overflow-y-clip"
    >
      <div className="pl-[120px] pr-36 max-lg:px-16 max-md:px-4">
        <div className="relative z-10 pl-6 max-md:pl-4 border-l border-l-brownDark overflow-clip">
          <div className="md:h-screen [@media(min-width:1024px)_and_(max-height:750px)]:h-auto">
            <div className="max-w-[355px] max-sm:max-w-[250px]">
              <p className="text-11 opacity-40">contact</p>
              <h1 className="title-h1 mt-6 max-md:!text-[52px] max-md:!leading-[44px] max-md:!tracking-[-1.3px]">
                Reach Out to Mkaan
              </h1>
            </div>
            <div className="grid md:grid-cols-2 mt-36 max-md:mt-24">
              <ul className="flex flex-col gap-6 text-14 max-w-[190px] max-md:mt-24">
                <li>
                  <p className="opacity-40">E.</p>
                  <Link
                    className="relative overflow-y-hidden block group"
                    href="mailto:hello@mkaan.com"
                  >
                    <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                      hello@mkaan.com
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                      hello@mkaan.com
                    </span>
                  </Link>{" "}
                </li>
                <li>
                  <p className="opacity-40">M.</p>
                  <Link
                    className="relative overflow-y-hidden block group"
                    href="tel:+97145235096"
                  >
                    <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                      +971 4 523 5096
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                      +971 4 523 5096
                    </span>
                  </Link>
                </li>
                <li>
                  <p className="opacity-40">A.</p>
                  <div className="group">
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform delay-75 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Level 4, Office 404-06
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform delay-75 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Level 4, Office 404-06
                      </span>
                    </p>
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform delay-200 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Deyaar Head Office Building
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform delay-200 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Deyaar Head Office Building
                      </span>
                    </p>
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform delay-300 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Al Barsha1, Dubai UAE
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform delay-300 md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Al Barsha1, Dubai UAE
                      </span>
                    </p>
                  </div>
                </li>
              </ul>

              <div className="text-14 max-md:hidden">
                <UaeClock />
                <p>UAE, Dubai</p>
              </div>
              <div className="mt-auto max-md:mt-16 max-md:flex max-md:justify-between max-md:items-center">
                <SocialLinks />
                <div className="text-14 md:hidden text-right">
                  <UaeClock />
                  <p>UAE, Dubai</p>
                </div>
              </div>
              <div className="sm:max-w-[312px] md:-mt-4 max-md:row-start-1">
                <p className="text-14 first-letter:text-[40px] first-letter:leading-[40px]">
                  {data.Description}
                </p>
                <ButtonLink
                  onClick={openModal}
                  text={"Fill Form"}
                  className={"mt-[46px] max-md:mt-10"}
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 sm:pb-24 mt-12 max-md:mt-24 max-sm:gap-10 md:min-h-[448px]">
            <h2 className="title-h2 max-w-[350px]">
              {data.Common_questions.Title}
            </h2>
            <FAQAccordion
              items={normalizedFaqList.length ? normalizedFaqList : faq}
              className="faq-list"
              listClassName="w-full border-t border-white/20"
              itemClassName="border-b border-brown"
            />
          </div>
        </div>
      </div>

      <Image
        src={"/images/contact.jpg"}
        fill
        alt="Contact"
        className="object-cover "
        ref={contactImgRef}
        quality={100}
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(20,_9,_14,_0.75)_0%,_rgba(20,_9,_14,_0.00)_100%)]"></div>
      <div className="absolute inset-0 bg-bgOverlay"></div>
      <div className="relative max-md:hidden z-20 bg-[linear-gradient(180deg,_rgba(16,_7,_11,_0.00)_0%,_#10070B_100%)]">
        <div className=" max-w-[91.5%] max-sm:max-w-full max-sm:pl-4 w-full ml-auto mt-[72px] pr-6 max-sm:pr-[15px] max-md:mt-[80px] flex justify-between items-end max-lg:flex-wrap max-lg:gap-y-16 max-lg:gap-x-16 max-sm:justify-center max-sm:gap-x-14">
          <NavLink
            href={"/own-with-mkaan"}
            className="group flex flex-col items-start gap-[50px] w-fit cursor-pointer max-sm:items-center max-sm:gap-4"
          >
            <div className="relative w-[194px] h-[194px] max-sm:w-[90px] max-sm:h-[90px] flex items-center justify-center">
              <div className="p-[94px] max-sm:p-[43px] border border-textWhite/10 rounded-full flex items-center justify-center md:group-hover:p-[43.09px] md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:border-none md:group-hover:bg-textWhite">
                <div className="w-1 h-1 rounded-full bg-textWhite md:group-hover:bg-dark"></div>
              </div>
              <Image
                src={"/images/dot-decor.png"}
                width={294}
                height={294}
                alt="decor"
                quality={100}
                className="main-circle-dots min-w-[294px] h-[294px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 md:group-hover:opacity-100 md:group-hover:scale-100 md:transition-all md:duration-500 md:ease-[var(--ease-in)]"
              />
            </div>
            <p className="text-14 sm:ml-12">Own With Mkaan</p>
            <svg
              width="336"
              height="144"
              viewBox="0 0 336 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-lg:hidden"
            >
              <g clipPath="url(#clip0_3085_5122)">
                <path
                  d="M927.169 1115.5V1114.92C975.398 1189.77 1011.57 1240.34 1035.68 1266.93C1059.8 1293.23 1087.07 1314.03 1117.21 1329.35V1350.16H815.496V1329.35C845.926 1309.99 860.854 1291.2 860.854 1273.29C860.854 1253.92 851.094 1229.65 831.859 1200.46L683.153 967.535H678.915L612.4 860.898H614.829L213.781 234.659L184.787 188.999L-176.077 755.703L-177.219 755.672L-207.116 804.447L-243.246 861.188L-242.959 860.898H-241.717L-307.079 967.535H-308.986L-428.985 1156.82C-463.435 1212.31 -480.658 1253.35 -480.658 1279.64C-480.658 1299.01 -468.889 1315.77 -445.636 1329.64V1350.45H-733V1329.64C-701.422 1315.77 -675.01 1296.98 -654.341 1273.58C-633.671 1249.88 -597.213 1197.28 -544.678 1115.5L114.74 93.6328C88.6162 63 58.1856 38.7249 23.7363 20.8076V0H205.743L927.169 1115.5Z"
                  fill={`transparent`}
                  stroke="#F7F7EB"
                  strokeOpacity={0.1}
                  className="md:group-hover:fill-textWhite md:transition-all md:duration-500 md:ease-[var(--ease-in-out)]"
                />
              </g>
              <defs>
                <clipPath id="clip0_3085_5122">
                  <rect width="336" height="144" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </NavLink>
          <div className="flex flex-col items-center gap-6 pb-12 max-md:pb-10 max-lg:mx-auto max-lg:order-1 lg:-ml-[77px]">
            <ul className="max-w-[385px] w-full flex gap-2 max-sm:gap-1 flex-wrap justify-center">
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/about"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    About Us
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    About Us
                  </span>
                </NavLink>
                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/case-study"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    Case Study
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    Case Study
                  </span>
                </NavLink>
                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/partners"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    Partners
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    Partners
                  </span>
                </NavLink>
                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/development"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    Development
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    Development
                  </span>
                </NavLink>
                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/projects"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    Portfolio
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    Portfolio
                  </span>
                </NavLink>
                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/news"
                >
                  <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                    News Room
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                    News Room
                  </span>
                </NavLink>

                <p className="text-14 opacity-10">/</p>
              </li>
              <li className="flex items-center gap-2 max-sm:gap-1 text-14">
                <NavLink
                  className="relative overflow-y-hidden block group"
                  href="/contacts"
                >
                  <span className="block transition-transform duration-600 ease-[var(--ease-link)] group-hover:-translate-y-full">
                    Contact
                  </span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full transition-transform duration-600 ease-[var(--ease-link)] group-hover:translate-y-0">
                    Contact
                  </span>
                </NavLink>
              </li>
            </ul>
            <div className="w-px h-[202px] max-sm:h-[120px] bg-textWhite/10"></div>
            <SocialLinks />
          </div>

          <NavLink
            href={"/partner-with-mkaan"}
            className="group flex flex-col items-start gap-[50px] w-fit cursor-pointer max-sm:items-center max-sm:gap-4"
          >
            <div className="relative w-[194px] h-[194px] max-sm:w-[90px] max-sm:h-[90px] flex items-center justify-center">
              <div className="p-[94px] max-sm:p-[43px] border border-textWhite/10 rounded-full flex items-center justify-center md:group-hover:p-[43.09px] md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:border-none md:group-hover:bg-textWhite">
                <div className="w-1 h-1 rounded-full bg-textWhite md:group-hover:bg-dark"></div>
              </div>
              <Image
                src={"/images/dot-decor.png"}
                width={294}
                height={294}
                alt="decor"
                className="main-circle-dots min-w-[294px] h-[294px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 md:group-hover:opacity-100 md:group-hover:scale-100 md:transition-all md:duration-500 md:ease-[var(--ease-in)]"
              />
            </div>
            <p className="text-14 sm:ml-12">Partner With Mkaan</p>
            <svg
              width="336"
              height="144"
              viewBox="0 0 336 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-lg:hidden"
            >
              <g clipPath="url(#clip0_3085_5122)">
                <path
                  d="M927.169 1115.5V1114.92C975.398 1189.77 1011.57 1240.34 1035.68 1266.93C1059.8 1293.23 1087.07 1314.03 1117.21 1329.35V1350.16H815.496V1329.35C845.926 1309.99 860.854 1291.2 860.854 1273.29C860.854 1253.92 851.094 1229.65 831.859 1200.46L683.153 967.535H678.915L612.4 860.898H614.829L213.781 234.659L184.787 188.999L-176.077 755.703L-177.219 755.672L-207.116 804.447L-243.246 861.188L-242.959 860.898H-241.717L-307.079 967.535H-308.986L-428.985 1156.82C-463.435 1212.31 -480.658 1253.35 -480.658 1279.64C-480.658 1299.01 -468.889 1315.77 -445.636 1329.64V1350.45H-733V1329.64C-701.422 1315.77 -675.01 1296.98 -654.341 1273.58C-633.671 1249.88 -597.213 1197.28 -544.678 1115.5L114.74 93.6328C88.6162 63 58.1856 38.7249 23.7363 20.8076V0H205.743L927.169 1115.5Z"
                  fill={`transparent`}
                  stroke="#F7F7EB"
                  strokeOpacity={0.1}
                  className="md:group-hover:fill-textWhite md:transition-all md:duration-500 md:ease-[var(--ease-in-out)]"
                />
              </g>
              <defs>
                <clipPath id="clip0_3085_5122">
                  <rect width="336" height="144" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </NavLink>
        </div>
      </div>
      <div className="md:hidden flex items-end justify-between mt-16 p-4 pb-2.5 relative z-10">
        <div>
          <ul className="flex flex-col gap-2 ">
            <li className="text-24">
              <button
                className="flex items-center gap-2"
                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
              >
                <span>Home</span>
                <div className="relative flex h-7 max-md:w-5 w-7 max-md:h-5 items-center justify-center">
                  <span className="block h-px w-[13px] bg-textWhite transition-opacity duration-300 ease-in-out" />
                  <span
                    className={`absolute block h-[13px] w-px bg-textWhite transition-transform duration-700 ease-in-out origin-center ${
                      isSubMenuOpen ? "rotate-z-90" : "rotate-z-0"
                    }`}
                  />
                </div>
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
                style={{
                  maxHeight: isSubMenuOpen
                    ? `${subMenuMaxHeight || 0}px`
                    : "0px",
                }}
              >
                <ul
                  ref={subMenuContentRef}
                  className="text-20 flex flex-col gap-3 pt-4 pb-2"
                >
                  <li>
                    <NavLink href={"/own-with-mkaan"}>Own With Mkaan</NavLink>
                  </li>
                  <li>
                    <NavLink href={"/partner-with-mkaan"}>
                      Partner With Mkaan
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>
            <li className="text-24">
              <NavLink href={"/about"}>About Us</NavLink>
            </li>
            <li className="text-24">
              <NavLink href={"/development"}>Development</NavLink>
            </li>
            <li className="text-24">
              <NavLink href={"/projects"}>Portfolio</NavLink>
            </li>
            <li className="text-24">
              <NavLink href={"/case-study"}>Case Study</NavLink>
            </li>
            <li className="text-24">
              <NavLink href={"/partners"}>Partners</NavLink>
            </li>
          </ul>
          <ul className="text-14 flex flex-col gap-2 text-grayDark mt-16">
            <li>
              <NavLink href={"/news"}>News Room</NavLink>
            </li>
            <li>
              <NavLink href={"/career"}>Career</NavLink>
            </li>
            <li>
              <NavLink href={"/contact"}>Contact</NavLink>
            </li>
          </ul>
        </div>
        <SocialLinks />
      </div>
    </section>
      <div
        ref={footerBottomC}
        className={`w-full h-[60px] max-md:h-[84px] mt-[-60px] footer-sticky-mobile bg-darkSecondary flex justify-between max-sm:flex-wrap items-center px-6 max-sm:p-4 footer-bottom max-md:gap-4 ${showBarMobile ? "footer-sticky-mobile-visible" : "footer-sticky-mobile-hidden"}`}
      >
        <p className="text-11 opacity-40 max-sm:order-0 max-md:max-w-1/2">
          mkaan © <span>{new Date().getFullYear()}</span>, <br /> all right
          reserved
        </p>
        <NavLink
          className="text-11 max-md:w-full opacity-40 transition-opacity duration-400 max-sm:-order-1 hover:opacity-100 [@media(min-width:1441px)]:absolute [@media(min-width:1441px)]:left-1/2 [@media(min-width:1441px)]:transform [@media(min-width:1441px)]:-translate-x-1/2"
          href="#"
        >
          privacy policy
        </NavLink>
        <div className="flex gap-3 md:items-end max-md:max-w-1/2">
          <div>
            <p className="text-11 opacity-40 text-right">experience by</p>
            <Link
              href={"#"}
              className="flex opacity-40 transition-opacity duration-400 hover:opacity-100 text-11"
            >
              thefirstthelast
            </Link>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19.6901 16.1688C21.6564 15.1375 22.6399 13.8329 22.6399 12.5776C22.6399 11.5094 21.9347 10.4089 20.4918 9.45735C19.096 8.53685 17.1085 7.83083 14.7811 7.51151L14.7811 8.82058L13.1604 8.82058L13.1604 4.79922L14.7811 4.79922L14.7811 6.14219L14.7825 6.1309C17.3317 6.45763 19.5928 7.22782 21.2372 8.31226C22.8685 9.38807 24 10.8541 24 12.5776C24 14.6012 22.4494 16.2652 20.3186 17.3828C18.1547 18.5177 15.2125 19.1992 11.9999 19.1992C8.78728 19.1992 5.84507 18.5177 3.68117 17.3828C1.55039 16.2652 -0.000184611 14.6012 -0.000184434 12.5776C-0.000184283 10.8541 1.13128 9.38807 2.76262 8.31226C4.38134 7.24476 6.59765 6.48177 9.09801 6.14653L9.09801 4.79922L10.7187 4.79922L10.7187 8.82058L9.09801 8.82058L9.09801 7.52846C6.82258 7.85537 4.87962 8.5528 3.50798 9.45735C2.06514 10.4089 1.35989 11.5094 1.35989 12.5776C1.35989 13.8329 2.3434 15.1375 4.30967 16.1688C6.24282 17.1827 8.96064 17.8302 11.9999 17.8302C15.0392 17.8302 17.757 17.1827 19.6901 16.1688Z"
              fill="#F7F7EB"
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Contacts;
