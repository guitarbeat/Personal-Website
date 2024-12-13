const { override, adjustStyleLoaders } = require('customize-cra');

module.exports = override(
  adjustStyleLoaders(({ use }) => {
    const sassLoader = use.find(loader => loader.loader && loader.loader.includes('sass-loader'));
    if (sassLoader) {
      Object.assign(sassLoader.options, {
        implementation: require('sass'),
        sassOptions: {
          outputStyle: 'compressed',
          quietDeps: true,
          logger: {
            warn: function(message, options) {
              // Suppress legacy API warnings
              if (!message.includes('legacy')) {
                console.warn(message);
              }
            }
          }
        }
      });
    }
  })
);