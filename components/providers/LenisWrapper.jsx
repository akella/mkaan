"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import LenisScrollTriggerBridge from "./LenisScrollTriggerBridge";

const lenisOptions = {
  duration: 1,
  lerp: 0.05,
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 2,
  // anchors: true
};

export default function LenisWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return children;
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
