import React from "react";
import styled from "styled-components";
import { css } from "styled-components";
import StyledLink from "./common/StyledLink";
import Link from "next/link";

// const MyLink = styled(StyledLink)`
//   display: flex;
//   align-items: center;
//   margin: 10px;
//   text-decoration: none;
//   color: black;

//   -webkit-tap-highlight-color: transparent;

//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;

//   /* ${(props) =>
//     props.selected &&
//     css`
//       color: white;
//     `} */

//   user-select: none;

//   ${(props) =>
//     props.selected &&
//     css`
//       background-color: black;
//     `}
// `;

const MyLink = styled(Link)`
  display: flex;
  align-items: center;
  margin: 10px;
  text-decoration: none;
  color: black;

  -webkit-tap-highlight-color: transparent;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* ${(props) =>
    props.selected &&
    css`
      color: white;
    `} */

  user-select: none;

  ${(props) =>
    props.selected &&
    css`
      background-color: black;
    `}
`;

const AnchorTag = styled.a`
  margin: 10px;
  /* text-decoration: none;

  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 30px;
  text-decoration: none;
  color: black;

  -webkit-tap-highlight-color: transparent;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(props) =>
    props.selected &&
    css`
      color: white;
    `} */
`;

function PreviewLink({ children, selected, href, as }) {
  return (
    <Link selected={selected} href={href} as={as}>
      <AnchorTag>{children}</AnchorTag>
    </Link>
  );
}

export default PreviewLink;
