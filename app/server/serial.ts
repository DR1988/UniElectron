import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import socketConfig from '../config/socket.config'
import socket from 'socket.io'

let serialPort: SerialPort

console.log('socketConfig', socketConfig)
// !serialPort || !serialPort.isOpen()
export default (socket: socket.Socket) => {
  SerialPort.list().then((ports) => {
    ports.forEach((port) => {
      console.log(port);
      if (port.manufacturer.includes('Arduino')) { // have to change it because we can use not only Arduino
        console.log('arduion found')
        serialPort = new SerialPort(port.comName, {
          // baudRate: 9600,
          // autoOpen: false,
          baudRate: 250000,
          parity: 'none',
          // parser: SerialPort.parsers.readline('\n'),
        })
        // serialPort.open(err => {
        //   if(err) {
        //     console.log('err', err)
        //   } else {
        //     console.log('opened')
        //   }
        // })
        const parser = serialPort.pipe(new Readline({ delimiter: '\n' }))

        // serialPort.pipe(parser)
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
          // setInterval(
          //   () => serialPort.write('R8|500\n'),
          //   5000
          // )
        })
        parser.on('data', (data) => {
          socket.emit(socketConfig.rpmChange, data.toString())
          console.log('data: ', `${data}`)
        })
      }/*  else {
      console.log('already opened!')
    } */
    })
  })
    .catch(err => console.log('Err', err))
}

