import MainApp from "../components/MainApp";
import { getNodeMap, toMappings } from "../utils/mappings";
import "../markdown-styles.css";
import Script from "next/script";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_PUBLISHER_ID}`}
        crossorigin="anonymous"
      />
      <MainApp Component={Component} pageProps={pageProps} />
    </>
  );
}

App.getInitialProps = async () => {
  const path = require("path"); // LOOK HERE
  const filePath = path.resolve("pages");
  const nodeMap = getNodeMap(filePath);
  const mappings = toMappings(nodeMap);
  const pageProps = {};
  pageProps["mappings"] = mappings;

  return {
    pageProps,
  };
};
