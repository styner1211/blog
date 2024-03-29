import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import defaultStyle from "../style";
import Header from "./Header";
import SideBar from "./SideBar";
import { useIsMobile } from "../hooks/useMobile";
// import { runReport } from "../api/ga";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    // font-family: -apple-system, 'IBMPlexSansKR-Light', 'Courier New', monospace;
  }
  
  html, body {
    /* background: #e9ecef; */
    margin: 0;
    padding: 0;
    font-size: 16px;
    /* overflow: hidden; // disable to bounce effect in safari */

    ${(props) =>
    !props.collapsed && props.responsive === "mobile" &&
      css`
        overflow: hidden
      `
    }
  }
`;

const GlobalContainer = styled.div`
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  /* overflow: hidden; // */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${defaultStyle.color0};
  background-color: white;
  z-index: 1000;
`;

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  width: 100%;
  height: calc(100% - 50px);
`;

function MainApp({ Component, pageProps }) {
  const isMobile = useIsMobile();
  const responsive = isMobile ? "mobile" : "desktop";

  const [collapsed, setCollapsed] = useState(true);
  const [extend, setExtend] = useState(false);
  const [link, setLink] = useState("/");
  const [menuState, setMenuState] = useState({});

  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else {
      setCollapsed(false);
    }
  }, [isMobile]);

  // useEffect(() => {
  //   console.log(":!!!!!!!!!");
  //   runReport();
  // }, []);

  const onClickLink = (newLink) => {
    // if (newLink === link) {
    //   setCollapsed(!collapsed);
    // } else {
    //   setCollapsed(false);
    // }

    // if (responsive === "mobile") {
    //   setCollapsed(true);
    // }
    setLink(newLink);
  };

  const onClickSidebarMenu = (newLink) => {
    setLink(newLink);
  };

  const onClickMenuButton = () => {
    setCollapsed(!collapsed);
    setLink(link);
  };

  const onClickContent = () => {
    if (responsive === "mobile") {
      setCollapsed(true);
    }
    setExtend(false);
  };

  const changeMenuState = (key) => {
    setMenuState({
      ...menuState,
      [key]: menuState[key] ? !menuState[key] : true,
    });
  };

  return (
    <GlobalContainer>
      <GlobalStyle responsive={responsive} collapsed={collapsed} />
      <Container>
        <HeaderContainer>
          <Header
            responsive={responsive}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onClickMenuButton={onClickMenuButton}
            link={link}
            setLink={setLink}
            onClickLink={onClickLink}
            extend={extend}
            setExtend={setExtend}
            setMenuState={setMenuState}
            mappings={pageProps.mappings}
          />
        </HeaderContainer>
        <ContentContainer>
          <SideBar
            responsive={responsive}
            collapsed={collapsed}
            link={link}
            onClickLink={onClickSidebarMenu}
            menuState={menuState}
            changeMenuState={changeMenuState}
            mappings={pageProps.mappings}
          />
          <Component
            pageProps={pageProps}
            setLink={setLink}
            changeMenuState={changeMenuState}
            collapsed={collapsed}
          />
        </ContentContainer>
      </Container>
    </GlobalContainer>
  );
}

export default MainApp;
