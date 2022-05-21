import socketConfig, { startSignal } from '../../config/socket.config'
import socket from 'socket.io'
import * as usb from 'usb'
import { ValveLineType } from '../../src/components/MainForm/MainFormInterfaces'

import Serial from '../serial'
import ThermostatController from '../termex'
import { EventEmitter } from 'events';

interface Counter {
  distance: number,
  time: number,
}

export default class Controller {
  private data: startSignal
  private socket: socket.Socket
  private io: socket.Server
  private lines: Array<any>
  private linesOfActions: Array<ValveLineType>
  private velocity: number
  private intervalId: NodeJS.Timeout
  private temperatureInterval: NodeJS.Timeout
  private counter: Counter
  private currentTime: number
  private sendingCommands: string
  private Serial: Serial
  private waitValue: boolean
  private ThermostatController: ThermostatController
  private eventEmiiter: EventEmitter
  private turningOn: boolean
  private turningOff: boolean
  private hasTemperatureFormerChanges: boolean

  constructor(socket: socket.Socket, io: socket.Server) {
    this.data = null
    this.socket = socket
    this.io = io

    this.lines = []
    this.linesOfActions = []
    this.velocity = 4
    this.intervalId = null
    this.counter = { distance: 0, time: 0 }

    this.currentTime = 0
    this.sendingCommands = ''
    this.Serial = new Serial(io)
    // this.init()
    //this.initialize()
    this.waitValue = false
    this.eventEmiiter = new EventEmitter()
    this.eventEmiiter.addListener('error', this.ErrorHandler)
    this.turningOn = false
    this.turningOff = false
    this.hasTemperatureFormerChanges = false
  }

  private initializeThermostat() {
    console.log('INIT')
    this.ThermostatController = new ThermostatController(this.eventEmiiter)
  }

  // private async usbPromise(): Promise<Boolean> {
  //   return new Promise((resolve, reject) => {
  //     usb.on('attach', (device) => {
  //       device.open()
  //       device.getStringDescriptor(device.deviceDescriptor.iManufacturer, (err, data) => {
  //         console.log('data', ':', data)
  //         resolve(data.toString() === 'TERMEX')
  //       })
  //       // resolve(device)
  //     })
  //   })
  // }

  private ErrorHandler = async (error) => {
    console.log('error', error)
    // console.log('this.usbPromise()', await this.usbPromise())
    if (this.turningOn) {
      console.log('this.turningOn', this.turningOn)
      this.io.emit(socketConfig.connected, false)
      await this.delaytTimer(3000)
      // this.io.emit(socketConfig.connected, true)
      // await this.usbPromise()
      this.ThermostatController = new ThermostatController(this.eventEmiiter)
      this.turningOn = false
    } else if (this.turningOff) {
      console.log('this.turningOff', this.turningOff)
      this.io.emit(socketConfig.connected, false)
      await this.delaytTimer(3000)
      this.io.emit(socketConfig.connected, true)
      // await this.usbPromise()
      this.ThermostatController = new ThermostatController(this.eventEmiiter)
      this.turningOff = false
    } else {
      this.io.emit(socketConfig.thermoStatInitError, error)
    }
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

  pause = () => {
    console.log('pause')
    console.log(Date.now())
    clearInterval(this.intervalId)
    this.io.emit(socketConfig.pause, { currentTime: this.currentTime })
  }

  stop = () => {
    console.log('controller stop')
    clearInterval(this.intervalId)
    clearInterval(this.temperatureInterval)
    this.currentTime = 0
    this.counter = {
      distance: 0,
      time: 1,
    }
    // this.Serial.sendData('R80|\n')
    this.Serial.sendData('S\n')
    this.turningOff = true
    this.hasTemperatureFormerChanges && this.ThermostatController.turnOff()
    this.io.emit(socketConfig.stop, this.counter)
  }

  private checkingValues = (value: string) => {
    const checkingInterval = setInterval(() => {
      if (Math.abs(this.Serial.getRPMValue() - parseInt(value)) < 20) {
        // this.start(this.data)
        clearInterval(checkingInterval)
      }
    }, 1000)
  }

  switchHV = (data) => {
    // console.log(data ? 'V6Y|V7Y|\n' : 'V6N|V7N|\n')
    this.Serial.sendData(data ? 'V6Y|V7Y|V8Y|\n' : 'V6N|V7N|V8N|\n')
  }

  startGettingTemperature() {
    this.temperatureInterval = setInterval(async () => {
      this.io.emit(socketConfig.tempChange, {
        temperature: this.hasTemperatureFormerChanges && this.ThermostatController && this.ThermostatController.getTemperature() || 20,
        time: this.currentTime,
      })
    }, 5000 / this.velocity)
  }

  private delaytTimer(ms = 1000) {
    console.log('------------')
    console.log(`delay ${ms} ms \n`)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms);
    })
  }
  initStart = async (data: startSignal) => {
    const hasTemperatureFormerChanges = data.lineFormer.find(lf => lf.name === 'TempSetter').changes.length > 1
    this.hasTemperatureFormerChanges = hasTemperatureFormerChanges
    this.turningOn = true
    this.hasTemperatureFormerChanges && await this.ThermostatController.turnOn()
    this.hasTemperatureFormerChanges && await this.delaytTimer(7000)
    this.io.emit(socketConfig.connected, true)
    this.start(data)
  }

  start = async (data: startSignal) => {
    this.init(data)
    // this.hasTemperatureFormerChanges && await this.ThermostatController.turnOn()
    // this.startGettingTemperature()
    this.counter.distance = 100
    this.intervalId = setInterval(() => {
      this.io.emit(socketConfig.rpmChange, {
        data: this.Serial.getRPMValue(),
        time: this.currentTime,
      })

      if (this.hasTemperatureFormerChanges && !this.ThermostatController.getAlarmStatus()) {
        this.stop()
        this.io.emit(socketConfig.thermoStatInitError, {
          name: "ConnectionError",
          message: 'THERMOSTAT ERROR. CHECK THERMOSTAT'
        })
        return
      }
      this.lines.forEach((line) => {
        // console.log('line', line.idname)
        if (
          line.startTime === this.currentTime
          && line.waitForValue
          && line.idname === 'R8'
          && Math.abs(this.Serial.getRPMValue() - parseInt(line.value)) > 20
        ) {
          console.log('this.Serial.getRPMValue()', this.Serial.getRPMValue())
          console.log('line.value', line.value)
          this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
          this.pause()
          this.checkingValues(line.value)
        } else if (line.startTime === this.currentTime) {
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
          if (line.idname === 'V8') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
          }
          if (line.idname === 'R9') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
          }
          if (line.idname === 'T10') {
            //this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
            console.log('temperature line sending', line.idname, line.value)
            this.hasTemperatureFormerChanges && this.ThermostatController.writeCurrentSetTemp(line.value)
          }
        } else if (line.endTime === this.currentTime) {
          if (line.idname === 'R9') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}0|`)
            // console.log(line.idname, 0)
          }
          if (line.idname === 'T10') {
            console.log('line', line)
            // this.hasTemperatureFormerChanges && this.ThermostatController.turnOff()
          }
          if (/V\d+/.test(line.idname)) {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}N|`)
          }
        }
      })
      if (this.sendingCommands) {
        console.log('this.sendingCommands = ', this.sendingCommands)
        this.io.emit(socketConfig.serialSending, this.sendingCommands)
        this.Serial.sendData(`${this.sendingCommands}\n`)
        this.sendingCommands = ''
      }
      if (this.currentTime >= this.data.allTime) {
        this.Serial.sendData('V0N|V1N|V2N|V3N|V4N|V5N|V6N|V7N|V8N|R90|\n') // close pinch valves
        this.currentTime = 0
        clearInterval(this.intervalId)
      }
      ++this.currentTime
    }, 1000 / this.velocity)
    this.counter.time = (data.allTime - this.currentTime) / this.velocity
    this.io.emit(socketConfig.start, this.counter, data)
  }

  connect = () => {
    this.initializeThermostat()
    this.Serial.findSerialPort()
  }

  disconnectSerial = () => {
    console.log('DISCONNET');

    this.Serial?.disconnect()
  }
}
