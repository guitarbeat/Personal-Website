module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const sassLoader = webpackConfig.module.rules
        .find(rule => rule.oneOf)
        .oneOf.find(rule => rule.test && rule.test.toString().includes('scss|sass'));

      if (sassLoader) {
        sassLoader.use = sassLoader.use.map(loader => {
          if (loader.loader && loader.loader.includes('sass-loader')) {
            return {
              ...loader,
              options: {
                implementation: require('sass'),
                sassOptions: {
                  outputStyle: 'compressed',
                  includePaths: ['node_modules'],
                  sourceMap: true,
                  sourceMapContents: true
                }
              }
            };
          }
          if (loader.loader && loader.loader.includes('postcss-loader')) {
            return {
              ...loader,
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                    process.env.NODE_ENV === 'production' && require('cssnano')
                  ].filter(Boolean)
                }
              }
            };
          }
          return loader;
        });
      }

      return webpackConfig;
    }
  }
};
