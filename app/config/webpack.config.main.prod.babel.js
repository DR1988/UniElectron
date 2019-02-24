/**
 * Webpack config for production electron main process
 */

import path from 'path'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

export default {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  entry: './app/main.preprod.ts',

  output: {
    path: path.join(__dirname, '..'),
    filename: './main.prod.js',
  },
  externals: {
    uws: 'uws',
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        cache: true,
      }),
    ],
  },

  plugins: [

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
      PORT: process.env.PORT,
    }),
  ],
}
