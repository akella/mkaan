"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import ButtonLink from "../ui/ButtonLink";

const OurPhilosophy = ({ className, pageLink, data }) => {
  const philosophyBlock = useRef(null);
  const textRef = useRef(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(textRef.current, {
      type: "lines, words",
      linesClass: "philosophy-line",
      wordsClass: "philosophy-word",
    });

    gsap.set(split.lines, { transformStyle: "preserve-3d" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: philosophyBlock.current,
        start: "center 90%",
        end: "bottom 75%",
        // scrub: true,
        // markers: true,
      },
    });

    tl.from(split.words, {
      opacity: 0,
      x: (i) => (i % 2 === 0 ? -40 : 40),
      y: 26,
      z: -80,
      rotateY: (i) => (i % 2 === 0 ? -35 : 35),
      // transformOrigin: "50% 50% -20px",
      stagger: { each: 0.04, from: "center" },
      ease: "power2.out",
    });

    return () => {
      split.revert();
      tl.kill();
    };
  }, []);
  return (
    <section
      ref={philosophyBlock}
      className={`py-[240px] max-md:py-[184px] max-md:px-8 max-md:overflow-x-clip bg-dark z-10 relative ${className}`}
    >
      <p className="text-11 opacity-40 text-center">
        {data?.Title || "Our philosophy"}
      </p>
      <h2
        ref={textRef}
        className="text-28 mt-6 max-w-[768px] max-md:max-w-full mx-auto text-center"
      >
        {data?.Description ||
          "Mkaan is a belief that architecture, elevated through art, intelligence, and purpose, can shape how people live, feel, and dream. Every creation we deliver stands as proof that perfection is not a coincidence — it is an orchestration."}
      </h2>
      {pageLink && (
        <ButtonLink
          tag="a"
          href={pageLink}
          text={"About us"}
          className={"mt-12 max-md:mt-10"}
        />
      )}
    </section>
  );
};

export default OurPhilosophy;
