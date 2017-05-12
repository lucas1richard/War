const path = require( 'path' );

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join( __dirname, 'public', 'js' ),
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  module: {
    loaders: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [ 'es2015' ]
      }
    } ]
  }
};

