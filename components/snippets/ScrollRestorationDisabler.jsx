import Script from "next/script";

export default function ScrollRestorationDisabler() {
  return (
    <>
      <Script
        id="scroll-restoration-disabler"
        strategy="beforeInteractive"
        src={`${process.env.NEXT_PUBLIC_URL}/scripts/restoration.js`}
      />
    </>
  );
}