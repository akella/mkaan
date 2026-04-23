"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const AnimatedTitle = ({
  children,
  className,
  tag,
  ref,
  stagger = 0.02,
  duration = 0.8,
}) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const elements = document.querySelectorAll(".js-animated-title");
    const splits = [];

    elements.forEach((el) => {
      const split = new SplitText(el, {
        type: "lines,words,chars",
        linesClass: "title-line",
        wordsClass: "title-word",
        charsClass: "title-char",
        mask: "chars",
      });

      splits.push(split);

      gsap.set(split.lines, { overflow: "hidden" });
      gsap.set(split.words, { display: "inline-block", whiteSpace: "nowrap" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom top",
        },
      });

      tl.fromTo(
        split.chars,
        {
          yPercent: 100,
          stagger: stagger,
          duration: duration,
          ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        },
        {
          yPercent: 0,
          stagger: stagger,
          duration: duration,
          ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }
      );
    });

    return () => {
      splits.forEach((split) => split.revert());
    };
  }, []);
  const Tag = tag || "h1";
  return (
    <Tag ref={ref} className={`js-animated-title ${className}`}>
      {children}
    </Tag>
  );
};
export default AnimatedTitle;
