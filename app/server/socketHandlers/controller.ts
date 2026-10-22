import socketConfig, { startSignal } from '../../config/socket.config'
import socket from 'socket.io'
import * as usb from 'usb'
import { ShortNames, ValveLineType } from '../../src/components/MainForm/MainFormInterfaces'

import Serial from '../serial'
import ThermostatController from '../termex'
import Stk500v2Flasher from '../flasher'
import { EventEmitter } from 'events';

interface Counter {
  distance: number,
  time: number,
}

const shortNamesToActionMapper = (name: ShortNames, value: boolean) => {
  console.log('name', name, value);

  switch (name) {
    case 'GV1':
      if (value) {
        return 'V0Y|'
      } else {
        return 'V0N|'
      }
    case 'GV2':
      if (value) {
        return 'V1Y|'
      } else {
        return 'V1N|'
      }
    case 'GV3':
      if (value) {
        return 'V2Y|'
      } else {
        return 'V2N|'
      }
    case 'GV4':
      if (value) {
        return 'V3Y|'
      } else {
        return 'V3N|'
      }
    case 'GV5':
      if (value) {
        return 'V4Y|'
      } else {
        return 'V4N|'
      }
    case 'GV6':
      if (value) {
        return 'V5Y|'
      } else {
        return 'V5N|'
      }
    case 'HV1':
      if (value) {
        return 'V6Y|'
      } else {
        return 'V6N|'
      }
    case 'HV2':
      if (value) {
        return 'V7Y|'
      } else {
        return 'V7N|'
      }
    case 'HV3':
      if (value) {
        return 'V8Y|'
      } else {
        return 'V8N|'
      }
    default:
      return ''
  }
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
  private thermostatCheckEnabled: boolean
  private flashing: boolean

  constructor(socket: socket.Socket, io: socket.Server) {
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
    this.Serial = new Serial(io)
    // this.init()
    //this.initialize()
    this.waitValue = false
    this.eventEmiiter = new EventEmitter()
    this.eventEmiiter.addListener('error', this.ErrorHandler)
    this.eventEmiiter.addListener('connected', () => {
      this.io.emit(socketConfig.thermostatConnected, true)
    })
    this.turningOn = false
    this.turningOff = false
    this.hasTemperatureFormerChanges = false
    this.thermostatCheckEnabled = true
    this.flashing = false
  }

  private initializeThermostat() {
    console.log('INIT')
    this.ThermostatController = new ThermostatController(this.eventEmiiter)
  }

  // переключатель из блока Options: отключает все обращения к термостату (TERMEX)
  setThermostatCheck = (enabled: boolean) => {
    console.log('thermostat check:', enabled)
    this.thermostatCheckEnabled = enabled
  }

  private isThermostatActive() {
    return this.hasTemperatureFormerChanges && this.thermostatCheckEnabled
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
      this.io.emit(socketConfig.thermostatConnected, false)
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
    clearInterval(this.temperatureInterval)
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
    this.isThermostatActive() && this.ThermostatController?.turnOff()
    //хак - термоконтроллер после того как перейдет в состояние выключено дискиптор HID устройства больше не доступен
    //и его надо инициализировать заново, но с задержкой
    setTimeout(() => {
      this.isThermostatActive() && this.initializeThermostat()
    }, 2000)
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

  rpmStart = (data: number) => {
    if (data > 0) {
      this.Serial.sendData(`R9${data}|\n`)
    } else {
      this.Serial.sendData(`R90}|\n`)
    }
  }

  switchValves = ({ shorName, value }: { shorName: ShortNames, value: boolean }) => {
    const result = shortNamesToActionMapper(shorName, value)
    console.log('sww', `${result}\n`);

    if (result) {
      this.Serial.sendData(`${result}\n`)
    }
  }

  checkValves = () => {
    this.Serial.sendData(`C0|C1|C2|C3|C4|C5|CS0|CS1|CS2|\n`)
  }

  startGettingTemperature() {
    clearInterval(this.temperatureInterval)
    this.temperatureInterval = setInterval(async () => {
      this.io.emit(socketConfig.tempChange, {
        temperature: this.isThermostatActive() && this.ThermostatController && this.ThermostatController.getTemperature() || 20,
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
  // Состояние для повторной отправки разового события start переподключившемуся клиенту
  getSignalState = () => {
    return this.data ? { counter: this.counter, data: this.data } : null
  }

  initStart = async (data: startSignal) => {
    const hasTemperatureFormerChanges = data.lineFormer.find(lf => lf.name === 'TempSetter').changes.length > 0
    this.hasTemperatureFormerChanges = hasTemperatureFormerChanges
    // клиент шлёт состояние чекбокса "Thermostat check" вместе со start —
    // надёжнее отдельного события, которое могло потеряться при переподключении
    if (typeof data.thermostatCheck === 'boolean') {
      this.thermostatCheckEnabled = data.thermostatCheck
    }
    this.turningOn = true
    // включили проверку после Connect - контроллер ещё не создан
    if (this.isThermostatActive() && !this.ThermostatController) {
      this.initializeThermostat()
    }
    this.isThermostatActive() && await this.ThermostatController.turnOn()
    this.isThermostatActive() && await this.delaytTimer(7000)
    this.io.emit(socketConfig.connected, true)
    this.start(data)
  }

  start = async (data: startSignal) => {
    this.init(data)
    // this.hasTemperatureFormerChanges && await this.ThermostatController.turnOn()
    this.isThermostatActive() && this.startGettingTemperature()
    this.counter.distance = 100
    this.intervalId = setInterval(() => {
      this.io.emit(socketConfig.rpmChange, {
        data: this.Serial.getRPMValue(),
        time: this.currentTime,
      })

      if (this.isThermostatActive() && !this.ThermostatController.getAlarmStatus()) {
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
          if (line.idname === 'A11') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
          }
          if (line.idname === 'A12') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}Y|`)
          }
          if (line.idname === 'R9') {
            this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
          }
          if (line.idname === 'T10') {
            //this.sendingCommands = this.sendingCommands.concat(`${line.idname}${line.value}|`)
            console.log('temperature line sending', line.idname, line.value)
            this.isThermostatActive() && this.ThermostatController.writeCurrentSetTemp(line.value)
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
          if (/A\d+/.test(line.idname)) {
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
        this.Serial.sendData('S\n')
        // this.Serial.sendData('V0N|V1N|V2N|V3N|V4N|V5N|V6N|V7N|V8N|R90|A11N|A12N|\n') // close pinch valves
        this.currentTime = 0

        this.io.emit(socketConfig.protocolFinish)
        clearInterval(this.intervalId)
      }
      ++this.currentTime
    }, 1000 / this.velocity)
    this.counter.time = (data.allTime - this.currentTime) / this.velocity
    this.io.emit(socketConfig.start, this.counter, data)
  }

  connect = () => {
    this.thermostatCheckEnabled && this.initializeThermostat()
    this.io.emit(socketConfig.searchingSerial, true)
    this.Serial.findSerialPort()
  }

  disconnectSerial = () => {
    console.log('DISCONNET');

    this.Serial?.disconnect()
  }

  // Прошивка ATmega2560 по STK500v2 (загрузчик в 0x3E000) без avrdude:
  // закрываем порт 500k -> flasher на 115200 (sign-on, запись страниц, верификация)
  // -> переподключаем на 500k и ждём CONNECTED от прошивки
  flashFirmware = async (hexPath: string) => {
    if (this.flashing) {
      this.io.emit(socketConfig.flashError, 'Прошивка уже выполняется')
      return
    }
    const portPath = this.Serial.getPortPath()
    if (!portPath) {
      this.io.emit(socketConfig.flashError, 'Сначала подключитесь к плате (Connect)')
      return
    }
    this.flashing = true
    try {
      await this.Serial.closePort()
      const flasher = new Stk500v2Flasher((p) => this.io.emit(socketConfig.flashProgress, p))
      console.log('Start flashing')
      await flasher.flash(portPath, hexPath)
      console.log('Finish flashing')

      // прошивка отправляет CONNECTED один раз ~60 мс после старта;
      // повторное открытие порта даёт reset (DTR) и свежий CONNECTED
      let connected = false
      for (let attempt = 0; attempt < 2 && !connected; attempt++) {
        try {
          await this.Serial.connectToPort(portPath)
          connected = true
          console.log('Reconnect after flash fine')
        } catch (e) {
          console.log('reconnect after flash failed', e)
          await this.delaytTimer(500)
        }
      }
      if (!connected) {
        this.io.emit(socketConfig.flashError, 'Прошивка записана и проверена, но плата не ответила. Нажмите Connect.')
      }
    } catch (e) {
      console.log('flash error', e)
      const message = e instanceof Error ? e.message : String(e)
      this.io.emit(socketConfig.flashError, message)
      // пробуем вернуть рабочее соединение на 500k
      await this.Serial.connectToPort(portPath).catch(() => {})
    } finally {
      console.log('CAN FLASH AGAIN')
      this.flashing = false
    }
  }
}
