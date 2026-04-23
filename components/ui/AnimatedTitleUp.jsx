"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const AnimatedTitleUp = ({
  children,
  className,
  tag,
  ref,
  stagger = 0.02,
  duration = 0.8,
}) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const elements = document.querySelectorAll(".js-animated-title-up");

    const cleanups = [];

    elements.forEach((el) => {
      const splitLines = new SplitText(el, {
        type: "lines",
        linesClass: "title-line-up",
      });
      const splitChars = new SplitText(splitLines.lines, {
        type: "chars",
        charsClass: "title-char-up",
      });

      gsap.set(el, { transformStyle: "preserve-3d" });
      gsap.set(splitChars.chars, {
        opacity: 0,
        yPercent: 50,
        rotateX: -90,
        willChange: "opacity, transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play none none reverse",
          // scrub: true,
        },
      });

      tl.to(splitChars.chars, {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        duration,
        stagger,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });

      cleanups.push(() => {
        tl.scrollTrigger?.kill();
        tl.kill();
        splitChars.revert();
        splitLines.revert();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [duration, stagger]);
  const Tag = tag || "h1";
  return (
    <Tag ref={ref} className={`js-animated-title-up ${className || ""}`}>
      {children}
    </Tag>
  );
};
export default AnimatedTitleUp;
