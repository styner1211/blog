import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import "../markdown-styles.css";
// import MetaTag from "../../utils/MetaTag";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";

import "katex/dist/katex.min.css";
import CodeBlock from "../utils/CodeBlock";
import NotFound from "./NotFound";

import fs from "fs";

const MarkDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  width: 100%;
  max-width: 800px;
  /* width: 800px; */
  /* white-space: nowrap; */
`;

// function MarkDownComponent({ file, meta, setLink }) {
//   console.log(file); ////////////////////////
//   const [markdown, setMarkdown] = useState(null);
//   useEffect(() => {
//     return () => {
//       setMarkdown(null); ///
//     };
//   }, []);
//   if (file) {
//     try {
//       const f = require("../pages/" + file);
//       fetch(f)
//         .then((res) => res.text())
//         .then((text) => setMarkdown(text));

//       // const post = fs.readFileSync(file).toString();
//       // setMarkdown(post);

//       return (
//         <MarkDownContainer>
//           {/* <MetaTag meta={meta} /> */}
//           <ReactMarkdown
//             className={"markdown"}
//             remarkPlugins={[remarkGfm, remarkMath]}
//             // escapeHtml={false}
//             rehypePlugins={[rehypeRaw, rehypeKatex]}
//             //components={{
//             // a: (props) => (
//             //   <RouterLink href={props.href} setLink={setLink}>
//             //     {props.children}
//             //  </RouterLink>
//             // ),
//             //}}
//             components={CodeBlock}
//           >
//             {markdown}
//           </ReactMarkdown>
//         </MarkDownContainer>
//       );
//     } catch {
//       console.log(file + " not found ...");
//       return (
//         <MarkDownContainer>
//           <NotFound />
//         </MarkDownContainer>
//       );
//     }
//   }
// }

function MarkDownComponent({ post, meta, setLink }) {
  if (post) {
    try {
      // const post = fs.readFileSync(file).toString();
      // setMarkdown(post);

      return (
        <MarkDownContainer>
          {/* <MetaTag meta={meta} /> */}
          <ReactMarkdown
            className={"markdown"}
            remarkPlugins={[remarkGfm, remarkMath]}
            // escapeHtml={false}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            transformImageUri={(uri) => `${process.env.ASSET_PREFIX}${uri}`}
            //components={{
            // a: (props) => (
            //   <RouterLink href={props.href} setLink={setLink}>
            //     {props.children}
            //  </RouterLink>
            // ),
            //}}
            components={CodeBlock}
          >
            {post}
          </ReactMarkdown>
        </MarkDownContainer>
      );
    } catch {
      console.log("post.md undefined ...");
      return (
        <MarkDownContainer>
          <NotFound />
        </MarkDownContainer>
      );
    }
  } else {
    return (
      <MarkDownContainer>
        <NotFound />
      </MarkDownContainer>
    );
  }
}

export default MarkDownComponent;
