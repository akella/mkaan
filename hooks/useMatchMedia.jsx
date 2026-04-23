"use client";
import { useState, useLayoutEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e) => setMatches(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}

export default useMediaQuery;