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
          content={process.env.GOOGLE_SITE_VERIFICATION}
        />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id='${process.env.GA4_PROPERTY_ID}'`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA4_PROPERTY_ID}');
        `}
      </Script>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='${process.env.GOOGLE_PUBLISHER_ID}'`}
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

  const { runReportWithAggregations } = require("../api/ga.js"); // write server-only code by creating a getInitialProps() method
  const cumulativeTotalCount = await runReportWithAggregations(
    "2022-01-01",
    "today",
  );
  const todayTotalCount = await runReportWithAggregations("yesterday", "today");
  
  const pageProps = {};
  pageProps["mappings"] = mappings;
  pageProps["visitors"] = {
    today: todayTotalCount,
    total: cumulativeTotalCount,
  };

  return {
    pageProps,
  };
};
