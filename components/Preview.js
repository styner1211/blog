import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import PreviewItem from "./PreviewItem";
import PreviewLink from "./PreviewLink";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  max-width: 800px;

  padding: 20px;
`;

const PreviewItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  /* justify-content: center; */
  /* align-items: center; */
  width: 100%;
  height: 100%;
`;

function Home({ setLink, changeMenuState, mappings }) {
  const router = useRouter();

  const onClickPreview = (path, index) => {
    setLink(path);
    changeMenuState(index);
    router.push("/" + path);
  };

  // console.log(mappings); //////////

  return (
    <Container>
      <PreviewItemContainer>
        {/* <ImageContainer data={barcode}></ImageContainer> */}
        {/* {list.map((e) => (
          <Preview>{e}</Preview>
        ))} */}

        {/* {mappings &&
          mappings.map(
            (e, index) =>
              e.header.preview && (
                <PreviewLink key={index} href={e.header.path}>
                  <PreviewItem
                    title={e.header.label}
                    snippet={e.header.snippet}
                    img={e.header.img}
                    link={link}
                    onClickPreview={() => onClickPreview(e.header.path, index)}
                    // selected={link.startsWith(e.header.path)}
                  />
                </PreviewLink>
              ),
          )} */}

        {/* {mappings &&
          mappings.map(
            (item, index1) =>
              item.side_bar &&
              item.side_bar.map(
                (sideBarItem, index2) =>
                  sideBarItem.preview && (
                    <PreviewLink
                      key={index1 + "-" + index2}
                      href={item.header.path + "/" + sideBarItem.path}
                    >
                      <PreviewItem
                        title={sideBarItem.label}
                        snippet={sideBarItem.snippet}
                        img={sideBarItem.img}
                        link={link}
                        onClickPreview={() =>
                          onClickPreview(
                            item.header.path + "/" + sideBarItem.path,
                            index1 + "-" + index2,
                          )
                        }
                      />
                    </PreviewLink>
                  ),
              ),
          )} */}
        {mappings &&
          mappings.map(
            (item, index1) =>
              item.side_bar &&
              item.side_bar.map(
                (sideBarItem, index2) =>
                  sideBarItem.sub &&
                  sideBarItem.sub.length > 0 &&
                  sideBarItem.sub.map(
                    (subItem, index3) =>
                      subItem.preview && (
                        <PreviewItem
                          key={index1 + "-" + index2 + "-" + index3}
                          title={subItem.label}
                          snippet={subItem.snippet}
                          img={subItem.img}
                          onClickPreview={() =>
                            onClickPreview(
                              item.header.path +
                                "/" +
                                sideBarItem.path +
                                "/" +
                                subItem.path,
                              index1 + "-" + index2,
                            )
                          }
                        />
                      ),
                  ),
              ),
          )}
      </PreviewItemContainer>
    </Container>
  );
}

export default Home;
