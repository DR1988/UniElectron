import socket from 'socket.io'
import { Server } from 'http'
import connection from './socketHandlers/connection'

let isSerialConnetcted: boolean = false

export const socketServer = (http: Server, serial) => {
  const io = socket(http, { serveClient: false })
  io.on('connection', (s) => {
    connection(s, io)
    // TODO: check for every connection serial creation
  })
}
