const path = require('path');

module.exports = {
  entry: './src/client/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'production',
  optimization: {
    minimize: true
  }
};
