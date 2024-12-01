const { override, adjustStyleLoaders } = require('customize-cra');

module.exports = override(
  adjustStyleLoaders(({ use }) => {
    const sassLoader = use.find(loader => loader.loader && loader.loader.includes('sass-loader'));
    if (sassLoader) {
      Object.assign(sassLoader.options, {
        implementation: require('sass'),
        sassOptions: {
          style: 'compressed'
        }
      });
    }
  })
);
