const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(
  commonConfig,
  {
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    devServer: {
      historyApiFallback: true,
    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        FETCH_BASE_URL: JSON.stringify('http://localhost:3000/api'),
      }),
    ],
  },
);