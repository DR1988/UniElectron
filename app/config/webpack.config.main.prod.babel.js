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
  // serialport v13 и @serialport/* — ESM с class-fields, webpack 4 их не парсит;
  // это runtime-модули main-процесса, бандлить не нужно (лежат в node_modules сборки)
  externals: [
    {
      uws: 'uws',
      serialport: "require('serialport')",
      "node-hid": "require('node-hid')",
    },
    ({ request }) => {
      if (/^@serialport\//.test(request)) {
        return `commonjs ${request}`
      }
    },
  ],
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
