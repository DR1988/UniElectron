import socketConfig, { startSignal } from '../../config/socket.config'
import Controller from './controller'

let currentState = null

let controller: Controller = null

export default (socket, io) => {
  console.log('socket id', socket.id, '--------')
  if (!currentState) {
    controller = new Controller(socket, io)
  }
  if (currentState) {
    io.to(socket.id).emit(socketConfig.makeChange, currentState)
  }
  socket.on(socketConfig.makeChange, (msg) => {
    currentState = msg
    socket.broadcast.emit(socketConfig.makeChange, msg)
  })
  socket.on(socketConfig.start, (data: startSignal) => controller.initStart(data))
  // socket.on(socketConfig.start, (data: startSignal) => controller.start(data))
  socket.on(socketConfig.pause, () => controller.pause())
  socket.on(socketConfig.stop, () => controller.stop())
  socket.on(socketConfig.connect, () => controller.connect())
  socket.on(socketConfig.switchHV, (data: string) => controller.switchHV(data))
}
