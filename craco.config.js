const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        implementation: require('sass'),
        api: 'modern',
        sourceMap: true,
        sassOptions: {
          outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
          includePaths: [
            path.join(__dirname, 'src/sass'),
            path.join(__dirname, 'src/sass/theme'),
            path.join(__dirname, 'src/sass/components')
          ],
          fiber: false
        }
      }
    },
    css: {
      loaderOptions: {
        sourceMap: true
      }
    },
    postcss: {
      loaderOptions: {
        sourceMap: true
      }
    }
  }
};
