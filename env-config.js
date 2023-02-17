// const debug = process.env.NODE_ENV !== "production";
const debug = true;
const name = "blog";

module.exports = {
  "process.env.BACKEND_URL": !debug ? `/${name}` : "",
  "process.env.BASE_PATH": !debug ? `${name}` : "",
  "process.env.ASSET_PREFIX": !debug ? `/${name}` : "",
};
