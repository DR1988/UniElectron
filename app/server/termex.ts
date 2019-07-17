import * as HID from 'node-hid';
import * as os from 'os';
import { EventEmitter } from 'events';

const convertToASCII = (str: string) => {
    const arr = []
    if (os.platform() === 'win32') {
        arr.unshift(0)
    }
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i))
    }
    return arr
}

/** Class representing a HID device to controll TERMEX Thermostat. */
export default class ThermostatController {
    private termexHID: HID.HID
    private termexDevice: HID.Device
    constructor(private exeptionEmitter: EventEmitter) {
        this.init()
    }

    private init() {
        const devices = HID.devices()
        // console.log('devices', devices)
        const termexDevice = devices.find(d => d.manufacturer === 'TERMEX')
        if (!termexDevice) {
            console.log('init error')
            this.exeptionEmitter.emit('error', {
                name: "ConnectionError",
                message: 'THERMOSTAT NOT CONNETED. CHEK CONNECTION AND PLUG IN CABEL'
            })
            return
        }
        this.termexDevice = termexDevice
        this.termexHID = new HID.HID(termexDevice.path)
        this.initExeptionHandler()
        this.isRunning()
    }

    private initExeptionHandler() {
        this.termexHID.on('error', error => {
            if(error.toString() === 'Error: could not read from HID device'){
                this.exeptionEmitter.emit('error', {
                    name: "ConnectionError",
                    message: 'THERMOSTAT NOT CONNETED. CHEK CONNECTION AND PLUG IN CABEL'
                })
            }
        })
    }

    private async dataPromise(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.termexHID.on('data', (data: Buffer) => {
                resolve(data)
            })
        }) 
    }

    private statusHandler = (data: Buffer) => {
        const response = data.toString().trim().split('\n')[0]
        console.log('response', response)
        if(this.checkIfStatusError(response)) {
            this.exeptionEmitter.emit('error', {
                name: 'StatusError',
                message: "THERMOSTAT's STATUS ERROR. CHECK THERMOSTAT"
            })
            return
        }
        const responseData = response.split('0x00')[1]
        return responseData
    }

    private checkIfStatusError(response: string): boolean {
       return !/0x00/.test(response)
    }

    async turnOn() {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} RUN WR 1`)
        // console.log('this.termexDevice', this.termexDevice)
        try {
            this.termexHID.write(command)
            const data = await this.dataPromise()
            this.statusHandler(data)
        } catch (error) {
            console.log('eeeeeerrror', error)
        }
    }

    async turnOff() {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} RUN WR 0`)
        try {
            this.termexHID.write(command)
            const data = await this.dataPromise()
            this.statusHandler(data)
        } catch (error) {
            console.log('eeeeeerrror', error)
        }
    }

    private async isRunning() {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} RUN RD`)
        this.termexHID.write(command)
        const data = await this.dataPromise()
        this.statusHandler(data)
    }

    private readCurrentSetTemp = () => {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} SET.VAL RD`)
        this.termexHID.write(command)
    }

    async writeCurrentSetTemp(temperature: string|number) {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} SET.VAL WR ${temperature}`)
        try {
            this.termexHID.write(command)
            const data = await this.dataPromise()
            this.statusHandler(data)
        } catch (error) {
            console.log('eeeeeerrror', error)
        }
    }

    async getTemperature() {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} DAT.T.2 RD`)
        try {
            this.termexHID.write(command)
            const data = await this.dataPromise()
            const responseData = this.statusHandler(data)
            // console.log('responseData', responseData)
            return responseData
        } catch (error) {
            console.log('eeeeeerrror', error)
        }
    }

    async getAlarmStatus() {
        const command = convertToASCII(`:${this.termexDevice.serialNumber} ALM.STATUS RD`)
        try {
            this.termexHID.write(command)
            const data = await this.dataPromise()
            const responseData = this.statusHandler(data)
            return responseData
        } catch (error) {
            console.log('eeeeeeeeeerrrrorr', error)           
        }
    }
}