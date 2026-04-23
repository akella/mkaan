"use client";

import { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TransitionContext = createContext(null);
export const usePageTransition = () => useContext(TransitionContext);

const TRANSITION_DURATION = 2;
const TRANSITION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const overlayRef = useRef(null);
  const isTransitioning = useRef(false);
  const mainRef = useRef(null);

  const navigate = useCallback(
    async (href) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const main = mainRef.current;
      const overlay = overlayRef.current;

      if (!main || !overlay) {
        router.push(href);
        isTransitioning.current = false;
        return;
      }

      // 1. Clone current page DOM into overlay
      const clone = main.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.inset = "0";
      clone.style.zIndex = "9990";
      clone.style.pointerEvents = "none";
      clone.style.overflow = "hidden";
      overlay.appendChild(clone);

      // 2. Navigate (React renders new page in <main>)
      router.push(href);

      // 3. Wait for new page to render
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      // 4. Animate: new page clips in from bottom, clone dims/blurs
      gsap.fromTo(
        main,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: TRANSITION_DURATION,
          ease: TRANSITION_EASE,
        },
      );

      gsap.to(clone, {
        clipPath: "inset(0% 0% 100% 0%)",
        filter: "blur(2px) brightness(0.6)",
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASE,
        onComplete: () => {
          // 5. Cleanup
          overlay.innerHTML = "";
          gsap.set(main, { clearProps: "clipPath" });
          isTransitioning.current = false;

          // Refresh ScrollTrigger for new page
          ScrollTrigger.refresh(true);
        },
      });
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate, mainRef }}>
      <div ref={mainRef}>{children}</div>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9990] pointer-events-none"
      />
    </TransitionContext.Provider>
  );
}
