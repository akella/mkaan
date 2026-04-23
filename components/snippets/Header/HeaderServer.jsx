import HeaderClient from "./HeaderClient";

// Server component for fetching HEADER dat from Strapi
const HeaderServer = async ({
  pageName,
  rootClassname,
  isRootPage = false,
}) => {
  return (
    <HeaderClient
      pageName={pageName}
      rootClassname={rootClassname}
      isRootPage={isRootPage}
    />
  );
};

export default HeaderServer;
