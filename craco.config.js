const path = require("node:path");
const { execSync } = require("node:child_process");

// * Get git commit hash for version info
const getGitCommitHash = () => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch (error) {
    console.warn("Could not get git commit hash:", error.message);
    return "unknown";
  }
};

// * Get build date
const getBuildDate = () => {
  return new Date().toISOString();
};

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // * Inject version information as environment variables
      const commitHash = getGitCommitHash();
      const buildDate = getBuildDate();

      const webpack = require("webpack");
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          "process.env.REACT_APP_GIT_COMMIT_HASH": JSON.stringify(commitHash),
          "process.env.REACT_APP_BUILD_DATE": JSON.stringify(buildDate),
          "process.env.REACT_APP_VERSION": JSON.stringify(
            require("./package.json").version,
          ),
        }),
      );

      return webpackConfig;
    },
  },
  style: {
    sass: {
      loaderOptions: {
        implementation: require("sass"),
        api: "modern",
        sourceMap: true,
        sassOptions: {
          outputStyle:
            process.env.NODE_ENV === "production" ? "compressed" : "expanded",
          includePaths: [
            path.join(__dirname, "src/sass"),
            path.join(__dirname, "src/sass/theme"),
            path.join(__dirname, "src/sass"),
          ],
          fiber: false,
        },
      },
    },
    css: {
      loaderOptions: {
        sourceMap: true,
      },
    },
    postcss: {
      loaderOptions: {
        sourceMap: true,
      },
    },
  },
};
