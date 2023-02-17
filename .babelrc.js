const env = require("./env-config");

module.exports = {
  presets: ["next/babel"],
  plugins: ["babel-plugin-styled-components", ["transform-define", env]],
};
