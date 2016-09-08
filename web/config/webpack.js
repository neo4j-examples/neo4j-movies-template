'use strict';

var webpack = require('webpack');

/**
 * Get configuration for Webpack
 *
 * @see http://webpack.github.io/docs/configuration
 *      https://github.com/petehunt/webpack-howto
 *
 * @param {boolean} release True if configuration is intended to be used in
 * a release mode, false otherwise
 * @return {object} Webpack configuration
 */
module.exports = function (release) {
  return {
    entry: ['babel-polyfill', './src/client.js'],

    output: {
      filename: 'client.js',
      path: './build/',
      publicPatch: './build/'
    },

    cache: !release,
    debug: !release,
    devtool: false,

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [],

    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },

    module: {
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        }
      ],

      loaders: [
        {
          test: /\.css$/,
          loader: 'style!css'
        },
        {
          test: /\.gif/,
          loader: 'url-loader?limit=10000&mimetype=image/gif'
        },
        {
          test: /\.jpg/,
          loader: 'url-loader?limit=10000&mimetype=image/jpg'
        },
        {
          test: /\.png/,
          loader: 'url-loader?limit=10000&mimetype=image/png'
        },
        {
          test: /\.js|\.jsx/,
          exclude: /node_modules|bower_components/,
          loader: 'babel'
        }
      ]
    }
  };
};
