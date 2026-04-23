"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const INITIAL_COUNT = 3;

const PartnersBlock = ({ partners, assetUrl }) => {
  if (!partners) return null;

  const partnersList = partners.Partners ?? [];
  const coreTeamList = partners.Core_team ?? [];

  const [visiblePartnersCount, setVisiblePartnersCount] =
    useState(INITIAL_COUNT);
  const [visibleCoreTeamCount, setVisibleCoreTeamCount] =
    useState(INITIAL_COUNT);

  useEffect(() => {
    setVisiblePartnersCount(INITIAL_COUNT);
  }, [partnersList.length]);

  useEffect(() => {
    setVisibleCoreTeamCount(INITIAL_COUNT);
  }, [coreTeamList.length]);

  const displayedPartners = partnersList.slice(0, visiblePartnersCount);
  const displayedCoreTeam = coreTeamList.slice(0, visibleCoreTeamCount);
  const shouldShowPartnersButton = partnersList.length > visiblePartnersCount;
  const shouldShowCoreTeamButton = coreTeamList.length > visibleCoreTeamCount;

  const mediaUrl = partners?.Media?.url;
  const coverSrc = mediaUrl ? `${assetUrl ?? ""}${mediaUrl}` : null;

  return (
    <div className="max-md:mt-24">
      {coverSrc && (
        <div className="py-6 max-md:py-4">
          <Image
            src={coverSrc}
            width={1392}
            height={744}
            alt="project image"
            className="w-full object-cover max-h-[744px]"
            quality={100}
          />
        </div>
      )}
      <div className="relative grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-8 sm:justify-self-center sm:py-[120px] max-sm:mt-24 max-sm:pl-4 max-sm:border-l max-sm:border-l-brownDark">
        <div className="sm:px-6 sm:text-right">
          <p className="text-11 opacity-40">partners</p>
          <ul className="flex flex-col gap-4 mt-6">
            {displayedPartners.map((partner, index) => (
              <li key={index}>
                <p className="text-20">{partner.Title}</p>
                <p className="text-14 opacity-40 mt-1">{partner.Description}</p>
              </li>
            ))}
          </ul>
          {shouldShowPartnersButton && (
            <button
              className="group overflow-x-clip relative after:content-[''] after:absolute after:-bottom-[0.5px] after:left-0 after:w-full after:h-[1px] after:bg-textWhite md:hover:after:-translate-x-[101%] md:after:transition-transform md:after:duration-400 mt-6"
              onClick={() =>
                setVisiblePartnersCount((prev) =>
                  Math.min(prev + INITIAL_COUNT, partnersList.length),
                )
              }
            >
              Show All
            </button>
          )}
        </div>
        <div className="sm:px-6">
          <p className="text-11 opacity-40">Core Team</p>
          <ul className="flex flex-col gap-4 mt-6">
            {displayedCoreTeam.map((member, index) => (
              <li key={index}>
                <p className="text-20">{member.Name_surname}</p>
                <p className="text-14 opacity-40 mt-1">{member.Position}</p>
              </li>
            ))}
          </ul>
          {shouldShowCoreTeamButton && (
            <button
              className="group overflow-x-clip relative after:content-[''] after:absolute after:-bottom-[0.5px] after:left-0 after:w-full after:h-[1px] after:bg-textWhite md:hover:after:-translate-x-[101%] md:after:transition-transform md:after:duration-400 mt-6"
              onClick={() =>
                setVisibleCoreTeamCount((prev) =>
                  Math.min(prev + INITIAL_COUNT, coreTeamList.length),
                )
              }
            >
              Show All
            </button>
          )}
        </div>
        <div className="absolute w-px h-full left-1/2 -translate-x-1/2 bg-brownDark max-sm:hidden"></div>
      </div>
    </div>
  );
};

export default PartnersBlock;
