import React from "react";
import { AiOutlineDown } from "react-icons/ai";
import styled, { css } from "styled-components";
import defaultStyle from "../style";
import StyledLink from "./common/StyledLink";

const Container = styled.div`
  position: fixed;
  z-index: 1000;
  top: 50px;
  left: 0;
  /* ${(props) =>
    props.responsive === "mobile" &&
    css`
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
    `} */

  display: flex;
  flex-direction: column;
  /* align-items: center; */
  padding-left: 10px;
  padding-right: 10px;
  /* padding-top: 10px; */
  /* padding-bottom: 10px; */
  /* padding: 4px; */

  height: calc(100% - 50px);
  width: 0px;

  ${(props) =>
    !props.collapsed &&
    props.responsive === "mobile" &&
    css`
      width: 100%; ///////////////////////////////////////
      border-right: 1px solid ${defaultStyle.color0};
      background-color: white;
    `}
  ${(props) =>
    !props.collapsed &&
    props.responsive !== "mobile" &&
    css`
      width: 400px; ///////////////////////////////////////
      border-right: 1px solid ${defaultStyle.color0};
      background-color: white;
    `}
  ${(props) =>
    props.collapsed &&
    css`
      width: 0;
      border-right: 0px solid ${defaultStyle.color0};
    `}
  transition: all 0.3s ease-out;

  overflow-x: hidden;
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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SidebarItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  font-size: 1rem;
`;

const SideBarItem = styled.div`
  display: flex;
  align-items: center;
  height: 30px; ///////////////
  width: 100%;

  margin-top: 8px;

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

  &:focus {
    text-decoration: none;
    /* color: ${defaultStyle.color4}; */
    color: white;
  }
`;

const SideBarSubItem = styled.div`
  display: flex;
  align-items: center;
  /* margin: 4px; */
  margin-top: 4px;
  height: 30px; ///////////////
  width: 100%;

  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${defaultStyle.color0};
    }
  }

  border-radius: 12px;
  padding-left: 10px;

  user-select: none;

  ${(props) =>
    props.selected &&
    css`
      background-color: black;
    `}
  font-size: 0.8rem;
`;

const ExtendButton = styled.div`
  display: flex;
  justify-content: center; ////////////////////////////////////////////
  align-items: center;
  height: 40px; ///////////////
  width: 40px;

  transform: rotateX(0deg);
  ${(props) =>
    props.extend &&
    css`
      transform: rotateX(180deg);
      /* color: ${defaultStyle.color4}; */
    `}

  transition: transform 0.250s ease-in;
  -webkit-tap-highlight-color: transparent;

  ${(props) =>
    props.selected &&
    css`
      /* background-color: black; */
      color: white;
    `}
`;

function SideBar({
  responsive,
  collapsed,
  link,
  onClickLink,
  menuState,
  changeMenuState,
  mappings,
}) {
  let selectedHeader = link;
  selectedHeader = selectedHeader.includes("/")
    ? selectedHeader.substring(0, selectedHeader.indexOf("/"))
    : selectedHeader;
  if (selectedHeader === "") {
    selectedHeader = "/";
  }

  return (
    <Container responsive={responsive} collapsed={collapsed}>
      {!collapsed &&
        mappings &&
        mappings.map(
          (item, index1) =>
            (item.header.path === selectedHeader || link === "/") && (
              <Group key={index1}>
                <Label>{item.header.label}</Label>
                <Items>
                  {item.side_bar &&
                    item.side_bar.map((sideBarItem, index2) => (
                      <SidebarItemContainer key={index1 + "-" + index2}>
                        <SideBarItem
                          selected={
                            link === item.header.path + "/" + sideBarItem.path
                          }
                          onClick={() => {
                            onClickLink(
                              item.header.path + "/" + sideBarItem.path,
                            );
                            changeMenuState(index1 + "-" + index2);
                          }}
                        >
                          <StyledLink
                            selected={
                              link === item.header.path + "/" + sideBarItem.path
                            }
                            href={
                              "/" + item.header.path + "/" + sideBarItem.path
                            }
                            as={
                              process.env.BACKEND_URL +
                              "/" +
                              item.header.path +
                              "/" +
                              sideBarItem.path
                            }
                          >
                            {sideBarItem.label}
                          </StyledLink>
                          {sideBarItem.sub && sideBarItem.sub.length > 0 && (
                            <ExtendButton
                              selected={
                                link ===
                                item.header.path + "/" + sideBarItem.path
                              }
                              extend={menuState[index1 + "-" + index2]}
                            >
                              <AiOutlineDown />
                            </ExtendButton>
                          )}
                        </SideBarItem>
                        {sideBarItem.sub &&
                          sideBarItem.sub.length > 0 &&
                          menuState[index1 + "-" + index2] &&
                          sideBarItem.sub.map((subItem, index3) => (
                            <SideBarSubItem
                              selected={
                                link ===
                                item.header.path +
                                  "/" +
                                  sideBarItem.path +
                                  "/" +
                                  subItem.path
                              }
                              onClick={() =>
                                onClickLink(
                                  item.header.path +
                                    "/" +
                                    sideBarItem.path +
                                    "/" +
                                    subItem.path,
                                )
                              }
                              key={index1 + "-" + index2 + "-" + index3}
                            >
                              <StyledLink
                                selected={
                                  link ===
                                  item.header.path +
                                    "/" +
                                    sideBarItem.path +
                                    "/" +
                                    subItem.path
                                }
                                href={
                                  "/" +
                                  item.header.path +
                                  "/" +
                                  sideBarItem.path +
                                  "/" +
                                  subItem.path
                                }
                                as={
                                  process.env.BACKEND_URL +
                                  "/" +
                                  item.header.path +
                                  "/" +
                                  sideBarItem.path
                                }
                              >
                                {subItem.label}
                              </StyledLink>
                            </SideBarSubItem>
                          ))}
                      </SidebarItemContainer>
                    ))}
                </Items>
              </Group>
            ),
        )}
    </Container>
  );
}

export default SideBar;
