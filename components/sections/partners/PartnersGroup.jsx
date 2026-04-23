"use client";
import { useState } from "react";
import Image from "next/image";

const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const PartnersGroup = ({ data }) => {
  const [activePartner, setActivePartner] = useState(null);

  return (
    <>
      {data.map((group, index) => (
        <div
          id={group.partner_specialization.Specialization_of_partner}
          key={index}
          className="flex max-md:flex-col md:h-full md:w-max max-md:w-full"
        >
          <div className="max-w-[304px] max-md:max-w-full w-full md:h-full bg-textWhite">
            <div className="relative md:h-[87%] max-md:h-[344px]">
              <Image
                src={
                  group?.Media?.url
                    ? ASSET_URL + group.Media.url
                    : "/images/partners/gr-2.jpg"
                }
                width={432}
                height={552}
                quality={100}
                alt="group image"
                className="object-cover mix-blend-darken h-full"
              />
              <div className="absolute w-full h-1/3 max-md:h-1/2 bottom-0 bg-[linear-gradient(180deg,_rgba(247,_247,_235,_0.00)_0%,_#F7F7EB_100%)]"></div>
            </div>
            <div className="bg-textWhite text-dark h-auto text-28 px-6 py-7 max-md:!text-[28px] max-md:!leading-[32px] max-md:!tracking-[-0.35px]">
              <h3 className="max-w-[164px] max-md:max-w-[140px]">
                {group.partner_specialization.Specialization_of_partner}
              </h3>
            </div>
          </div>
          <div className="relative flex max-md:flex-col md:h-full">
            {group.one_partner_infos.map((partner, partnerIndex) => (
              <div
                key={partnerIndex}
                id={`${partner.Name}-${partnerIndex}-${group.partner_specialization.Specialization_of_partner}`}
                className="relative z-10 flex items-center justify-center md:max-w-[402px] md:min-w-[402px] w-full h-full max-md:h-[375px] md:border-r md:border-r-brownDark max-md:border-b max-md:border-b-brownDark"
              >
                <div className="">
                  <Image
                    src={ASSET_URL + partner.Logo.url}
                    width={partner.Logo.width}
                    height={partner.Logo.height}
                    alt="partner logo"
                  />
                </div>
                <button
                  id={`${partner.Name}-${partnerIndex}-${group.partner_specialization.Specialization_of_partner}`}
                  onClick={(e) => setActivePartner(e.currentTarget.id)}
                  className="group p-2.5 text-textWhite rounded-full border border-brownDark ml-auto absolute bottom-6 max-md:bottom-3 right-6 max-md:right-3 transition-all duration-600 hover:duration-400 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:text-wine"
                >
                  <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 transition-all duration-600 ease-[var(--ease-in-out)] group-hover:scale-100 group-hover:duration-400 group-hover:ease-[var(--ease-in)]"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative z-10"
                  >
                    <path
                      d="M9.58594 16.6654V10.4154H3.33594V9.58203H9.58594V3.33203H10.4193V9.58203H16.6693V10.4154H10.4193V16.6654H9.58594Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute sm:inset-0 bg-textWhite flex items-center justify-center p-6 pr-16 transition-opacity duration-600 ease-[var(--ease-in-out)] ${activePartner === `${partner.Name}-${partnerIndex}-${group.partner_specialization.Specialization_of_partner}` ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} max-sm:w-[calc(100%-31px)] max-sm:h-[calc(100%-31px)] max-sm:bottom-0 max-sm:left-0`}
                >
                  <p className="text-14 text-dark">{partner.Description}</p>
                  <div className="absolute left-6 bottom-6">
                    <Image
                      src={ASSET_URL + partner.Logo.url}
                      width={partner.Logo.width}
                      height={partner.Logo.height}
                      alt="partner logo"
                      className="partner-inner-logo"
                    />
                  </div>
                  <button
                    onClick={() => setActivePartner(null)}
                    className="text-dark p-2.5 group transition-all duration-600 hover:duration-400 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:text-textWhite rounded-full border border-beige ml-auto absolute z-30 bottom-6 max-md:top-3 right-6 max-md:right-3 h-fit"
                  >
                    <div className="absolute inset-0 rounded-full bg-wine transform scale-0 transition-all duration-600 ease-[var(--ease-in-out)] group-hover:scale-100 group-hover:duration-400 group-hover:ease-[var(--ease-in)]"></div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative z-10"
                    >
                      <path
                        d="M5.83203 10.4166V9.58331H14.1654V10.4166H5.83203Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <Image
              src={"/images/own/3.jpg"}
              fill
              alt="bg-image"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-partnerOverlay"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PartnersGroup;
