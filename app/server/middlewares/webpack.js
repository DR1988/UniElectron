import express from 'express'

const router = express.Router()

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development') {
  const config = require('../../config/webpack.config.renderer.dev.babel').default
  const webpack = require('webpack')

  const compiler = webpack(config)
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
  })

  router.use(webpackDevMiddleware)
  router.use(require('webpack-hot-middleware')(compiler))
}

/* eslint-enable global-require */

export default router
