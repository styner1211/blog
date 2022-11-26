import path from "path";
import fs from "fs";

function getFileList() {
  const filePath = path.resolve("pages");
  console.log(filePath); //////
  const filenames = fs.readdirSync(filePath);
  console.log(filenames);
  return filenames;
}

export default getFileList;
