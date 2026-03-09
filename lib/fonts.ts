import localFont from "next/font/local";

export const avenir = localFont({
  src: [
    {
      path: "../public/Avenir-Next-Font/AvenirNextLTPro-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Avenir-Next-Font/AvenirNextLTPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/Avenir-Next-Font/AvenirNextLTPro-Demi.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/Avenir-Next-Font/AvenirNextLTPro-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/Avenir-Next-Font/AvenirNextLTPro-Regular.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-avenir",
  display: "swap",
});