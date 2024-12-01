const path = require('path');
const sass = require('sass');

module.exports = {
  style: 'compressed',
  loadPaths: [path.resolve(__dirname, 'src'), 'node_modules'],
  sourceMap: true,
  sourceMapIncludeSources: true,
  functions: {},
  compiler: sass
};
