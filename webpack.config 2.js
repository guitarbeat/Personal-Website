const path = require('path');
const { override, addWebpackPlugin, addBabelPlugin } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = override(
  // Add Babel plugins for better performance
  addBabelPlugin('@babel/plugin-transform-runtime'),
  addBabelPlugin(['@babel/plugin-transform-modules-commonjs', { loose: true }]),
  
  // Configure webpack optimizations
  (config) => {
    // Optimize CSS
    config.optimization = {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    };

    // Add compression plugin
    addWebpackPlugin(new CompressionPlugin())(config);

    return config;
  }
);
