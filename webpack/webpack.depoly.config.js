var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  context: path.join(__dirname, '..', '/'),
  entry: {
    gugu: './lib/index',
    remote: './pages/remote/index',
  },
  output: {
    path: path.join(__dirname, '..', '/dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')), // judge if dev environment.
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')) // judge if secret environment.
    }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 20000 }),
    new webpack.optimize.OccurenceOrderPlugin(false),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: true
    }),
    // new CommonsChunkPlugin('vendors', 'vendors.[hash].js', Infinity),
    new ExtractTextPlugin("[name].[hash].css"),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: './pages/remote/template.html',
      filename: 'index.html',
      chunks: ['remote', 'vendors'],
      inject: 'body',
      hash: true
    }),
    new HtmlWebpackPlugin({
      template: './pages/test/template.deploy.html',
      filename: 'test.html',
      chunks: [],
      inject: 'body',
      hash: true,
    }),
    new CopyWebpackPlugin([
      { from: './pages/snippet', to: 'snippet' },
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.scss$/,
        loader: 'to-string-loader!css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url?limit=10000!img?progressive=true'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url?limit=10000'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.reactx$/,
        loader: 'reactx-loader'
      },
    ]
  },
  resolve: {
    // 設定後只需要寫 require('file') 而不用寫成 require('file.jsx')
    extensions: ['', '.js', '.json', '.jsx', '.reactx', 'react']
  },
  externals: {
    jquery: "$",
    wilddog: "wilddog",
  },
  reactx: {
    // loaders for each langs
    loaders: {
      js: 'babel',
      coffee: 'babel!coffee',
      sass: 'style-loader!css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass'
    },
    // whether use source map
    sourceMap: true
  }
};

module.exports = config;