"use client";

import { createContext, useContext } from "react";

const HeroPreloadContext = createContext({});

export const useHeroImages = () => useContext(HeroPreloadContext);

export default function HeroPreloadProvider({ heroImages, children }) {
  return (
    <HeroPreloadContext.Provider value={heroImages}>
      {children}
    </HeroPreloadContext.Provider>
  );
}
