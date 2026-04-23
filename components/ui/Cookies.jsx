"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_NAME = "mkaan_cookies_accepted";

const hasAcceptedCookies = () => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .some((item) => item.startsWith(`${COOKIE_NAME}=true`));
};

const setCookiesAccepted = () => {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${maxAge}; samesite=lax`;
};

const Cookies = () => {
  const [isAccepted, setIsAccepted] = useState(true);

  useEffect(() => {
    setIsAccepted(hasAcceptedCookies());
  }, []);

  const handleAgree = () => {
    setCookiesAccepted();
    setIsAccepted(true);
  };

  return (
    <div
      className={`fixed max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-max bottom-6 max-md:bottom-4 left-6 z-50 transition-opacity duration-600 ease-[var(--ease-in-out)] ${
        isAccepted ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <ul className=" flex items-center text-14">
        <li className="bg-textWhite px-3 py-1.5 text-dark border-r pointer-events-none border-beige">
          <p>This website uses cookies.</p>
        </li>
        <li className="bg-textWhite px-3 py-1.5 text-dark hover:bg-wine hover:text-textWhite transition-all duration-600 ease-[var(--ease-in-out)] border-r border-beige">
          <Link target="_blank" href="#" className="">
            Policy
          </Link>
        </li>
        <li className="bg-textWhite px-3 py-1.5 text-dark hover:bg-wine hover:text-textWhite transition-all duration-600 ease-[var(--ease-in-out)]">
          <button type="button" onClick={handleAgree}>
            Agree
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Cookies;
