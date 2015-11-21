var webpack = require('webpack');

var webpackConfig = {
  entry: './src/index.js',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'react-metronome',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer?{browsers:["> 2%"]}'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?{browsers:["> 2%"]}!sass'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: [
    'react',
    'react-dom',
    'soundfont-player'
  ],
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = webpackConfig;