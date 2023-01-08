import React from "react";
import { getNodeMap, toMappings } from "../utils/mappings";
import path from "path";
import MarkDownComponent from "../components/MarkDownComponent";
import fs from "fs";
import styled from "styled-components";
import Home from "../components/Preview";
import { useRouter } from "next/router";
import defaultStyle from "./../style";
import { getDateStringWithDiff } from "../utils/time";

const Container = styled.div`
  position: relative;
  top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const TopContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 24px;
  font-size: 12px;
  padding: 2px;
  padding-right: 20px;
`;
const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow-y: overlay;

  width: 100%;
  height: 100%;
  /* height: calc(100% - 24px);

  overflow-y: overlay;
  // width
  ::-webkit-scrollbar {
    width: 4px;
  }

  // Track
  ::-webkit-scrollbar-track {
    background: ${defaultStyle.color0};
  }

  // Handle
  ::-webkit-scrollbar-thumb {
    background: grey;
  }

  // Handle on hover
  ::-webkit-scrollbar-thumb:hover {
    background: black;
  } */
`;

// props = _app -> App.getInintialProps props + this -> getStaticProps props
export default function Post({
  pageProps,
  setLink,
  changeMenuState,
}) {
  const router = useRouter();
  const path = router.asPath;
  const visitors = pageProps.visitors;
  return (
    <Container>
      {/* <TopContainer>
        {visitors && (
          <div>
            오늘 방문자: {visitors.today} (총 방문자: {visitors.total})
          </div>
        )}
      </TopContainer> */}
      <BottomContainer>
        {path !== "/" ? (
          <MarkDownComponent
            post={pageProps.post}
            //meta={item.header.meta}
            //setLink={setLink}
          />
        ) : (
          <Home
            setLink={setLink}
            changeMenuState={changeMenuState}
            mappings={pageProps.mappings}
          />
        )}
      </BottomContainer>
    </Container>
  );
}

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

  // const { runReportWithAggregations } = require("../api/ga.js"); // write server-only code by creating a getInitialProps() method
  // const tomorrow = getDateStringWithDiff(1);
  // const yesterday = getDateStringWithDiff(-1);
  // const cumulativeTotalCount = await runReportWithAggregations(
  //   "2022-01-01",
  //   tomorrow,
  // );
  // const todayTotalCount = await runReportWithAggregations(yesterday, tomorrow);

  // props["visitors"] = {
  //   today: todayTotalCount,
  //   total: cumulativeTotalCount,
  // };

  // console.log({
  //   props, // 이것도 _app.js의 pageProps로 분해되어 전달된다.
  //   revalidate: 10,
  // });

  return {
    props, // 이것도 _app.js의 pageProps로 분해되어 전달된다.
    // revalidate: 10,
  };
}
