import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Router, { useRouter } from "next/router";
import { fontMono, fontSans } from "@/config/fonts.configs";
import { SWRConfig } from "swr";

import "@/styles/globals.css";
import { SiteDataProvider } from "@/context/context.site-data";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", (url: string) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider defaultTheme={"light"} attribute={"class"}>
        <SWRConfig
          value={{
            fetcher: (url: string, ...rest) =>
              fetch(url).then((res) => res.json()),
          }}
        >
          <SiteDataProvider>
            <Component {...pageProps} />
          </SiteDataProvider>
        </SWRConfig>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
