import Image from "next/image";
import AnimatedImage from "../ui/AnimatedImage";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const AboutQuote = ({ data }) => {
  return (
    <section className="lg:h-screen px-[120px] lg:pt-36 max-md:px-4 flex items-center justify-center max-lg:py-8 max-md:pt-16">
      <div className="flex max-lg:flex-col max-lg:gap-6 items-center justify-between">
        <div className="pl-6 border-l border-l-brownDark w-[59.7%] max-lg:w-full max-md:pr-4">
          <p className="text-11 opacity-40">{data.Title}</p>
          <p className="mt-6 max-md:mt-4 title-h2">{data.Quote}</p>

          <div className="mt-24 max-md:mt-[72px]">
            <p className="text-14">{data.Name}</p>
            <p className="text-11 opacity-40 mt-1">{data.Position}</p>
          </div>
        </div>
        <AnimatedImage
          // withBorder={true}
          rootClass={
            "p-6 max-md:p-4 border border-brownDark h-[600px] max-sm:h-[430px] overflow-hidden w-[40.3%] max-lg:w-full"
          }
        >
          <div className="overflow-clip h-full">
            <Image
              width={432}
              height={553}
              src={
                `${ASSET_URL}${data.Image_author.url}` ||
                "/images/about/owner.jpg"
              }
              alt="owmer photo"
              className="h-full object-cover w-full"
              quality={100}
            />
          </div>
        </AnimatedImage>
      </div>
    </section>
  );
};

export default AboutQuote;
