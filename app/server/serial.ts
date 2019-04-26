import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import socketConfig from '../config/socket.config'
import socket from 'socket.io'

let serialPort: SerialPort

console.log('socketConfig', socketConfig)
// !serialPort || !serialPort.isOpen()

export default class Serial {
  serialPort: SerialPort
  parser: any
  private connected: boolean
  private rpmValue: number = 0
  constructor(private io: socket.Server){
    this.io = io
    this.connected = false
  }

  findSerialPort(){
    if(!this.connected) {
    SerialPort.list().then((ports) => {
      ports.forEach((port) => {
        // console.log(port);
        if (port.manufacturer.includes('Arduino')) { // have to change it because we can use not only Arduino
          console.log('arduion found')
          this.serialPort = new SerialPort(port.comName, {
            // baudRate: 9600,
            //autoOpen: false,
            baudRate: 500000,
            parity: 'none',
            // parser: SerialPort.parsers.readline('\n'),
          })
          const parser = this.serialPort.pipe(new Readline({ delimiter: '\n' }))
  
          // serialPort.pipe(parser)
          this.serialPort.on('open', () => {
            this.connected = true
            this.io.emit(socketConfig.connected)
            console.log('opened')
          })

          // this.serialPort.on('disconnect', () => console.log(12312))
          this.serialPort.on('close', () => {
            console.log('closed')
            this.connected = false
          })
          parser.on('data', (data) => {
            this.setRpmValue(data.toString())
            // this.io.emit(socketConfig.rpmChange, data.toString())
            // console.log('data: ', `${data}`)
          })
        }/*  else {
        console.log('already opened!')
      } */
      })
    })
      .catch(err => {
        this.io.emit(socketConfig.connectionError, err)
        console.log('Err', err)
      })
    } else {
      this.io.emit(socketConfig.connected)
    }
  }

  disconnect(){
    this.serialPort.close()
    this.io.emit(socketConfig.serialClosed)
  }

  sendData(data: string| number[] | Buffer){
    this.serialPort.write(data)
  }

  private setRpmValue = (rpmValue: string) => {
    this.rpmValue = parseInt(rpmValue)
  }

  getRPMValue = () => this.rpmValue
}
