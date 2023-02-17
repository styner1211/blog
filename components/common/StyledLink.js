import React from "react";
// import { Link, NavLink } from 'react-router-dom';
import Link from "next/link";
import styled from "styled-components";
import { css } from "styled-components";

const MyLink = styled(Link)`
  /* display: flex;
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

const AnchorTag = styled.a`
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
    `}

  &:focus {
    outline: none;
  }
`;

function StyledLink({ children, selected, href, as }) {
  return (
    <Link href={href} passHref>
      <AnchorTag selected={selected}>{children}</AnchorTag>
    </Link>
  );
}

export default StyledLink;
