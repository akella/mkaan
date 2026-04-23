"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ViewTransitionEffects() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof document === "undefined" || !document.startViewTransition) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const handleViewTransitionEnd = () => {
      requestAnimationFrame(() => {
        if (lenis) {
          lenis.resize();
        }
        if (ScrollTrigger) {
          ScrollTrigger.killAll();
          ScrollTrigger.refresh(true);
        }
      });
    };

    document.addEventListener("viewtransitionend", handleViewTransitionEnd);

    return () => {
      document.removeEventListener(
        "viewtransitionend",
        handleViewTransitionEnd,
      );
    };
  }, [lenis]);

  return null;
}
