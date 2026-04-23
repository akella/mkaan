import Image from "next/image";
import AnimatedImage from "../ui/AnimatedImage";
import FAQAccordion from "../ui/FAQAccordion";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;


const faq = [
  {
    q: "Vision",
    a: "Mkaan focuses on creating ultra-luxury branded residences and managing full-cycle developments — from concept to delivery — across the UAE and selected global markets.",
  },
  {
    q: "Synergy",
    a: "We combine boutique attention to detail with institutional delivery standards, partnering with world‑class architects and suppliers to realize distinctive, enduring places.",
  },
  {
    q: "Mastery",
    a: "Primarily across the UAE with selected opportunities in global gateway cities where our brand and partner ecosystem can deliver exceptional value.",
  },
];

const CareerValues = ({ data }) => {
  return (
    <section className="pt-36 pl-[120px] pr-36 pb-[120px] max-md:pb-[88px] overflow-clip max-md:px-4 max-md:pt-[104px]">
      <div className="pl-6 max-md:pl-4 border-l border-brownDark">
        <div className="lg:max-w-[70%]">
          <p className="text-11 opacity-40">{data?.Title}</p>
          <h2 className="title-h2 mt-6">{data?.Main_text}</h2>
        </div>
        <div className="flex items-end max-lg:flex-col max-lg:items-center max-lg:gap-24 justify-between mt-[120px] max-md:mt-24 lg:h-[336px]">
          <div>
            <AnimatedImage >

            <Image
              src={
                data.Media ? ASSET_URL + data.Media.url : "/images/career.jpg"
              }
              alt={"team image"}
              width={240}
              height={327}
              className=""
              quality={100}
            />
            </AnimatedImage>
          </div>
          <FAQAccordion
            items={data.Dropdown_career}
            className={"md:max-w-[432px] w-full lg:h-[336px]"}
            listClassName="w-full border-t border-brownDark"
            itemClassName="border-b border-brownDark"
          />
        </div>
      </div>
    </section>
  );
};

export default CareerValues;
