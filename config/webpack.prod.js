const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const extractSass = new MiniCssExtractPlugin({
  filename: '[name].css',
})

const {NODE_ENV} = process.env;

const config = {
  bail: true,
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  mode: NODE_ENV,
  optimization: {
    minimize: true,
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        babelrc: false,
        presets: ['env', 'react'],
        plugins: [
          'syntax-dynamic-import',
          'transform-object-rest-spread',
          'transform-regenerator',
        ],
      },
    }, {
      test: /\.s?css$/,
      loaders: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              autoprefixer(),
            ],
          },
        },
        'sass-loader',
      ],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    extractSass
  ],
}

module.exports = config
