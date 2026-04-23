'use client'

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function PageWrapper({ children, className = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    

    // NEW LAYOUT ANIMATION (NOT USED FOR NOW)
    // gsap.fromTo(
    //   el,
    //   { 
    //     // opacity: 0, 
    //     y: 20,
    //     // zIndex: 12,
    //   },
    //   { 
    //     // opacity: 1, 
    //     y: 0, 
    //     // duration: 0.6, 
    //     delay: 1, // Delay matches ViewTransition duration (1000ms)
    //     ease: "power2.out",
    //     // zIndex: 12,
    //     // onComplete: () => {
    //     //   el.style.zIndex = "auto";
    //     // }
    //   }
    // );
  }, []);

  return (
    <div ref={ref} className={className + " bg-white relative"}>
      {children}
    </div>
  );
}

