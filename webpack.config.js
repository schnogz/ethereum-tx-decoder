const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const manifestCacheBust = new Date().getTime()
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
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/',
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
  },
  optimization: {
    namedModules: true,
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: 4,
        uglifyOptions: {
          warnings: false,
          compress: {
            warnings: false,
            keep_fnames: true,
            unused: false
          },
          mangle: {
            keep_fnames: true
          },
          nameCache: null,
          toplevel: false,
          ie8: false
        }
      })
    ],
    concatenateModules: isProd,
    runtimeChunk: {
      name: `manifest.${manifestCacheBust}`
    },
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'app',
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          priority: -10
        }
      }
    }
  }
}

// export config
if (isProd) {
  webpackConfig = merge(commonWebpackProps, {
    mode: 'production'
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
