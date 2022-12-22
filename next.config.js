const debug = process.env.NODE_ENV !== "production";
const name = "blog";
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  basePath: !debug ? `/${name}` : "",
  assetPrefix: !debug ? `/${name}/` : "",
  images: {
    loader: "akamai",
    path: !debug ? `/${name}/` : "",
  },
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
      child_process: false,
      net: false,
      tls: false,
    };

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "pages",
            to: path.join(process.cwd(), "pages/"),
            globOptions: {
              ignore: ["**/*.js"],
            },
          },
        ],
      }),
    );

    return config;
  },
};
