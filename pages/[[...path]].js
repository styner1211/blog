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
  height: calc(100% - 24px);

  overflow-y: overlay;
  /* width */
  ::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${defaultStyle.color0};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: grey;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: black;
  }
`;

// props = _app -> App.getInintialProps props + this -> getStaticProps props
export default function Post({
  pageProps,
  setLink,
  changeMenuState,
  onClickContent,
}) {
  const router = useRouter();
  const path = router.asPath;
  const visitors = pageProps.visitors;
  return (
    <Container>
      <TopContainer>
        {visitors && (
          <div>
            오늘 방문자: {visitors.today} (총 방문자: {visitors.total})
          </div>
        )}
      </TopContainer>
      <BottomContainer onClick={onClickContent}>
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

export async function getServerSideProps(context) {
  const { runReportWithAggregations } = require("../api/ga.js"); // write server-only code by creating a getInitialProps() method
  const tommorrow = getDateStringWithDiff(1);
  const yesterday = getDateStringWithDiff(-1);
  const cumulativeTotalCount = await runReportWithAggregations(
    "2022-01-01",
    tommorrow,
  );
  const todayTotalCount = await runReportWithAggregations(yesterday, tommorrow);

  return {
    props: {
      visitors: {
        today: todayTotalCount,
        total: cumulativeTotalCount,
      },
    },
  };
}
