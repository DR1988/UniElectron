import * as SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import socketConfig from '../config/socket.config'

let serialPort: SerialPort

console.log('socketConfig', socketConfig)
// !serialPort || !serialPort.isOpen()
export default (socket) => {
  SerialPort.list().then((ports) => {
    ports.forEach((port) => {
      console.log(port);
      if (port.manufacturer.includes('Arduino')) { // have to change it because we can use not only Arduino
        serialPort = new SerialPort(port.comName, {
          // baudRate: 9600,
          baudRate: 250000,
          parity: 'none',
          // parser: SerialPort.parsers.readline('\n'),
        })
        const parser = new Readline()
        serialPort.pipe(parser)
        serialPort.on('open', () => {
          console.log('opened')
          // setInterval(() =>
          //   socket.broadcast.emit(
          //     socketConfig.rpmChange, 100 * Math.random(),
          //   ),
          //   1000)

          // setTimeout(() => {
          //   serialPort.write('V0Y\n')
          // }, 3000)
          // setTimeout(() => {
          //   serialPort.write('V0N\n')
          // }, 6000)
        })
        serialPort.on('data', (data) => {
          socket.broadcast.emit(socketConfig.rpmChange, data.toString())
          console.log('data: ', `${data}`)
        })
      }/*  else {
      console.log('already opened!')
    } */
    })
  })
    .catch(err => console.log('Err', err))
}

