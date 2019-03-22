import socketConfig, { startSignal } from '../../config/socket.config'
import serial from '../serial'
import socket from 'socket.io'

const arr = new Array(350);
const getRandomFromRange = (min, max) => {
  return Math.floor(min + (max + 1 - min) * Math.random())
}
const res = Array.from(arr).map((el, ind, array) => {
  const RPMvalue = getRandomFromRange(500, 2500)
   return {
  timeStamp: ind,
  RPMvalue,
}})
console.log(res);

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
  private isSerialConnetcted: boolean
  private serial: any
  constructor(socket: socket.Socket, io) {
    this.data = null
    this.socket = socket
    this.io = io

    this.lines = []
    this.linesOfActions = []
    this.velocity = 1
    this.intervalId = null
    this.counter = { distance: 0, time: 0 }

    this.currentTime = 0
    this.sendingCommands = ''
    this.isSerialConnetcted = false
    this.serial = serial
    // this.init()
  }

  private init = (data: startSignal) => {
    this.linesOfActions = data.lineFormer
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

  // console.log('lines', lines)
  pause = () => {
    console.log('pause')
    clearInterval(this.intervalId)
    this.io.emit(socketConfig.pause, { currentTime: this.currentTime / this.velocity })
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
    console.log('this.inter', this.inter)
    clearInterval(this.inter)
  }

  start = (data: startSignal) => {
    const resi= res[Symbol.iterator]()
    clearInterval(this.inter)
    this.inter = setInterval(() => {
      const data = resi.next()
      if(data.done){
        clearInterval(this.inter)
      }
      this.io.emit(socketConfig.rpmChange, data.value)
    }, 200)
    // this.init(data)
    // this.counter.distance = 100
    // this.intervalId = setInterval(() => {
    //   this.lines.forEach((line) => {
    //     if (line.startTime === this.currentTime) {
    //       // console.log(line.idname)
    //       if (line.idname === 'V0') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V1') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V2') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V3') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V4') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V5') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V6') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'V7') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
    //       }
    //       if (line.idname === 'R8') {
    //         // console.log('RPM line sendind', line.idname, line.value)
    //         // if (line.waitForValue) {
    //         //   const curDistance = currentTime
    //         //   io.emit('STOP', {
    //         //     curDistance,
    //         //   })
    //         //   intervalId2 = setTimeout(() => {
    //         //     console.log('gavno gopa !!!!!!!!!!!!!!!!!!!')
    //         //     start()
    //         //     counter.distance = req.body.allTime
    //         //     counter.time = (req.body.allTime - curDistance) / velocity
    //         //     io.emit('START', {
    //         //       ...counter,
    //         //     })
    //         //   }, 3000)
    //         // console.log('intervalId2', intervalId2)
    //         // clearInterval(intervalId)
    //         // }
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
    //       }
    //       if (line.idname === 'T9') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
    //         // console.log('temperature line sending', line.idname, line.value)
    //       }
    //     } else if (line.endTime === this.currentTime) {
    //       if (line.idname === 'R8') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}0|`)
    //         // console.log(line.idname, 0)
    //       }
    //       if (line.idname === 'T9') {
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}0|`)
    //         // console.log(line.idname, 0)
    //       }
    //       if (/V\d+/.test(line.idname)) {
    //         // console.log('asdasdadasadasd')
    //         this.sendingCommands = this.sendingCommands.concat(`${line.idname}N|`)
    //       }
    //     }
    //   })
    //   if (this.sendingCommands) {
    //     console.log('this.sendingCommands = ', this.sendingCommands)
    //     // serialPort.write(`${this.sendingCommands}\n`)
    //     this.sendingCommands = ''
    //   }
    //   if (this.currentTime >= this.data.allTime) {
    //     this.currentTime = 0
    //     clearInterval(this.intervalId)
    //   }
    //   ++this.currentTime
    //   // console.log(currentTime)
    //   // if (currentTime % 10 === 0) {
    //   //   // console.log('currentTime', currentTime)
    //   // }
    // }, 1000 / this.velocity)
    // this.counter.time = (data.allTime - this.currentTime) / this.velocity
    this.io.emit(socketConfig.start, this.counter, data)
  }

  connect = () => {
    if(!this.isSerialConnetcted) {
      this.serial(this.io)
      this.isSerialConnetcted = true
    }
  }
  // start()
  // counter.distance = 100
  // counter.time = data.allTime / velocity
  // console.log('counter', counter.distance, counter.time)
}
