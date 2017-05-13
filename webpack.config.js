const path = require( 'path' );

module.exports = {
  entry: {
    index: './client/index.js',
    home: './client/home.js'
  },
  output: {
    path: path.join( __dirname, 'public', 'js' ),
    filename: '[name].bundle.js'
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

