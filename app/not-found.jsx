import Image from "next/image";
import ErrorPage from "@/components/sections/ErrorPage";
import { getErrorPage } from "@/lib/strapi";

const NotFound = async () => {
  const errorPageData = await getErrorPage();
  return (
    <section className="relative h-screen flex items-end justify-center pb-12 max-md:pb-10">
      <ErrorPage data={errorPageData.Hero_section_404} />

      <Image
        src={"/images/404.jpg"}
        alt="404 Not Found"
        fill
        className="object-cover z-10"
        quality={100}
      />
      <div className="absolute inset-0 bg-[radial-gradient(78.82%_78.82%_at_50%_50%,_#D9D9D9_0%,_rgba(217,_217,_217,_0.00)_100%)]"></div>
    </section>
  );
};

export default NotFound;
