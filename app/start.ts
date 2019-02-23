import * as path from 'path'
import { spawn } from 'child_process'
import * as express from 'express'
import { Server } from 'http'
import socketServer from './server'

/* eslint-disable global-require */
const dev = process.env.NODE_ENV === 'development'
if (dev) {
  const port : string | number = process.env.PORT || 3000
  const exp = express()
  const http = new Server(exp)
  socketServer(http)
  const webpackMidlleware = require('./server/middlewares/webpack').default
  exp.use(webpackMidlleware)
  exp.get(/.*/, (req, res) => res.sendFile(path.resolve('app/index.html')))
  http.listen(port, () => {
    const address = http.address()
    if(typeof address !== 'string'){
      console.log(' -> that probably means: http://localhost:%d', address.port)
    }
  })
  spawn('npm', ['run', 'main-dev'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
    .on('close', code => process.exit(code))
    .on('error', spawnError => console.error(spawnError))
}
