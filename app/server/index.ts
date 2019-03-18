// import * as express from 'express'
import socket from 'socket.io'
import { Server } from 'http'
import connection from './socketHandlers/connection'
// import serial from './serial'
// import * as SerialPort from 'serialport'
// SerialPort.list()

// const socket = require('socket.io')

let isSerialConnetcted: boolean = false

export default (http: Server, serial) => {
  const io = socket(http, { serveClient: false })
  io.on('connection', (s) => {
    connection(s, io)
    // TODO: check for every connection serial creation

    // if(!isSerialConnetcted) {
    //   serial(s)
    //   isSerialConnetcted = true
    // }

    // s.on('INC', (data) => {
    //   console.log('data', data)
    //   s.broadcast.emit('INC', data)
    // })
  })
}
