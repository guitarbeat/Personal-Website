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

      // * Fix for "Cannot set properties of undefined (setting 'Activity')" error
      // * This error occurs when webpack generates vendor bundle code that tries to
      // * set properties on an undefined module export object (typically 'd' in minified code)
      // * Solution: Configure webpack optimization to prevent module export issues
      if (webpackConfig.optimization) {
        // * Ensure splitChunks configuration exists
        if (!webpackConfig.optimization.splitChunks) {
          webpackConfig.optimization.splitChunks = {
            chunks: "all",
          };
        }

        // * Configure cacheGroups to ensure proper module initialization
        if (!webpackConfig.optimization.splitChunks.cacheGroups) {
          webpackConfig.optimization.splitChunks.cacheGroups = {};
        }

        // * Ensure React vendor chunks are properly isolated
        // * This prevents export initialization issues in React bundles
        webpackConfig.optimization.splitChunks.cacheGroups.react = {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "react-vendor",
          chunks: "all",
          enforce: true,
          priority: 20,
        };

        // * General vendor chunk configuration
        if (!webpackConfig.optimization.splitChunks.cacheGroups.vendor) {
          webpackConfig.optimization.splitChunks.cacheGroups.vendor = {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          };
        }
      }

      // * Add a custom plugin to ensure module exports are initialized
      // * This fixes the specific issue where webpack generates code like:
      // * return d.Activity = p, d.Children = M, ...
      // * where 'd' might be undefined
      webpackConfig.plugins.push({
        apply: (compiler) => {
          compiler.hooks.compilation.tap(
            "FixUndefinedModuleExports",
            (compilation) => {
              // * Use the optimizeChunkAssets hook (deprecated but more compatible)
              // * or processAssets for newer webpack versions
              const hook =
                compilation.hooks.processAssets ||
                compilation.hooks.optimizeChunkAssets;

              if (hook) {
                const stage =
                  compiler.webpack?.Compilation?.PROCESS_ASSETS_STAGE_OPTIMIZE ||
                  undefined;

                const tapOptions = stage
                  ? { name: "FixUndefinedModuleExports", stage }
                  : "FixUndefinedModuleExports";

                hook.tap(tapOptions, (assetsOrChunks) => {
                  // * Handle both processAssets (assets object) and optimizeChunkAssets (chunks array)
                  const assets =
                    assetsOrChunks instanceof Array
                      ? (() => {
                          const assetMap = {};
                          assetsOrChunks.forEach((chunk) => {
                            chunk.files.forEach((file) => {
                              if (file.endsWith(".js")) {
                                assetMap[file] = compilation.assets[file];
                              }
                            });
                          });
                          return assetMap;
                        })()
                      : assetsOrChunks;

                  Object.keys(assets).forEach((filename) => {
                    // * Only process JavaScript files, especially vendor bundles
                    if (
                      filename.endsWith(".js") &&
                      (filename.includes("vendor") ||
                        filename.includes("chunk") ||
                        filename.includes("react"))
                    ) {
                      const asset = assets[filename];
                      if (!asset) return;

                      const source = asset.source();
                      if (typeof source !== "string") return;

                      // * Fix the specific pattern: return d.Activity = p, d.Children = M, ...
                      // * Pattern matches: return [singleLetter].Property = value,
                      // * where the single letter variable might be undefined
                      const fixedSource = source.replace(
                        /return\s+([a-z])\.([A-Z]\w+)\s*=\s*([^,;]+),/g,
                        (match, objName, propName, value) => {
                          // * Initialize the object if undefined before assignment
                          return `return (${objName} = ${objName} || {}).${propName} = ${value},`;
                        },
                      );

                      // * Update the asset if we made changes
                      if (fixedSource !== source) {
                        if (compilation.updateAsset) {
                          compilation.updateAsset(filename, {
                            source: () => fixedSource,
                            size: () => fixedSource.length,
                          });
                        } else {
                          // * Fallback for older webpack versions
                          compilation.assets[filename] = {
                            source: () => fixedSource,
                            size: () => fixedSource.length,
                          };
                        }
                      }
                    }
                  });
                });
              }
            },
          );
        },
      });

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
