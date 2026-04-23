"use client";
import { getContactPage } from "@/lib/strapi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HoverTooltip from "./HoverTooltip";

const getShareUrl = (type, url) => {
  if (!url) return "#";

  const encodedUrl = encodeURIComponent(url);
  const normalizedType = type?.toLowerCase();

  switch (normalizedType) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    // Instagram не має офіційного веб‑шару, тому просто відкриємо Instagram
    case "instagram":
      return "https://www.instagram.com/";
    default:
      return url;
  }
};

const SocialLinks = ({ variant, className, needCopyBtn, isShareLinks = false, shareUrl }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [isTrackingCopyTooltip, setIsTrackingCopyTooltip] = useState(false);
  const listRef = useRef(null);
  const copyFeedbackTimeoutRef = useRef(null);

  const updateCopyTooltipPosition = (clientX, clientY) => {
    const listRect = listRef.current?.getBoundingClientRect();
    if (!listRect) return;

    setCopyTooltip((prev) => ({
      ...prev,
      x: clientX - listRect.left - 150,
      y: clientY - listRect.top - 22,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const contactData = await getContactPage();
      setContactInfo(contactData.Social_links);
    };
    fetchData();

    if (isShareLinks && typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [isShareLinks]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
        copyFeedbackTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isTrackingCopyTooltip) return undefined;

    const handleMouseMove = (event) => {
      updateCopyTooltipPosition(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTrackingCopyTooltip]);

  const effectiveShareUrl = shareUrl || currentUrl;

  const handleInstagramShare = async (event) => {
    if (!isShareLinks) return;

    // Для Instagram пробуємо використати Web Share API або копіюємо лінк
    event.preventDefault();

    const urlToShare = effectiveShareUrl;
    if (!urlToShare) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url: urlToShare });
        return;
      } catch {
        // ігноруємо помилку та падаємо до копіювання
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(urlToShare);
      } catch {
        // тихо ігноруємо, якщо неможливо скопіювати
      }
    }
  };

  const handleCopyLink = async (event) => {
    let urlToCopy = effectiveShareUrl;

    if (!urlToCopy && typeof window !== "undefined") {
      urlToCopy = window.location.href;
    }

    if (!urlToCopy) return;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(urlToCopy);
        setIsCopied(true);
        const buttonRect = event?.currentTarget?.getBoundingClientRect();
        const fallbackX = buttonRect
          ? buttonRect.left + buttonRect.width / 2
          : 0;
        const fallbackY = buttonRect
          ? buttonRect.top + buttonRect.height / 2
          : 0;

        const clientX = Number.isFinite(event?.clientX)
          ? event.clientX
          : fallbackX;
        const clientY = Number.isFinite(event?.clientY)
          ? event.clientY
          : fallbackY;

        updateCopyTooltipPosition(clientX, clientY);
        setCopyTooltip((prev) => ({ ...prev, visible: true }));
        setIsTrackingCopyTooltip(true);

        if (copyFeedbackTimeoutRef.current) {
          clearTimeout(copyFeedbackTimeoutRef.current);
        }

        copyFeedbackTimeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          setCopyTooltip((prev) => ({ ...prev, visible: false }));
          setIsTrackingCopyTooltip(false);
          copyFeedbackTimeoutRef.current = null;
        }, 4000);
      } catch {
        // тихо ігноруємо, якщо неможливо скопіювати
      }
    }
  };

  return (
    <ul ref={listRef} className={`relative flex items-center gap-2 ${className}`}>
      {contactInfo?.map((link) => {
        const isInstagram = link.Type?.toLowerCase() === "instagram";
        const href = isShareLinks
          ? getShareUrl(link.Type, effectiveShareUrl)
          : link.Link;

        return (
          <li key={link.id}>
            <Link
              target="_blank"
              className={`relative group flex p-2.5 border ${variant === "dark" ? "border-beige" : "border-brownDark"}  rounded-full md:transition-all md:duration-500 md:ease-[var(--ease-in-out)]`}
              href={href}
              onClick={isShareLinks && isInstagram ? handleInstagramShare : undefined}
            >
              <div
                className={`absolute inset-0 rounded-full ${variant === "dark" ? "bg-dark" : "bg-textWhite"}  transform scale-0 md:group-hover:scale-100 md:transition-transform md:duration-500 md:group-hover:duration-600 md:group-hover:ease-[var(--ease-in-out)] md:ease-[var(--ease-in-out)]`}
              ></div>
              <Image
                src={
                  variant === "dark"
                    ? `/icons/${link.Type}.svg`
                    : `/icons/${link.Type}-white.svg`
                }
                width={20}
                height={20}
                alt={`${link.Icon} icon`}
                className="md:group-hover:invert-100 md:transition-all md:duration-500 md:group-hover:duration-600 md:group-hover:ease-[var(--ease-in-out)] md:ease-[var(--ease-in-out)]"
              />
            </Link>
          </li>
        );
      })}
      {needCopyBtn && (
        <li className="relative">
          <HoverTooltip
            visible={copyTooltip.visible}
            x={copyTooltip.x}
            y={copyTooltip.y}
            className="z-40"
            showDot={false}
            text="Copied"
            textStyle={{ fontSize: 14 }}
            labelClassName="bg-dark"
            textClassName='text-textWhite'
          />
          <button
            className={`relative group text-dark flex p-2.5 border border-beige  rounded-full md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:hover:text-textWhite`}
            type="button"
            onClick={handleCopyLink}
          >
            <div
              className={`absolute inset-0 rounded-full bg-dark transform scale-0 md:group-hover:scale-100 md:transition-transform md:duration-500 md:group-hover:duration-600 md:group-hover:ease-[var(--ease-in-out)] md:ease-[var(--ease-in-out)]`}
            ></div>
            <svg
              className={`absolute inset-0 z-10 m-auto js-check-icon transition-opacity duration-400 ${
                isCopied ? "opacity-100" : "opacity-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="9"
              viewBox="0 0 13 9"
              fill="none"
            >
  <path d="M4.14104 8.81896L0 4.67792L0.594584 4.08333L4.14104 7.62979L11.7708 0L12.3654 0.594583L4.14104 8.81896Z" fill="currentColor"/>
</svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`relative z-10 js-copy-link-icon transition-opacity duration-400 ${
                isCopied ? "opacity-0" : "opacity-100"
              }`}
            >
              <path
                d="M7.59625 14.1667C7.21264 14.1667 6.89236 14.0382 6.63542 13.7812C6.37847 13.5243 6.25 13.204 6.25 12.8204V3.84625C6.25 3.46264 6.37847 3.14236 6.63542 2.88542C6.89236 2.62847 7.21264 2.5 7.59625 2.5H14.0704C14.454 2.5 14.7743 2.62847 15.0312 2.88542C15.2882 3.14236 15.4167 3.46264 15.4167 3.84625V12.8204C15.4167 13.204 15.2882 13.5243 15.0312 13.7812C14.7743 14.0382 14.454 14.1667 14.0704 14.1667H7.59625ZM7.59625 13.3333H14.0704C14.1988 13.3333 14.3163 13.2799 14.4231 13.1731C14.5299 13.0663 14.5833 12.9488 14.5833 12.8204V3.84625C14.5833 3.71792 14.5299 3.60035 14.4231 3.49354C14.3163 3.38674 14.1988 3.33333 14.0704 3.33333H7.59625C7.46792 3.33333 7.35035 3.38674 7.24354 3.49354C7.13674 3.60035 7.08333 3.71792 7.08333 3.84625V12.8204C7.08333 12.9488 7.13674 13.0663 7.24354 13.1731C7.35035 13.2799 7.46792 13.3333 7.59625 13.3333ZM5.09625 16.6667C4.71264 16.6667 4.39236 16.5382 4.13542 16.2812C3.87847 16.0243 3.75 15.7041 3.75 15.3206V5.51292H4.58333V15.3206C4.58333 15.4488 4.63674 15.5663 4.74354 15.6731C4.85035 15.7799 4.96792 15.8333 5.09625 15.8333H12.4038V16.6667H5.09625Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </li>
      )}
    </ul>
  );
};

export default SocialLinks;
