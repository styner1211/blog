import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import defaultStyle from "../style";
import StyledLink from "./common/StyledLink";
// import mappings from '../../pages/mappings.json';
import { AiOutlineMenu, AiOutlineEllipsis } from "react-icons/ai";
import { getTextWidth } from "../utils/LayoutUtil";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const debug = process.env.NODE_ENV !== "production";
const name = "blog";

const Container = styled.div`
  position: relative; //////////////////////////////
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100px;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: calc(100% - 220px);
  overflow: none;
  ${(props) =>
    props.responsive === "mobile" &&
    css`
      width: calc(100% - 60px);
      overflow-x: scroll;
    `}
`;
const SubMiddle = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 60px;
  right: 38px;
  width: fit-content;
  padding: 10px;

  border: 1px solid ${defaultStyle.color0};
  border-radius: 8px;
`;

const Right = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  width: 60px;
  height: 100%;

  background-color: white;
`;

const MenuButtonItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 40px;
  height: 40px;

  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${defaultStyle.color0};
    }
  }

  border: 1px solid ${defaultStyle.color0};
  border-radius: 50%;

  ${(props) =>
    !props.collapsed &&
    css`
      color: white;
      background-color: black;
    `}

  -webkit-tap-highlight-color: transparent;
  font-size: 1.2rem;
`;

const LogoItem = styled.div`
  margin-left: 10px;
  width: 40px;
  height: 40px;

  cursor: pointer;
  text-align: center;

  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 40px;
`;

const Logo = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.data});
  background-size: contain;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
`;

const HeaderItem = styled.div`
  display: flex;
  justify-content: center; ////////////////////////////////////////////
  align-items: center;
  margin: 4px;
  height: 30px; ///////////////

  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${defaultStyle.color0};
    }
  }

  border-radius: 12px;

  user-select: none;

  ${(props) =>
    props.selected &&
    css`
      background-color: black;
    `}
`;

const ExtendButton = styled.div`
  display: flex;
  justify-content: center; ////////////////////////////////////////////
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;

  &:hover {
    background: ${defaultStyle.color0};
  }

  border: 1px solid ${defaultStyle.color0};
  border-radius: 50%;

  ${(props) =>
    props.extend &&
    css`
      color: white;
      background-color: black;
    `}

  -webkit-tap-highlight-color: transparent;

  font-size: 1.2rem;
`;

function Header({
  responsive,
  collapsed,
  setCollapsed,
  onClickLink,
  onClickMenuButton,
  link,
  setLink,
  extend,
  setExtend,
  setMenuState,
  mappings,
}) {
  const ref = useRef(null);
  const router = useRouter();

  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

  let selectedHeader = link;
  selectedHeader = selectedHeader.includes("/")
    ? selectedHeader.substring(0, selectedHeader.indexOf("/"))
    : selectedHeader;
  if (selectedHeader === "") {
    selectedHeader = "/";
  }

  const [lastIndex, setLastIndex] = useState(0);

  const onExtend = () => {
    setExtend(!extend);
  };

  const onClickLogo = () => {
    setLink("/");
    setCollapsed(false);
    setMenuState({});
    router.push("/");
  };

  return (
    <Container ref={ref}>
      <Left collapsed={collapsed}>
        <MenuButtonItem collapsed={collapsed} onClick={onClickMenuButton}>
          <AiOutlineMenu />
        </MenuButtonItem>
        <LogoItem onClick={onClickLogo}>
          <Image src={"/qrcode.png"} width="40" height="40" alt="logo" />
        </LogoItem>
      </Left>

      {responsive === "mobile" && (
        <Middle responsive={responsive} collapsed={collapsed}>
          {mappings &&
            mappings.map((e, index) => (
              <HeaderItem
                key={index}
                onClick={() => onClickLink(e.header.path)}
                selected={e.header.path === selectedHeader}
              >
                <StyledLink
                  selected={e.header.path === selectedHeader}
                  href={"/" + e.header.path}
                  as={process.env.BACKEND_URL + "/" + e.header.path}
                >
                  {e.header.label}
                </StyledLink>
              </HeaderItem>
            ))}
        </Middle>
      )}

      {responsive !== "mobile" && (
        <Middle responsive={responsive} ref={ref} collapsed={collapsed}>
          {mappings &&
            mappings.map((e, index) => {
              if (lastIndex === 0 || index <= lastIndex) {
                return (
                  <HeaderItem
                    key={index}
                    onClick={() => onClickLink(e.header.path)}
                    selected={e.header.path === selectedHeader}
                  >
                    <StyledLink
                      selected={e.header.path === selectedHeader}
                      href={"/" + e.header.path}
                      as={process.env.BACKEND_URL + "/" + e.header.path}
                    >
                      {e.header.label}
                    </StyledLink>
                  </HeaderItem>
                );
              }
            })}
        </Middle>
      )}

      {responsive !== "mobile" && extend && (
        <SubMiddle>
          {mappings &&
            mappings.map((e, index) => {
              if (lastIndex > 0 && index > lastIndex) {
                return (
                  <HeaderItem
                    key={index}
                    onClick={() => onClickLink(e.header.path)}
                    selected={e.header.path === selectedHeader}
                  >
                    <StyledLink
                      selected={e.header.path === selectedHeader}
                      href={"/" + e.header.path}
                      as={process.env.BACKEND_URL + "/" + e.header.path}
                    >
                      {e.header.label}
                    </StyledLink>
                  </HeaderItem>
                );
              }
            })}
        </SubMiddle>
      )}

      {responsive !== "mobile" && (
        <Right>
          {lastIndex > 0 && (
            <ExtendButton extend={extend} onClick={onExtend}>
              <AiOutlineEllipsis />
            </ExtendButton>
          )}
        </Right>
      )}
    </Container>
  );
}

export default Header;
