import { Suspense } from "react";
import LocalFont from "next/font/local";
import { ModalProvider } from "@/components/context/ModalContext";
import { cn } from "@/lib/utils";
import ScrollRestorationDisabler from "@/components/snippets/ScrollRestorationDisabler";
import "./globals.css";
import LenisWrapper from "@/components/providers/LenisWrapper";
import ViewTransitionEffects from "@/components/providers/ViewTransitionEffects";
import RouterPreventScrollRestoration from "@/components/snippets/RouterPreventScrollRestoration";
import { ViewTransitions } from "next-view-transitions";
import CustomCursor from "@/components/ui/CustomCursor";
import { getFormsFieldsPage, getAllHeroImages } from "@/lib/strapi";
import HeroPreloadProvider from "@/components/providers/HeroPreloadProvider";
import TransitionFadeHandler from "@/components/providers/TransitionFadeHandler";
// import { CubicMid } from "@/lib/constants";
import Cookies from "@/components/ui/Cookies";

const HelveticaNeue = LocalFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    // {
    //   path: "../public/fonts/HelveticaNeueMedium.otf",
    //   weight: "500",
    //   style: "normal",
    // },
    {
      path: "../public/fonts/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-helvetic",
  display: "swap",
});

const generalSans = LocalFont({
  src: "../public/fonts/general-sans-variable.woff2",
  variable: "--font-general",
});
const hedvig = LocalFont({
  src: "../public/fonts/HedvigLettersSerif_14pt-Regular.ttf",
  variable: "--font-hedvig",
});
// const helvetica = LocalFont({
//   src: "../public/fonts/helvetica-neue-bold.woff2",
//   variable: "--font-helvetica",
//   weight: "bold",
// });

const fontsClass = `${HelveticaNeue.variable} ${generalSans.variable} ${hedvig.variable}`;

export const metadata = {
  title: "Memar",
  description: "Memar",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  //   userScalable: "no",
  // },
};

export default async function RootLayout({ children }) {
  const [formFieldsData, heroImages] = await Promise.all([
    getFormsFieldsPage(),
    getAllHeroImages(),
  ]);
  return (
    <ViewTransitions>
      <html lang="en" className="bg-background">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: "history.scrollRestoration='manual';window.scrollTo(0,0)",
            }}
          />
          {/* <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="64x64"
            href="/favicon-64x64.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-chrome-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/android-chrome-512x512.png"
          /> */}
          {/* <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          /> */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content"
          />
        </head>
        <body className={cn(fontsClass, "antialiased")}>
          <Cookies />
          {/* <ScrollRestorationDisabler /> */}
          <HeroPreloadProvider heroImages={heroImages}>
            <ModalProvider data={formFieldsData}>
              <LenisWrapper>
                {children}
                <ViewTransitionEffects />
                <Suspense fallback={null}>
                  <RouterPreventScrollRestoration />
                </Suspense>
                <Suspense fallback={null}>
                  <TransitionFadeHandler />
                </Suspense>
              </LenisWrapper>
              <CustomCursor />
            </ModalProvider>
          </HeroPreloadProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
