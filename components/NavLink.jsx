"use client";

import { useCallback } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";
import { preloadImage } from "@/lib/preloadImage";
import { useHeroImages } from "./providers/HeroPreloadProvider";
import { fadeOut } from "@/lib/transitionFade";

export default function NavLink({
  href,
  children,
  className,
  preload,
  onMouseEnter,
  onClick,
  ...props
}) {
  const heroImages = useHeroImages();
  const router = useTransitionRouter();

  const getImageUrl = useCallback(() => {
    if (preload) return preload;
    if (href && heroImages[href]) return heroImages[href];
    return null;
  }, [preload, href, heroImages]);

  const handleMouseEnter = (event) => {
    const url = getImageUrl();
    if (url) preloadImage(url);
    if (onMouseEnter) onMouseEnter(event);
  };

  const handleClick = (event) => {
    if (onClick) onClick(event);

    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;

    event.preventDefault();

    const url = getImageUrl();
    if (url) preloadImage(url);

    fadeOut();
    router.push(href);
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
