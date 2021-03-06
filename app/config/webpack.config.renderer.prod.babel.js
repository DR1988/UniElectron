import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'

export default {
  mode: 'production',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  target: 'electron-renderer',

  entry: path.join(__dirname, '..', 'src/index.tsx'),

  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: 'renderer.prod.js',
    publicPath: './build/',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /common\.(s?css|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /^((?!common).)*\.(s?css|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[hash:base64:6]',
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      hmr: false,
      filename: 'styles.css',
    }),
  ],
}
