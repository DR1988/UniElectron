import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import socketConfig from '../config/socket.config'
import socket from 'socket.io'

let serialPort: SerialPort

// console.log('socketConfig', socketConfig)
// !serialPort || !serialPort.isOpen()

export default class Serial {
  serialPort: SerialPort
  parser: any
  private connected: boolean
  private rpmValue: number = 0
  constructor(private io: socket.Server) {
    this.io = io
    this.connected = false
  }

  findSerialPort() {
    if (!this.connected) {
      SerialPort.list().then((ports) => {
        ports.forEach((port) => {
          if (port.manufacturer.includes('Arduino') || port.comName === 'COM3') { // have to change it because we can use not only Arduino
            console.log('arduion found')
            this.serialPort = new SerialPort(port.comName, {
              baudRate: 500000,
              parity: 'none',
              autoOpen: false
            })

            this.serialPort.open((err) => {
              console.log('err', err)
            })
            const parser = this.serialPort.pipe(new Readline({ delimiter: '\n' }))

            this.serialPort.on('open', () => {
              this.connected = true
              this.io.emit(socketConfig.connected, true)
              console.log('opened')
            })

            this.serialPort.on('close', () => {
              console.log('closed')
              this.connected = false
              this.io.emit(socketConfig.connected, false)
            })
            parser.on('data', (data: string) => {
              console.log(data, parseInt(data).toString(2))
              this.setRpmValue(data.toString())
            })
          }
        })
      })
        .catch(err => {
          this.io.emit(socketConfig.connectionError, err)
          console.log('Err', err)
        })
    } else {
      this.io.emit(socketConfig.connected, true)
    }
  }

  disconnect() {
    this.serialPort.close()
    this.io.emit(socketConfig.serialClosed)
  }

  sendData(data: string | number[] | Buffer) {
    this.serialPort.write(data)
  }

  private setRpmValue = (rpmValue: string) => {
    this.rpmValue = parseInt(rpmValue)
  }

  getRPMValue = () => this.rpmValue

}
