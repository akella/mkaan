"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const planData = [
  {
    img: "/images/single-pr/plan.png",
    title: "Overview",
  },
  {
    img: "/images/single-pr/plan-4.png",
    title: "First Floor",
  },
  {
    img: "/images/single-pr/plan.png",
    title: "Second Floor",
  },
  {
    img: "/images/single-pr/plan-4.png",
    title: "Terrace",
  },
];

const IMAGE_FADE_MS = 300;

const ProjectPlan = ({ data = planData, className, plansData }) => {
  const [activePlan, setActivePlan] = useState(plansData?.Media_case[0]?.Title);
  const activePlanData =
    plansData?.Media_case.find((plan) => plan.Title === activePlan) ??
    data[0] ??
    null;
  const [displayedPlan, setDisplayedPlan] = useState(activePlanData);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!activePlanData || activePlanData.Title === displayedPlan?.Title) {
      return;
    }

    setIsFadingOut(true);
    const timeoutId = setTimeout(() => {
      setDisplayedPlan(activePlanData);
      setIsFadingOut(false);
    }, IMAGE_FADE_MS);

    return () => clearTimeout(timeoutId);
  }, [activePlanData, displayedPlan?.Title]);

  const handlePlanClick = (title) => {
    setActivePlan(title);
  };
  return (
    <div
      className={`max-md:pl-4 max-md:border-l max-md:border-l-brownDark max-md:mt-20 md:pb-[120px]`}
    >
      <div className="grid md:grid-cols-2">
        <div className="col-start-2 md:pt-[120px] pl-6 max-md:pl-0 md:border-l md:border-l-brownDark -ml-px pr-28 max-md:pr-4">
          <p className="text-11 opacity-40">{plansData.Title}</p>
          <p className="mt-6 text-20 !normal-case">{plansData.Description}</p>
        </div>
      </div>
      <div
        className={`flex max-md:flex-col max-md:items-start max-md:gap-6 items-center justify-between pl-[146px] pr-36 max-lg:px-10 max-md:px-0 mt-[72px] max-md:mt-14 ${className}`}
      >
        <div className="flex flex-col gap-2 max-w-[200px] w-full">
          {plansData.Media_case.map((button) => (
            <button
              onClick={() => handlePlanClick(button.Title)}
              key={button.Title}
              className="group text-14 flex items-center gap-4"
            >
              <div className="flex items-center gap-1">
                <p
                  className={`transition-opacity duration-400 ${
                    activePlan === button.Title
                      ? "opacity-100"
                      : "opacity-40 group-hover:opacity-100"
                  }`}
                >
                  [
                </p>
                <div
                  className={`w-1 h-1 bg-textWhite rounded-full transition-opacity duration-400 ${
                    activePlan === button.Title ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                <p
                  className={`transition-opacity duration-400 ${
                    activePlan === button.Title
                      ? "opacity-100"
                      : "opacity-40 group-hover:opacity-100"
                  }`}
                >
                  ]
                </p>
              </div>
              <p>{button.Title}</p>
            </button>
          ))}
        </div>
        <div className="relative max-w-[912px] w-full h-[245px] md:h-[506px] overflow-hidden">
          {displayedPlan && (
            <Image
              key={displayedPlan.Title}
              src={ASSET_URL + displayedPlan.Media.url}
              width={912}
              height={506}
              quality={100}
              alt={`${displayedPlan.Title} plan`}
              className={`w-full h-auto md:h-full object-contain max-sm:h-full transition-opacity duration-300 ${
                isFadingOut ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlan;
