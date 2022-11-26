import React, { lazy, Suspense } from "react";
import styled, { css } from "styled-components";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html {
    /* background: #e9ecef; */
    margin: 0px;
    padding: 0px;
    font-size: 12px;
  }
  
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  ${(props) => props.responsive === "desktop" && css``}
  ${(props) => props.responsive === "mobile" && css``}
  ${(props) => props.responsive === "tablet" && css``}
`;

const GeneralComponent = React.memo(function GeneralComponent({ component }) {
  const Compoment = lazy(() =>
    // relative path for GeneralComponent.js => ../../pages/
    import(`../pages/${component}`),
  );
  return (
    <Container>
      <GlobalStyle />
      <Suspense fallback={<div>loading ...</div>}>
        <Compoment />
      </Suspense>
    </Container>
  );
});

export default React.memo(GeneralComponent);
