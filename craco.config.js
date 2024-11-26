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
                ...loader.options,
                implementation: require('sass'),
                sassOptions: {
                  fiber: false,
                },
              },
            };
          }
          return loader;
        });
      }

      return webpackConfig;
    },
  },
};
