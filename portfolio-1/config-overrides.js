const {
  override,
  addBabelPlugin,
  addWebpackAlias,
  addBundleVisualizer,
  setWebpackOptimizationSplitChunks,
  addWebpackPlugin,
  adjustStyleLoaders
} = require('customize-cra');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Optimization configuration for production
const addOptimization = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          parallel: true
        })
      ]
    };
  }
  return config;
};

module.exports = override(
  // Add babel plugins with consistent loose mode
  addBabelPlugin(['@babel/plugin-transform-class-properties', { loose: true }]),
  addBabelPlugin(['@babel/plugin-transform-private-methods', { loose: true }]),
  addBabelPlugin(['@babel/plugin-transform-private-property-in-object', { loose: true }]),
  
  // Add webpack aliases for cleaner imports
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@common': path.resolve(__dirname, 'src/common'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@utils': path.resolve(__dirname, 'src/utils')
  }),

  // Add SASS/SCSS support with sourceMap in development
  adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
    if (processor && processor.loader.includes('sass-loader')) {
      processor.options.sourceMap = process.env.NODE_ENV === 'development';
    }
  }),

  // Add compression plugin for production
  process.env.NODE_ENV === 'production' &&
    addWebpackPlugin(
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
        algorithm: 'gzip'
      })
    ),

  // Add bundle analyzer (accessible via npm run build --stats)
  process.env.BUNDLE_VISUALIZE === 1 && addBundleVisualizer(),

  // Add optimization configuration
  addOptimization(),

  // Add split chunks optimization
  setWebpackOptimizationSplitChunks({
    chunks: 'all',
    name: false
  })
);