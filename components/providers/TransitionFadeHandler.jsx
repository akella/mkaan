"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fadeIn, FADE_DURATION } from "@/lib/transitionFade";

export default function TransitionFadeHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for the fade-out to fully complete before fading back in, so the
    // overlay spends a brief moment at full opacity while the new page finishes
    // rendering underneath. This keeps the "to black → new page reveal" beat
    // intact even when router.push fires in parallel with fadeOut.
    const timeout = window.setTimeout(() => {
      fadeIn();
    }, FADE_DURATION);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}
