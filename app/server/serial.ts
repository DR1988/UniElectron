import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import socketConfig from '../config/socket.config'
import socket from 'socket.io'
let serialPort: SerialPort

let loadScriptPromise = function(src, fn) {
  return new Promise((resolve, reject) => {
    fn('data', (script) => {
      resolve(script);
    });
  })
}
// console.log('socketConfig', socketConfig)
// !serialPort || !serialPort.isOpen()
export default class Serial {
  serialPort: SerialPort
  parser: any
  private connected: boolean
  private rpmValue: number = 0
  private serialList:  SerialPort.PortInfo[];

  constructor(private io: socket.Server) {
    this.io = io
    this.connected = false
  }

  private async connectToPort(path: string) {
    let receivedData = '';
    let counter = 0;
    let interval;
    // const interval = setInterval(() => {
    //   if (counter > 3) {
    //
    //     if(this.serialPort.isOpen) {
    //       this.serialPort.close();
    //     }
    //
    //     clearInterval(interval);
    //   }
    //   counter++;
    // }, 1000);

    this.serialPort = new SerialPort(path, {
      baudRate: 500000,
      parity: 'none',
      autoOpen: false
    })

    this.serialPort.open((err) => {
      console.log('ERROR:', err)
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
      if (data === 'CONNECTED') {
        receivedData = data;
        clearInterval(interval);
        console.log('arduion found')
      }
    })

    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        if (counter > 3 && receivedData === '') {

          if(this.serialPort.isOpen) {
            this.serialPort.close();
          }

          console.log('REJECTED')
          reject(false);
          clearInterval(interval);
        } else if (receivedData === 'CONNECTED') {
          console.log('RESOLVED')
          resolve(true);
        }
        counter++;
      }, 1000);
      // if (counter > 3 && receivedData === '') {
      //   console.log('REJECTED')
      //   reject(false);
      // } else if (receivedData === 'CONNECTED') {
      //   console.log('RESOLVED')
      //   resolve(true);
      // }
    })
  }

  async findSerialPort() {
    if (!this.connected) {
      const portss = await SerialPort.list();
      const ports = [portss[portss.length - 1], portss[0]]
      console.log('ports', ports)
      for await (let port of ports) {
        console.log('---------------')
        console.log('port.path', port.path)
        console.log('---------------')
        try {
          const isConnected = await this.connectToPort(port.path);
          if (isConnected) {
            break;
          }
        } catch (e) {
          console.log('EEEEE', e)
        }
      }

      // ports.forEach(port => {
      //   this.connectToPort(port.path);
      // })

      // SerialPort.list().then((ports) => {
      //   console.log('ports', ports)
      //   this.serialList = ports;
      //   ports.forEach((port) => {
      //     if (port.manufacturer.includes('Arduino') || port.manufacturer.includes('Microsoft') || port.path === 'COM3') { // have to change it because we can use not only Arduino
      //       console.log('arduion found')
      //       this.serialPort = new SerialPort(port.path, {
      //         baudRate: 500000,
      //         parity: 'none',
      //         autoOpen: false
      //       })
      //
      //       this.serialPort.open((err) => {
      //         console.log('err', err)
      //       })
      //       const parser = this.serialPort.pipe(new Readline({ delimiter: '\n' }))
      //
      //       this.serialPort.on('open', () => {
      //         this.connected = true
      //         this.io.emit(socketConfig.connected, true)
      //         console.log('opened')
      //       })
      //
      //       this.serialPort.on('close', () => {
      //         console.log('closed')
      //         this.connected = false
      //         this.io.emit(socketConfig.connected, false)
      //       })
      //       parser.on('data', (data: string) => {
      //         console.log(data, parseInt(data).toString(2))
      //         this.setRpmValue(data.toString())
      //       })
      //     }
      //   })
      // })
      //   .catch(err => {
      //     this.io.emit(socketConfig.connectionError, err)
      //     console.log('Err', err)
      //   })
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
