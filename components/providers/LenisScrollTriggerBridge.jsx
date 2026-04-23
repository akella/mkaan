"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisScrollTriggerBridge = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const syncScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", syncScroll);

    return () => {
      lenis.off("scroll", syncScroll);
    };
  }, [lenis]);

  return null;
};

export default LenisScrollTriggerBridge;
