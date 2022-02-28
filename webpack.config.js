const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: './index.js',

  output: {
    filename: 'tv-react.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },


  devServer: {
    port: 9008,
    hot: true,
    compress: true
  }

};