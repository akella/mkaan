import Image from "next/image";
import Link from "next/link";
import parse, { domToReact } from "html-react-parser";
import ProjectPlan from "../single-project/ProjectPlan";
import MobileMaterialSlider from "../single-project/MobileMaterialSlider";
import PartnersBlock from "./PartnersBlock";
import NextCase from "./NextCase";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const CaseContent = ({ data, allCases }) => {
  const casesList = Array.isArray(allCases) ? allCases : [];
  const currentCaseIndex = casesList.findIndex(
    (caseItem) =>
      caseItem?.id === data?.id ||
      caseItem?.documentId === data?.documentId ||
      caseItem?.Hero_section_case?.Slug === data?.Hero_section_case?.Slug,
  );
  const nextCase =
    casesList.length === 0
      ? null
      : casesList[
          currentCaseIndex === -1
            ? 0
            : (currentCaseIndex + 1) % casesList.length
        ];

  const topGallery = data?.Gallery_block_case;
  const secondGallery = data?.Gallery_case.Media;
  const thirdGallery = data?.Gallery_case2.Media;
  const challengeBlock = data?.Challenge_block;
  const challengeBlock2 = data?.Challenge_block2;
  const masterPlanCase = data?.Masterplan_case;
  const materials = data?.Materials_case;
  const quote = data?.Quote_block_case;
  const partners = data?.Partners_block_case;

  const renderWithoutSpans = (html) => {
    if (!html) return null;

    return parse(html, {
      replace: (domNode) => {
        if (domNode.type === "tag" && domNode.name === "span") {
          return <>{domToReact(domNode.children)}</>;
        }
      },
    });
  };

  const renderMasterPlanArticle = (html) => {
    if (!html) return null;

    let preparedHtml = html.replace(/<br\s*\/?>/gi, "");
    preparedHtml = preparedHtml.replace(
      /<p\b[^>]*>(?:\s|&nbsp;|&#160;|&#xA0;|\u00A0)*<\/p>/gi,
      "",
    );

    const paragraphRegex = /<p\b[^>]*>[\s\S]*?<\/p>/gi;
    const paragraphMatches = [...preparedHtml.matchAll(paragraphRegex)];

    if (paragraphMatches.length >= 2) {
      const firstParagraph = paragraphMatches[0];
      const secondParagraph = paragraphMatches[1];
      const firstStart = firstParagraph.index;
      const firstEnd = firstStart + firstParagraph[0].length;
      const secondStart = secondParagraph.index;
      const secondEnd = secondStart + secondParagraph[0].length;

      if (typeof firstStart === "number" && typeof secondStart === "number") {
        const beforeFirst = preparedHtml.slice(0, firstStart);
        const betweenFirstSecond = preparedHtml.slice(firstEnd, secondStart);
        const afterSecond = preparedHtml.slice(secondEnd);
        const remainingParagraphs = [...afterSecond.matchAll(paragraphRegex)];

        let groupedRemainingParagraphsHtml = afterSecond;

        if (remainingParagraphs.length > 0) {
          const firstRemaining = remainingParagraphs[0];
          const lastRemaining =
            remainingParagraphs[remainingParagraphs.length - 1];
          const firstRemainingStart = firstRemaining.index;
          const lastRemainingStart = lastRemaining.index;

          if (
            typeof firstRemainingStart === "number" &&
            typeof lastRemainingStart === "number"
          ) {
            const lastRemainingEnd =
              lastRemainingStart + lastRemaining[0].length;
            groupedRemainingParagraphsHtml =
              afterSecond.slice(0, firstRemainingStart) +
              `<div className="flex flex-col gap-6">${afterSecond.slice(firstRemainingStart, lastRemainingEnd)}</div>` +
              afterSecond.slice(lastRemainingEnd);
          }
        }

        preparedHtml =
          beforeFirst +
          `<div className="flex flex-col gap-6">${firstParagraph[0]}${betweenFirstSecond}${secondParagraph[0]}</div>` +
          groupedRemainingParagraphsHtml;
      }
    } else {
      const allParagraphs = [...preparedHtml.matchAll(paragraphRegex)];

      if (allParagraphs.length > 0) {
        const firstParagraph = allParagraphs[0];
        const lastParagraph = allParagraphs[allParagraphs.length - 1];
        const firstParagraphStart = firstParagraph.index;
        const lastParagraphStart = lastParagraph.index;

        if (
          typeof firstParagraphStart === "number" &&
          typeof lastParagraphStart === "number"
        ) {
          const lastParagraphEnd = lastParagraphStart + lastParagraph[0].length;
          preparedHtml =
            preparedHtml.slice(0, firstParagraphStart) +
            `<div className="flex flex-col gap-6">${preparedHtml.slice(firstParagraphStart, lastParagraphEnd)}</div>` +
            preparedHtml.slice(lastParagraphEnd);
        }
      }
    }

    let parseOptions;
    parseOptions = {
      replace: (domNode) => {
        if (domNode.type === "tag" && domNode.name === "span") {
          return <>{domToReact(domNode.children, parseOptions)}</>;
        }
      },
    };

    return parse(preparedHtml, parseOptions);
  };

  const setImgWrapperClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "pb-6 max-md:pb-4 border-b border-b-brownDark";
      case 1:
        return "pt-6 max-md:pt-4 md:max-h-[744px]";
      case 2:
        return "md:pl-6 pt-6 max-md:pt-4 md:max-h-[480px]";
      default:
        return "";
    }
  };
  const setImgWrapperClassSecondGallery = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "md:col-span-full md:max-h-[744px]";
      case 1:
        return "pt-6 max-md:pt-4 md:max-h-[480px]";
      case 2:
        return "pt-6 max-md:pt-4 md:h-[744px]";
      default:
        return "";
    }
  };
  const setImgWrapperClassThirdGallery = (index) => {
    const normalizedIndex = index % 4;

    switch (normalizedIndex) {
      case 0:
        return "pb-6 max-md:pb-4 border-b border-b-brownDark md:col-span-full";
      case 1:
        return "pt-6 max-md:pt-4 max-md:pb-4 max-md:border-b max-md:border-b-brownDark";
      case 2:
        return "md:pl-6 pt-6 max-md:pt-4";
      case 3:
        return "py-6 max-md:py-4 border-t mt-6 max-md:mt-4 border-t-brownDark col-span-full";

      default:
        return "";
    }
  };

  const getImageClassSecondGallery = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "w-full object-cover py-6 max-md:py-4 border-b border-b-brownDark";
      case 1:
        return "w-full md:pr-6 max-md:pb-4 object-cover max-md:border-b max-md:border-b-brownDark";
      case 2:
        return "w-full object-cover pb-6 max-md:pb-4 md:pl-6 md:border-l md:border-l-brownDark max-md:border-b max-md:border-b-brownDark";
      default:
        return "";
    }
  };
  const getImageClassThirdGallery = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "w-full object-cover";
      case 1:
        return "w-full object-cover md:pr-6 max-md:border-b max-md:border-b-brownDark md:border-r md:border-r-brownDark";
      case 2:
        return "w-full object-cover";
      default:
        return "";
    }
  };
  const getImageClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "w-full object-cover";
      case 1:
        return "w-full object-cover md:pr-6 pb-6 max-md:pb-4 max-md:border-b max-md:border-b-brownDark md:border-r md:border-r-brownDark";
      case 2:
        return "w-full object-cover";
      default:
        return "";
    }
  };

  return (
    <>
      <section className="relative z-10 bg-dark p-6 max-md:p-4">
        <div className="grid grid-cols-2 max-md:grid-cols-1 [&_div]:first:col-span-full ">
          {topGallery?.Media.map((image, index) => (
            <div key={index} className={setImgWrapperClass(index)}>
              <Image
                src={`${ASSET_URL}${image.url}`}
                width={image.width}
                height={image.height}
                alt="project image"
                className={`${getImageClass(index)} h-full`}
                quality={100}
              />
            </div>
          ))}
        </div>
        <div>
          {challengeBlock && (
            <div className="grid grid-cols-2 max-md:grid-cols-1 items-end max-md:border-l max-md:border-l-brownDark">
              <div className="flex flex-col items-center gap-[85px] max-md:gap-8 max-md:row-start-2">
                <div>
                  <Image
                    src={"/images/single-case/map-path.svg"}
                    alt="map"
                    width={249}
                    height={256}
                    quality={100}
                  />
                </div>
                <Link
                  href={
                    "https://www.google.com/maps/search/United+Arab+Emirates,+Dubai+Hills/@25.1087767,55.233215,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                  }
                  target="_blank"
                  className="flex items-center gap-4 md:mb-[120px] mr-36 max-md:mr-12 group"
                >
                  <div className="relative p-2.5 rounded-full border border-brown">
                    <div className="absolute inset-0 rounded-full bg-textWhite scale-0 group-hover:scale-100 transition-transform duration-[var(--durIn)] ease-[var(--ease-in)]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative z-10"
                    >
                      <path
                        d="M4.17703 16.0641C3.97689 16.1525 3.78606 16.1383 3.60453 16.0216C3.42286 15.905 3.33203 15.7339 3.33203 15.5085V5.33329C3.33203 5.18482 3.36807 5.04913 3.44016 4.92621C3.51224 4.80343 3.61613 4.71795 3.75182 4.66975L7.43141 3.39746L12.5799 5.19434L15.8204 3.93267C16.0205 3.84642 16.2113 3.85309 16.3929 3.95267C16.5745 4.05225 16.6654 4.2094 16.6654 4.42413V10.3425C16.5581 10.2159 16.4482 10.0963 16.3356 9.9835C16.2228 9.87059 16.0977 9.76142 15.9602 9.656V4.60475L12.8983 5.74892V8.84288C12.7704 8.85788 12.6504 8.87309 12.5383 8.8885C12.4261 8.90406 12.311 8.92802 12.1931 8.96038V5.74892L7.80432 4.22975V14.6564L4.17703 16.0641ZM4.03724 15.3814L7.09911 14.2158V4.22975L4.03724 5.26704V15.3814ZM13.3235 15.3514C13.8861 15.3514 14.3577 15.1607 14.7383 14.7793C15.1188 14.3979 15.3096 13.9263 15.3106 13.3643C15.3117 12.8016 15.1215 12.3297 14.7399 11.9487C14.3583 11.5676 13.8861 11.377 13.3235 11.377C12.7609 11.377 12.289 11.5676 11.9079 11.9487C11.5269 12.3297 11.3364 12.8016 11.3364 13.3643C11.3364 13.9341 11.5269 14.4077 11.9079 14.7852C12.289 15.1627 12.7609 15.3514 13.3235 15.3514ZM13.3235 16.0566C12.5828 16.0566 11.9489 15.7931 11.4218 15.266C10.8947 14.7389 10.6312 14.105 10.6312 13.3643C10.6312 12.6214 10.8947 11.987 11.4218 11.461C11.9489 10.935 12.5828 10.672 13.3235 10.672C14.0664 10.672 14.7009 10.935 15.2268 11.461C15.7528 11.987 16.0158 12.6214 16.0158 13.3643C16.0158 13.6802 15.9685 13.9757 15.8739 14.2508C15.7795 14.5259 15.6405 14.7778 15.457 15.0064L17.4987 17.0214L17.0362 17.5L15.0052 15.4723C14.7743 15.6635 14.519 15.8087 14.2393 15.9079C13.9596 16.007 13.6543 16.0566 13.3235 16.0566Z"
                        fill="#F7F7EB"
                        className="group-hover:fill-dark duration-[var(--durIn)] ease-[var(--ease-in-out)]"
                      />
                    </svg>
                  </div>
                  <p className="max-w-[200px]">
                    United Arab Emirates, Dubai Hills{" "}
                  </p>
                </Link>
              </div>
              <div className="md:py-[120px] max-md:mb-20 max-md:mt-24 pl-6 max-md:pl-4 md:border-l md:border-l-brownDark -ml-px pr-[130px] max-lg:pr-4">
                <p className="text-11 opacity-40">{challengeBlock.Title}</p>
                <p className="mt-6 text-20 !normal-case">
                  {challengeBlock.Description}
                </p>
                <div className="text-14 flex max-sm:flex-col gap-6 mt-[72px] max-md:mt-14">
                  {renderWithoutSpans(challengeBlock.Article)}
                </div>
              </div>
            </div>
          )}
          <div className="grid [&_div]:first:col-span-full my-6 max-md:mt-20">
            <div>
              <Image
                src={"/images/single-case/4.jpg"}
                width={1392}
                height={744}
                alt="project image"
                className="w-full object-cover"
                quality={100}
              />
            </div>
          </div>
        </div>
        <ProjectPlan
          plansData={masterPlanCase}
          className={"max-sm:flex-col-reverse"}
        />
        <div>
          <div className="grid grid-cols-2 max-lg:grid-cols-1 md:gap-[98px] -ml-px pr-[120px] max-lg:pr-6 max-md:pr-0">
            <div className="col-start-2 text-14 md:grid md:grid-cols-2 max-md:flex max-md:flex-col gap-6 pl-6 max-md:pl-4 max-md:pt-14 max-md:ml-px border-l border-l-brownDark sm:pb-[120px]">
              {renderMasterPlanArticle(masterPlanCase.Article)}
            </div>
          </div>
          {secondGallery && (
            <div className="grid md:grid-cols-2 max-sm:grid-cols-1 max-md:mt-20">
              {secondGallery.map((image, index) => (
                <div
                  className={setImgWrapperClassSecondGallery(index)}
                  key={index}
                >
                  <Image
                    src={`${ASSET_URL}${image.url}`}
                    width={image.width}
                    height={image.height}
                    alt="project image"
                    quality={100}
                    className={`${getImageClassSecondGallery(index)} h-full`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {materials && (
          <div className="max-md:-mx-4">
            <div className="grid md:grid-cols-2 max-md:px-4">
              <div className="col-start-2 md:pt-[120px] max-md:mt-24 pl-6 border-l border-l-brownDark max-w-[500px]">
                <p className="text-11 opacity-40">{materials.Title}</p>
                <p className="mt-6 text-20 !normal-case">
                  {materials.Description}
                </p>
              </div>
            </div>
            <MobileMaterialSlider data={materials.Detailed_info} />
            <div className="grid grid-cols-4 max-lg:grid-cols-3 gap-12 mt-[72px] max-md:hidden">
              {materials.Detailed_info[0].Media && (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[0].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[0].Title}
                  </h3>
                </div>
              )}
              <div></div>
              {materials.Detailed_info[1].Media && (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[1].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[1].Title}
                  </h3>
                </div>
              )}
              <div></div>
              {materials.Detailed_info[2] &&
              materials.Detailed_info[2].Media ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[2].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[2].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              {materials.Detailed_info[3] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[3].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[3].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              <div></div>
              {materials.Detailed_info[4] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[4].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[4].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              <div></div>
              {materials.Detailed_info[5] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[5].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[5].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              {materials.Detailed_info[6] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[6].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[6].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              {materials.Detailed_info[7] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[7].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[7].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              {materials.Detailed_info[8] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[8].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[8].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
              <div></div>
              {materials.Detailed_info[9] ? (
                <div className="p-6 border border-brownDark">
                  <div>
                    <Image
                      src={ASSET_URL + materials.Detailed_info[9].Media.url}
                      width={264}
                      height={284}
                      alt="material image"
                      className="w-full object-cover"
                      quality={100}
                    />
                  </div>
                  <h3 className="mt-7 text-11">
                    {materials.Detailed_info[9].Title}
                  </h3>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
        {thirdGallery && (
          <div className="grid grid-cols-2 max-md:grid-cols-1 mt-12 max-md:mt-24">
            {thirdGallery &&
              thirdGallery.map((image, index) => (
                <div
                  key={index}
                  className={setImgWrapperClassThirdGallery(index)}
                >
                  <Image
                    src={`${ASSET_URL}${image.url}`}
                    width={image.width}
                    height={image.height}
                    alt="project image"
                    className={getImageClassThirdGallery(index)}
                    quality={100}
                  />
                </div>
              ))}
          </div>
        )}
        <div>
          <div className="">
            {challengeBlock2 && (
              <div className="md:max-w-1/2 ml-auto md:py-[120px] max-md:my-20 pl-6 max-md:pl-4 border-l border-l-brownDark pr-[130px] max-md:pr-4">
                <p className="text-11 opacity-40">{challengeBlock2.Title}</p>
                <p className="mt-6 text-20 !normal-case">
                  {challengeBlock2.Description}
                </p>
                <div className="text-14 flex max-md:flex-col gap-6 mt-[72px] max-sm:mt-8">
                  {renderWithoutSpans(challengeBlock2.Article)}
                </div>
              </div>
            )}
            {quote.Media && (
              <div className="py-6 max-md:py-4  overflow-hidden">
                <Image
                  src={`${ASSET_URL}${quote.Media.url}`}
                  width={1392}
                  height={744}
                  alt="project image"
                  className="w-full object-cover max-h-[744px]"
                  quality={100}
                />
              </div>
            )}
          </div>
        </div>
        {quote && (
          <div className="max-md:pl-4 max-md:border-l max-md:border-l-brownDark max-md:mt-24">
            <div className="flex flex-col items-center gap-6">
              <div className="w-px h-[208px] bg-brownDark max-sm:hidden"></div>
              <div className="max-w-[765px] flex flex-col gap-6 md:items-center">
                <p className="text-11 opacity-40">{quote.Title}</p>
                <h3 className="text-28 md:text-center">{quote.Quote}</h3>
              </div>
            </div>
            <div className="md:w-1/2 ml-auto mt-[76px] max-md:mt-[72px] md:pl-6 md:pt-12 md:pb-[120px] md:border-l md:border-l-brownDark text-14">
              <p>{quote.Author_name}</p>
              <p className="opacity-40">{quote.Author_position}</p>
            </div>
          </div>
        )}
        {partners && <PartnersBlock partners={partners} assetUrl={ASSET_URL} />}
      </section>
      {nextCase && <NextCase data={nextCase} />}
    </>
  );
};

export default CaseContent;
