import socket from 'socket.io'
import { Server } from 'http'
import connection from './socketHandlers/connection'

let isSerialConnetcted: boolean = false

export default (http: Server, serial) => {
  const io = socket(http, { serveClient: false })
  io.on('connection', (s) => {
    connection(s, io)
    // TODO: check for every connection serial creation
  })
}
