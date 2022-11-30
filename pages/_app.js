import MainApp from "../components/MainApp";
import { getNodeMap, toMappings } from "../utils/mappings";
import "../markdown-styles.css";
import Script from "next/script";
import Head from "next/head";
import { getDateStringWithDiff } from "../utils/time";
import path from "path";
import { fs } from "fs";

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
  const pageProps = {};
  pageProps["mappings"] = mappings;

  return {
    pageProps,
  };
};

// 데이터에 따라 pre-rendering할 페이지의 동적 경로를 지정하는 함수
// getStaticPaths는 paths를 getStaticProps 로 리턴
// { params: { path: [""] } } => path: [...path].js
export async function getStaticPaths() {
  const path = require("path"); // LOOK HERE
  const filePath = path.resolve("pages");
  const nodeMap = getNodeMap(filePath); ////
  const mappings = toMappings(nodeMap);
  const paths = [{ params: { path: [""] } }]; // [[...path]].js의 루트 패스는 ""
  if (mappings) {
    for (const e1 of mappings) {
      const header = e1.header.path;
      const path1 = [header];
      paths.push({ params: { path: path1 } });
      for (const e2 of e1.side_bar) {
        const sidebar = e2.path;
        const path2 = [header, sidebar];
        paths.push({ params: { path: path2 } });
        for (const e3 of e2.sub) {
          const sub = e3.path;
          const path3 = [header, sidebar, sub];
          paths.push({ params: { path: path3 } });
        }
      }
    }
  }

  return {
    paths: paths,
    fallback: true,
  };
}

// 빌드 시 데이터를 패치하는 함수
// Next.js가 빌드시 알아서 함수를 실행하고, 그 props를 컴포넌트에 전달
// params: getStaticPaths로 부터 전달 받음
export async function getStaticProps({ params }) {
  let props = { post: null, path: "/" };
  if (params.path) {
    // 여기서 path는 [[...path]]
    const arr = [];
    params.path.forEach((e) => arr.push(e));

    const basePath = path.resolve("pages");
    const currPath = arr.join("/");
    const asPath = basePath + path.sep + currPath;

    let post = null;
    if (fs.existsSync(asPath + path.sep + "post.md")) {
      post = fs.readFileSync(asPath + path.sep + "post.md").toString();
    }

    props["path"] = currPath;
    if (post) {
      props["post"] = post;
    }
  }

  return {
    props, // 이것도 _app.js의 pageProps로 분해되어 전달된다.
  };
}
