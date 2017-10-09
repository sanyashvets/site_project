const path = require('path'),
  webpack = require('webpack'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

function exclude (modules) {
  let pathSep = path.sep
  
  if (pathSep === '\\') {
    pathSep = '\\\\'
  }
  
  const moduleRegExps = modules
    .map(modName => new RegExp(`node_modules${pathSep}${modName}`))
  
  return modulePath => {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i++) {
        if (moduleRegExps[i].test(modulePath)) {
          return false
        }
      }
      
      return true
    }
    
    return false
  }
}

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:1488/__webpack_hmr&reload=true&timeout=1000&overlay=false',
    path.resolve(__dirname, './app/assets/js/index.js')
  ],
  
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: 'main.js',
    publicPath: '/js'
  },
  
  resolve: {
    unsafeCache: true,
    alias: {
      axios: 'axios/dist/axios.min'
    },
    
    modules: ['app/assets/js', 'node_modules']
  },
  
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: exclude(['v-img']),
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {url: false}
          },
          'css-validator-loader',
          {
            loader: 'sass-loader',
            options: {outputStyle: 'expanded'}
          }
        ]
      }
    ]
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"development"'},
      // 'API_PATH': '"http://192.168.1.7:3000/api/"'
      'API_PATH': '"http://localhost:1488/api/"'
    }),
    new CopyWebpackPlugin([
      {
        from: './fonts/**/*',
        to: '../'
      },
      {
        from: './img/**/*',
        to: '../'
      }
    ]),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './app/html/index.template.ejs',
      inject: false
    })
  ],
  
  performance: {
    maxEntrypointSize: 400000,
    assetFilter: assetFilename => assetFilename.endsWith('.js')
  },
  
  devtool: 'cheap-eval'
}