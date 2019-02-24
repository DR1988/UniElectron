import path from 'path'
import webpack from 'webpack'

export const dist = path.join(__dirname, 'dist')

export default {
  mode: 'development',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.join(__dirname, '..', 'src/index.tsx'),
  ].filter(Boolean),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.dev.js',
    publicPath: `http://localhost:${process.env.PORT}/dist/`,
  },

  devtool: 'inline-source-map',

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
      {
        test: /common\.(s?css|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /^((?!common).)*\.(s?css|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),

    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
}
