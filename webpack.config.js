var webpack = require('webpack');

module.exports = {
  context: __dirname + '/',
  entry: {
    app: ['whatwg-fetch','./entry.js'],
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/public/js',
    publicPath: '/' // So Hot Module Reload uses webpack dev server URL not Express app URL
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

  // To run in production:
  // - switch devtools to cheap-module-source-map
  // - change 'output.publicPath' prop above from webpackdev server url to production app url ('/')
  // - uncomment plugins below

  // To run on dev, switch devtools to source-map, comment out plugins, set output.publicPath url to webpack dev server URL

  // devtool: 'source-map',
  devtool: 'cheap-module-source-map',

  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  ],

}
