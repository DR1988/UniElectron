// import * as express from 'express'
import * as socket from 'socket.io'
import { Server } from 'http'
import connection from './socketHandlers/connection'
import serial from './serial'

export default (http: Server) => {
  const io = socket(http, { serveClient: false })
  io.on('connection', (s) => {
    connection(s, io)
    // TODO: check for every connection serial creation
    // serial(s)

    // s.on('INC', (data) => {
    //   console.log('data', data)
    //   s.broadcast.emit('INC', data)
    // })
  })
}
