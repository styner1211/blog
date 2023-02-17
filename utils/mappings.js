import fs from "fs";
import path from "path";

export function getPaths(filePath) {
  let dirs = [];
  traverseDirectory(filePath, 0, dirs);

  // refine
  let paths = dirs.map((e) => {
    const p = e.path.replaceAll(filePath, "").replaceAll(path.sep, "/");
    let title = e.title;
    let snippet = e.snippet;

    const img = e.img;
    return { path: p, title: title, snippet: snippet, img: img };
  });

  // filter
  paths = paths.filter((e) => e.path !== "/api");

  return paths;
}

function getTitleAndSnippet(filePath) {
  const pathCol = filePath.split(path.sep);
  let title = pathCol[pathCol.length - 1];
  let snippet = "";
  if (fs.existsSync(filePath + path.sep + "post.md")) {
    const lines = fs
      .readFileSync(filePath + path.sep + "post.md", "utf-8")
      .toString()
      .split("\n");

    // let count = 0;
    // for (const line of lines) {
    //   title = line.replace("#", "").trim();
    //   count++;
    // }

    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (i == 0) {
        title = line.replace("#", "").trim();
        if (title.includes("(")) {
          title = title.substring(0, title.indexOf("(")).trim();
        }
        count++;
      } else {
        if (line !== "" && !line.startsWith("<")) {
          snippet = line.substring(line.indexOf(" ") + 1);
          count++;
        }
      }
      if (count == 2) break;
    }
  }
  return { title, snippet };
}

function getImg(filePath) {
  const pathCol = filePath.split(path.sep);
  let img = "/qrcode.png";
  if (fs.existsSync(filePath + path.sep + "post.md")) {
    const lines = fs
      .readFileSync(filePath + path.sep + "post.md", "utf-8")
      .toString()
      .split("\n");

    for (const line of lines) {
      if (line.startsWith("<img")) {
        img = line.substring(line.indexOf("src=") + 5, line.indexOf(" />") - 1);
        break;
      }
    }
  }
  return img;
}

export function traverseDirectory(filePath, depth, dirs) {
  if (depth > 0) {
    const values = getTitleAndSnippet(filePath); //////////////////////////////////////////////////////////////////
    const title = values.title;
    const snippet = values.snippet;
    const img = getImg(filePath);
    dirs.push({ path: filePath, title: title, snippet: snippet, img: img });
  }

  const list = fs.readdirSync(filePath, { withFileTypes: true });
  if (list == 0) return;
  for (let i = 0; i < list.length; i++) {
    if (list[i].isDirectory()) {
      const dir = list[i];
      const subPath = dir.name;
      traverseDirectory(filePath + path.sep + subPath, depth + 1, dirs);
    }
  }
}

export function getNodeMap(filePath) {
  const pathList = getPaths(filePath);
  const nodeMap = new Map();
  for (let o of pathList) {
    const path = o.path;
    const title = o.title;
    const snippet = o.snippet;
    const img = o.img;
    const col = path.split("/").filter((e) => e !== "");

    let i = 0;
    // i === 0: header
    // i === 1: sidebar
    // i === 2: sub
    for (let c of col) {
      let menu = {
        label: c,
        path: c,
        md: "",
        preview: true,
        sub: [],
      };
      if (i == col.length - 1) {
        menu["label"] = title;
        menu["img"] = img;
        menu["snippet"] = snippet;
      }

      let exist = false;
      if (nodeMap.has(c)) {
        menu = nodeMap.get(c);
        exist = true;
      }

      if (i === 0) {
        menu["depth"] = 0;
        nodeMap.set(c, menu);
      } else if (i === 1) {
        menu["depth"] = 1;
        const header = nodeMap.get(col[0]);
        if (!exist) {
          header["sub"].push(menu);
        }
        nodeMap.set(c, menu);
      } else {
        menu["depth"] = 2;
        const sidebar = nodeMap.get(col[1]);
        if (!exist) {
          sidebar["sub"].push(menu);
        }

        nodeMap.set(c, menu);
      }
      i++;
    }
  }
  return nodeMap;
}

export function toMappings(nodeMap) {
  const mappings = [];
  for (let key of nodeMap.keys()) {
    const node = nodeMap.get(key);
    if (node.depth === 0) {
      // header
      const item = { header: node, side_bar: node.sub.map((e) => e) };
      mappings.push(item);
    }
  }
  return mappings;
}

export function getUrls(mappings) {
  const paths = [];
  for (let e1 of mappings) {
    const header = e1.header.path;
    const path1 = [header];
    paths.push({ params: { path: path1 } });
    for (let e2 of e1.side_bar) {
      const sidebar = e2.path;
      const path2 = [header, sidebar];
      paths.push({ params: { path: path2 } });
      for (let e3 of e2.sub) {
        const sub = e3.path;
        const path3 = [header, sidebar, sub];
        paths.push({ params: { path: path3 } });
      }
    }
  }
  return paths;
}
