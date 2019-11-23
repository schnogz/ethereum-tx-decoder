const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const resolveRoot = relativePath => path.resolve(__dirname, relativePath)
const PATHS = {
  src: resolveRoot('src'),
  dist: resolveRoot('dist'),
  pkgJson: resolveRoot('package.json')
}
let webpackConfig

const commonWebpackProps = {
  node: { fs: 'empty' },
  entry: {
    app: ['@babel/polyfill', PATHS.src + '/index.js']
  },
  output: {
    path: PATHS.dist,
    chunkFilename: '[name].js',
    crossOriginLoading: 'anonymous'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new Webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require(PATHS.pkgJson).version)
    }),
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'thread-loader', options: { workerParallelJobs: 50 } }, 'babel-loader']
      },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  }
}

// export config
if (isProd) {
  webpackConfig = merge(commonWebpackProps, {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    }
  })
} else {
  webpackConfig = merge(commonWebpackProps, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      contentBase: PATHS.src,
      disableHostCheck: true,
      historyApiFallback: true,
      port: 8080,
      host: 'localhost',
      hot: true,
      stats: 'minimal'
    }
  })
}

module.exports = webpackConfig
