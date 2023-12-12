const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(
  commonConfig,
  {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        FETCH_BASE_URL: JSON.stringify(process.env.FETCH_BASE_URL),
      }),
      new HTMLWebpackPlugin({
        template: '/src/templates/index.html',
      }),
    ],
  },
);