const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './project/src/index.ts',
  mode: 'development', // or 'production'
  devtool: 'source-map',  // Add this line
  //devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
   // devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        //{ from: './project/public/index.html', to: '' },
        { from: './project/public/style.css', to: '' },
        { from: './project/static/favicon.ico', to: '' },
      ],
    }),
    new ZipPlugin({
      path: path.resolve(__dirname, 'dist'),
      filename: 'dist.zip'
    }),
    new HtmlWebpackPlugin({
      template: './project/public/index.html',
      publicPath: "./",
      minify: false,
    }),
  ],
  /*
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  */
};
