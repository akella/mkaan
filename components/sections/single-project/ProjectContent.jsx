import Image from "next/image";
import NextProject from "./NextProject";
import ProjectPlan from "./ProjectPlan";
import MobileMaterialSlider from "./MobileMaterialSlider";
const ASSET_URL = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL;

const ProjectContent = ({ data, allProjects }) => {
  const projectsList = Array.isArray(allProjects) ? allProjects : [];
  const currentProjectIndex = projectsList.findIndex(
    (projectItem) =>
      projectItem?.id === data?.id ||
      projectItem?.documentId === data?.documentId ||
      projectItem?.Hero_section_project?.Slug === data?.Hero_section_project?.Slug,
  );
  const nextProject =
    projectsList.length === 0
      ? null
      : projectsList[
          currentProjectIndex === -1
            ? 0
            : (currentProjectIndex + 1) % projectsList.length
        ];

  const masterPlan = data?.Masterplan;
  const materials = data?.Materials;
  const gallery_1 = data?.Gallery_1;
  const gallery_2 = data?.Gallery_2;
  const challenge = data?.Challenge_block;
  const normalizedMasterPlan = masterPlan
    ? {
        ...masterPlan,
        Media_case: Array.isArray(masterPlan?.Detailed_plan)
          ? masterPlan.Detailed_plan
          : (masterPlan?.Media_case ?? []),
      }
    : null;

  const setImgWrapperClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "pb-6 max-md:pb-4 border-b border-b-brownDark col-span-full";
      case 1:
        return "pt-6 max-md:pt-4 max-h-[744px]";
      case 2:
        return "md:pl-6 pt-6 max-md:pt-4 max-h-[744px] md:max-h-[480px]";
      default:
        return "";
    }
  };
  const setSecondImgWrapperClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "col-span-full";
      case 1:
        return "pt-6 max-md:pt-4 md:max-h-[744px]";
      case 2:
        return "pt-6 max-md:pt-4";
      default:
        return "";
    }
  };
  const setThirdImgWrapperClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return " col-span-full";
      case 1:
        return "pt-6 max-md:pt-4 md:max-h-[744px]";
      case 2:
        return "md:pl-6 pt-6 max-md:pt-4 md:max-h-[480px]";
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
  const getSecondImageClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "w-full object-cover py-6 max-md:py-4 border-b border-b-brownDark";
      case 1:
        return "w-full object-cover md:pr-6 pb-6 max-md:pb-4 max-md:border-b max-md:border-b-brownDark";
      case 2:
        return "w-full object-cover md:border-l md:pl-6 pb-6 md:border-l-brownDark";
      default:
        return "";
    }
  };
  const getThirdImageClass = (index) => {
    const normalizedIndex = index % 3;

    switch (normalizedIndex) {
      case 0:
        return "w-full object-cover py-6 max-md:py-4 border-b border-b-brownDark";
      case 1:
        return "w-full object-cover md:pr-6 pb-6 max-md:pb-4 md:border-r md:border-r-brownDark max-md:border-b max-md:border-b-brownDark";
      case 2:
        return "w-full object-cover";
      default:
        return "";
    }
  };
  return (
    <>
      <section className="relative z-10 bg-dark p-6 max-md:p-4">
        {gallery_1 && (
          <div className="grid grid-cols-2 max-md:grid-cols-1">
            {gallery_1.Media.map((mediaItem, index) => (
              <div
                key={index}
                className={setImgWrapperClass(index)}
              >
                <Image
                  src={ASSET_URL + mediaItem.url || "/images/single-pr/1.jpg"}
                  width={mediaItem.width || 1392}
                  height={mediaItem.height || 744}
                  alt="project image"
                  className={`${getImageClass(index)} h-full`}
                  quality={100}
                />
              </div>
            ))}
          </div>
        )}
        <div>
          {challenge && (
            <div className="grid md:grid-cols-2">
              <div className="col-start-2 md:py-[120px] max-md:my-20 pl-6 max-md:pl-4 border-l border-l-brownDark -ml-px pr-24 max-md:pr-4">
                <p className="text-11 opacity-40">{challenge.Title}</p>
                <p className="mt-6 text-20 !normal-case">
                  {challenge.Description}
                </p>
              </div>
            </div>
          )}
          {challenge.Media && (
            <div className="grid md:grid-cols-2">
              {challenge.Media.map((mediaItem, index) => (
                <div
                  key={index}
                  className={`${setSecondImgWrapperClass(index)} max-h-[744px]`}
                >
                  <Image
                    src={ASSET_URL + mediaItem.url || "/images/single-pr/4.jpg"}
                    width={mediaItem.width || 1392}
                    height={mediaItem.height || 744}
                    alt="project image"
                    className={`${getSecondImageClass(index)} h-full`}
                    quality={100}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <ProjectPlan plansData={normalizedMasterPlan ?? masterPlan} />
        {gallery_2 && (
          <div className="grid md:grid-cols-2 max-md:mt-20">
            {gallery_2.Media.map((mediaItem, index) => (
              <div key={index} className={`${setThirdImgWrapperClass(index)}`}>
                <Image
                  src={ASSET_URL + mediaItem.url || "/images/single-pr/7.jpg"}
                  width={mediaItem.width || 1392}
                  height={mediaItem.height || 744}
                  alt="project image"
                  className={`${getThirdImageClass(index)} h-full`}
                  quality={100}
                />
              </div>
            ))}
          </div>
        )}
        {materials && (
          <div className="max-md:-mx-4">
            <div className="grid md:grid-cols-2 max-md:px-4">
              <div className="col-start-2 md:pt-[120px] max-md:mt-24 pl-6 border-l border-l-brownDark -ml-px max-w-[500px]">
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
              {materials.Detailed_info[2] ? (
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
      </section>
      {nextProject && <NextProject data={nextProject} />}
    </>
  );
};

export default ProjectContent;
