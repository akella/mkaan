"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ErrorPage = ({ data }) => {
  const animatedLine = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const element = animatedLine.current;
    if (!element) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 7000);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="relative z-20 flex flex-col gap-6 items-center">
      <p className="text-11 opacity-40">{data.Title}</p>
      <h1 className="text-28 text-center max-w-[400px] max-md:max-w-[275px]">
        {data.Main_text}
      </h1>
      <div className="relative w-px h-[228px] bg-brownDark">
        <div
          ref={animatedLine}
          className={`absolute inset-0 bg-textWhite origin-top transition-transform duration-[7000ms] ${
            isAnimating ? "scale-y-100" : "scale-y-0"
          }`}
        ></div>
      </div>
      <ButtonLink tag="a" text={"back home"} href="/" />
    </div>
  );
};

export default ErrorPage;
