"use client";

import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const AnimatedImage = ({
  children,
  rootClass,
  withBorder = false,
  isOnTop = false,
  end = "bottom top",
  yEnd = 10,
}) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const image = container?.querySelector("img");

    if (!container || !image) {
      return;
    }

    const tween = gsap.fromTo(
      image,
      { yPercent: -10 },
      {
        yPercent: yEnd,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end,
          scrub: true,
          refreshPriority: -1,
          // markers: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, yEnd]);

  return (
    <div
      className={`${rootClass} overflow-y-clip [&_img]:!h-[120%]`}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

export default AnimatedImage;
