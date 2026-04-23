import Image from "next/image";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const NewsImage = ({ image }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-[360px] md:fixed md:inset-0 md:h-auto">
      <Image
        src={image ? `${ASSET_URL}${image.url}` : "/images/single-news.jpg"}
        fill
        alt="News Image"
        className="object-cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,9,14,0.75)_0%,rgba(20,9,14,0)_100%)]"></div>
    </div>
  );
};

export default NewsImage;
