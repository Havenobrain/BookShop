const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, 
    assetModuleFilename: 'assets/[name][ext]' 
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, 
        type: 'asset/resource', 
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', 
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
  devServer: {
    static: './dist',
    open: true, 
    port: 8080, 
    hot: false, 
    liveReload: false, 
  },
  mode: 'development', 
};
