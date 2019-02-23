// import * as express from 'express'
import * as socket from 'socket.io'
import { Server } from 'http'

export default (http: Server) => {
  const io = socket(http, { serveClient: false })
  io.on('connection', (s) => {
    s.on('INC', (data) => {
      console.log('data', data)
      s.broadcast.emit('INC', data)
    })
  })
}
