import socketConfig, { startSignal } from '../../config/socket.config'
import Serial from '../serial'
import socket from 'socket.io'

interface Counter {
  distance: number,
  time: number,
}

export default class Controller {
  private data: startSignal
  private socket: socket.Socket
  private io: SocketIOClient.Socket
  private lines: Array<any>
  private linesOfActions: Array<any>
  private velocity: number
  private intervalId: NodeJS.Timeout
  private counter: Counter
  private currentTime: number
  private sendingCommands: string
  private Serial: Serial
  private waitValue: boolean

  constructor(socket: socket.Socket, io) {
    this.data = null
    this.socket = socket
    this.io = io

    this.lines = []
    this.linesOfActions = []
    this.velocity = 5
    this.intervalId = null
    this.counter = { distance: 0, time: 0 }

    this.currentTime = 0
    this.sendingCommands = ''
    this.Serial = new Serial(io)
    // this.init()
    this.waitValue = false
  }

  private init = (data: startSignal) => {
    this.linesOfActions = data.lineFormer
    // console.log(this.linesOfActions[8].changes)
    this.data = data
    this.lines = []
    for (let j = 0; j < this.linesOfActions.length; j++) {
      if (this.linesOfActions[j].changes.length) {
        for (let i = 0; i < this.linesOfActions[j].changes.length; i++) {
          this.linesOfActions[j].changes[i].idname = this.linesOfActions[j].name[0] + this.linesOfActions[j].id
          this.lines.push(this.linesOfActions[j].changes[i])
        }
      }
    }
  }
  // console.log('req.body', linesOfActions[8].changes)
  // console.log(linesOfActions)

  pause = () => {
    console.log('pause')
    console.log(Date.now())
    clearInterval(this.intervalId)
    this.io.emit(socketConfig.pause, { currentTime: this.currentTime })
  }

  stop = () => {
    console.log('stop')
    clearInterval(this.intervalId)
    this.currentTime = 0
    this.counter = {
      distance: 0,
      time: 1,
    }
    this.io.emit(socketConfig.stop, this.counter)
  }

  private checkingValues = (value: string) => {
    const checkingInterval = setInterval(() => {
      if(Math.abs(this.Serial.getRPMValue() - parseInt(value)) < 20){
        this.start(this.data)
        clearInterval(checkingInterval)
      }
    }, 1000)
  }

  start = (data: startSignal) => {
    this.init(data)
    this.counter.distance = 100
    this.intervalId = setInterval(() => {
      // console.log(Math.floor(1 + Math.floor(5*Math.random())))
      this.io.emit(socketConfig.rpmChange, {
        data: this.Serial.getRPMValue(),
        time: this.currentTime,
      })
      this.lines.forEach((line) => {
        // console.log('line', line.idname)
        if(
          line.startTime === this.currentTime
          && line.waitForValue
          && line.idname === 'R8'
          && Math.abs(this.Serial.getRPMValue() - parseInt(line.value)) > 20
        ){
          console.log('this.Serial.getRPMValue()', this.Serial.getRPMValue())
          console.log('line.value', line.value)
                    // if(Math.abs(this.Serial.getRPMValue() - parseInt(line.value)) > 20){
          //   console.log('pause')
          this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
          // this.waitValue = true
          this.pause()
          this.checkingValues(line.value)
          //   this.currentTime--
          // } else {
          //   console.log('much')
          // }
        } else if (line.startTime === this.currentTime) {
            // console.log(line.idname)
            if (line.idname === 'V0') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V1') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V2') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V3') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V4') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V5') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V6') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'V7') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
            }
            if (line.idname === 'R8') {
              // console.log('RPM line sendind', line.idname, line.value)
              // if (line.waitForValue) {
              //   const curDistance = currentTime
              //   io.emit('STOP', {
              //     curDistance,
              //   })
              //   intervalId2 = setTimeout(() => {
              //     console.log('gavno gopa !!!!!!!!!!!!!!!!!!!')
              //     start()
              //     counter.distance = req.body.allTime
              //     counter.time = (req.body.allTime - curDistance) / velocity
              //     io.emit('START', {
              //       ...counter,
              //     })
              //   }, 3000)
              // console.log('intervalId2', intervalId2)
              // clearInterval(intervalId)
              // }
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
            }
            if (line.idname === 'T9') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
              // console.log('temperature line sending', line.idname, line.value)
            }
          } else if (line.endTime === this.currentTime) {
            if (line.idname === 'R8') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}0|`)
              // console.log(line.idname, 0)
            }
            if (line.idname === 'T9') {
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}0|`)
              // console.log(line.idname, 0)
            }
            if (/V\d+/.test(line.idname)) {
              // console.log('asdasdadasadasd')
              this.sendingCommands = this.sendingCommands.concat(`${line.idname}N|`)
            }
          }
      })
      if (this.sendingCommands) {
        console.log('this.sendingCommands = ', this.sendingCommands)
        this.io.emit(socketConfig.serialSending, this.sendingCommands)
        // this.Serial.sendData(`${this.sendingCommands}\n`)
        this.sendingCommands = ''
      }
      if (this.currentTime >= this.data.allTime) {
        this.currentTime = 0
        clearInterval(this.intervalId)
      }
      ++this.currentTime
      // console.log(currentTime)
      // if (currentTime % 10 === 0) {
      //   // console.log('currentTime', currentTime)
      // }
    }, 1000 / this.velocity)
    // this.counter.time = data.allTime / this.velocity
    this.counter.time = (data.allTime - this.currentTime) / this.velocity
    this.io.emit(socketConfig.start, this.counter, data)
  }

  connect = () => {
    this.Serial.findSerialPort()
  }
  // start()
  // counter.distance = 100
  // counter.time = data.allTime / velocity
  // console.log('counter', counter.distance, counter.time)
}
