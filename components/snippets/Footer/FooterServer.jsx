import FooterClient from "./FooterClient";

const FooterServer = async ({ variant }) => {
  return <FooterClient variant={variant} />;
};

export default FooterServer;
