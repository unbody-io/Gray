import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";
import {fontSans} from "@/config/fonts.configs";
import React from "react";

export default function Document() {
    return (
        <Html lang="en"
              suppressHydrationWarning
              className={"bg-gray-100"}
        >
            <Head />
            <body
                className={clsx(
                    "font-sans antialiased",
                    // "bg-gradient-to-tr from-gray-300 to-gray-50",
                    fontSans.variable
                )}
                style={{minHeight: "200vh"}}
            >
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
