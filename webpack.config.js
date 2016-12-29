var webpack = require('webpack');

module.exports = {
  context: __dirname + '/',
  entry: {
    app: ['whatwg-fetch','./entry.js'],
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/public/js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {presets: ['react', 'es2015']},
      }
    ],
  },

  // To run in production, switch devtools to cheap-module-source-map, and uncomment plugins
  // To run on dev, switch devtools to source-map, and comment out plugins

  devtool: 'source-map',
  // devtool: 'cheap-module-source-map',

  // plugins:[
  //   new webpack.DefinePlugin({
  //     'process.env':{
  //       'NODE_ENV': JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress:{
  //       warnings: true
  //     }
  //   })
  // ],

}
