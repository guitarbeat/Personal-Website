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
const optimization = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor.${packageName.replace('@', '')}`;
            },
            chunks: 'all'
          },
          common: {
            test: /[\\/]src[\\/]components[\\/]/,
            name: 'common',
            chunks: 'all',
            minChunks: 2
          }
        }
      }
    };
  }
  return config;
};

module.exports = override(
  // Add babel plugins
  addBabelPlugin('@babel/plugin-proposal-private-property-in-object'),
  
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
  optimization(),

  // Add split chunks optimization
  setWebpackOptimizationSplitChunks({
    chunks: 'all',
    name: false
  })
);