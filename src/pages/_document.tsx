import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";
import { fontSans } from "@/config/fonts.configs";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body
        className={clsx(
          "bg-gray-100 font-sans antialiased",
          // "bg-gradient-to-tr from-gray-300 to-gray-50",
          fontSans.variable
        )}
        style={{ minHeight: "200vh" }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
