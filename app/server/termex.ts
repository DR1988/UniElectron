import * as HID from 'node-hid';
import { EventEmitter } from 'events';

const READ_TIMEOUT_MS = 1000
const REOPEN_TIMEOUT_MS = 15000
const REOPEN_POLL_INTERVAL_MS = 300
// Сброс протухшего дескриптора на ошибочном пути: как долго ждать
// перечисления устройства заново (раздел 2.4 протокола)
const RECOVERY_TIMEOUT_MS = 3000
const RECOVERY_POLL_INTERVAL_MS = 100

// Протокол: запрос — строка ASCII, начинающаяся с ':' и заканчивающаяся
// CR (13) или любым байтом меньше 13
const convertToASCII = (str: string): number[] => {
    const arr: number[] = []
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i))
    }
    arr.push(13)
    return arr
}

const convertFromASCII = (numbers: Array<number>): string => {
    let i = -1
    const charArray: Array<string> = []
    while (++i < numbers.length && numbers[i] !== 0) {
        charArray.push(String.fromCharCode(numbers[i]))
    }
    return charArray.join('')
}

// Коды статуса ответа (раздел 2.3 протокола)
const STATUS_MESSAGES: Record<string, string> = {
    '0x01': 'BAD REQUEST FORMAT',
    '0x02': 'BAD VALUE FORMAT',
    '0x03': 'UNKNOWN DESTINATION',
    '0x04': 'UNKNOWN OPERATION',
    '0x05': 'VALUE OUT OF RANGE',
    '0x06': 'COMMAND NOT AVAILABLE WHEN THERMOSTAT IS OFF',
}

interface ThermostatResponse {
    status: string
    data?: string
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Class representing a HID device to controll TERMEX Thermostat. */
export default class ThermostatController {
    private termexHID: HID.HID
    private termexDevice: HID.Device
    // node-hid 1.3.2: readTimeout на закрытом handle вызывает SIGSEGV,
    // поэтому обращения к termexHID допускаются только при hidOpen = true
    private hidOpen = false

    constructor(private exeptionEmitter: EventEmitter) {
        this.init()
    }

    private findTermexDevice(): HID.Device | undefined {
        return HID.devices().find(d => d.manufacturer === 'TERMEX')
    }

    private init() {
        const termexDevice = this.findTermexDevice()
        if (!termexDevice) {
            console.log('init error: TERMEX device not found')
            this.emitConnectionError()
            return
        }
        this.termexDevice = termexDevice
        try {
            this.openDevice(termexDevice)
        } catch (error) {
            console.log('init error:', error)
            this.emitConnectionError()
            return
        }
        console.log('checkConnection init')
        if (this.checkConnection()) {
            // связь установлена - сообщаем контроллеру, чтобы он уведомил клиент
            this.exeptionEmitter.emit('connected')
        }
    }

    private openDevice(device: HID.Device) {
        this.termexHID = new HID.HID(device.path)
        this.hidOpen = true
        this.initExeptionHandler()
    }

    private initExeptionHandler() {
        this.termexHID.on('error', error => {
            if (error.toString() === 'Error: could not read from HID device') {
                this.emitConnectionError()
            }
        })
    }

    // SER доступен в любом состоянии, включая "выключено" — подходит для проверки связи
    private checkConnection(): boolean {
        const response = this.send(`:${this.termexDevice.serialNumber} SER RD`)
        if (response.status !== '0x00') {
            this.emitConnectionError()
            return false
        }
        return true
    }

    private emitConnectionError() {
        this.exeptionEmitter.emit('error', {
            name: "ConnectionError",
            message: 'THERMOSTAT NOT CONNETED. CHEK CONNECTION AND PLUG IN CABEL'
        })
    }

    private emitStatusError(status: string) {
        this.exeptionEmitter.emit('error', {
            name: 'StatusError',
            message: `THERMOSTAT STATUS ERROR ${status}: ${STATUS_MESSAGES[status] || 'UNKNOWN STATUS'}`
        })
    }

    // Отправка команды и разбор ответа ":ADDR STA [ДАННЫЕ]".
    // Сбой связи (таймаут/несформированный ответ) — status 'ERROR', без emit.
    // Статусы 0x01-0x06 возвращаются вызывающему — он решает, ошибка это или нет.
    private send(command: string): ThermostatResponse {
        if (!this.termexHID || !this.hidOpen) {
            // handle закрыт (init не удался или recovery ещё не дождался устройства).
            // Без ожидания проверяем, не появилось ли устройство, — и открываем.
            const device = this.findTermexDevice()
            if (!device) {
                return { status: 'ERROR' }
            }
            try {
                this.termexDevice = device
                this.openDevice(device)
            } catch (error) {
                console.log('open error:', error)
                return { status: 'ERROR' }
            }
        }
        const attempt = (): ThermostatResponse => {
            try {
                while (this.termexHID.readTimeout(0).length > 0) {
                    // сбрасываем остатки предыдущих ответов, чтобы не сдвинуться
                }

                console.log('commandcommand', command)
                const result = this.termexHID.write(convertToASCII(command))
                console.log('resultresultresult', result)
                const ddddd = this.termexHID.readTimeout(READ_TIMEOUT_MS)
                console.log('ddddddddddddddd', ddddd)
                const raw = convertFromASCII(ddddd)
                console.log('rawraw', raw)
                const response = raw.trim().split('\n')[0].trim()
                const match = response.match(/^:\S+ (0x[0-9A-Fa-f]{2})(?:\s+(.*))?$/)
                if (!match) {
                    return { status: 'ERROR' }
                }
                return { status: match[1], data: match[2] ? match[2].trim() : undefined }
            } catch (error) {
                console.log('send error:', error)
                return { status: 'ERROR' }
            }
        }
        let response = attempt()
        if (response.status === 'ERROR') {
            // Раздел 2.4 протокола: блок мог сменить состояние сам
            // (кнопка на панели, авто-вкл/выкл по RTC) — открытый дескриптор
            // недействителен. Переоткрываем устройство и повторяем команду один раз.
            if (this.reopenDeviceSync()) {
                response = attempt()
            }
        }
        return response
    }

    // Синхронный сброс протухшего дескриптора: закрывает текущий handle,
    // ждёт появления устройства (опрос каждые RECOVERY_POLL_INTERVAL_MS)
    // и открывает заново. Вызывается только на ошибочном пути send().
    private reopenDeviceSync(): boolean {
        try {
            this.termexHID.close()
        } catch (error) {
            console.log('close error:', error)
        }
        this.hidOpen = false
        const deadline = Date.now() + RECOVERY_TIMEOUT_MS
        for (;;) {
            const device = this.findTermexDevice()
            if (device) {
                try {
                    this.termexDevice = device
                    this.openDevice(device)
                    return true
                } catch (error) {
                    console.log('reopen error:', error)
                }
            }
            if (Date.now() >= deadline) {
                return false
            }
            const end = Date.now() + RECOVERY_POLL_INTERVAL_MS
            while (Date.now() < end) {
                // блокирующая пауза: не более RECOVERY_TIMEOUT_MS суммарно
            }
        }
    }

    // После RUN WR блок перечисливается заново по USB и открытый дескриптор
    // становится недействительным (раздел 2.4 протокола) — ждём появления
    // устройства и открываем его заново
    private async reopenDevice(): Promise<boolean> {
        try {
            this.termexHID.close()
        } catch (error) {
            console.log('close error:', error)
        }
        this.hidOpen = false
        const deadline = Date.now() + REOPEN_TIMEOUT_MS
        while (Date.now() < deadline) {
            await sleep(REOPEN_POLL_INTERVAL_MS)
            const device = this.findTermexDevice()
            if (!device) {
                continue
            }
            try {
                this.termexDevice = device
                this.openDevice(device)
                return true
            } catch (error) {
                console.log('reopen error:', error)
            }
        }
        return false
    }

    private async runWrite(value: '0' | '1') {
        const response = this.send(`:${this.termexDevice.serialNumber} RUN WR ${value}`)
        if (response.status !== 'ERROR' && response.status !== '0x00') {
            // команда отклонена — состояние не изменилось, переподключения нет
            this.emitStatusError(response.status)
            return
        }
        // 0x00 или ответа не было (переподключение могло поглотить ответ) — открываем заново
        if (!(await this.reopenDevice())) {
            this.emitConnectionError()
            return
        }

        console.log('runWrite checkConnection')
        // this.checkConnection()
    }

    async turnOn() {
        await this.runWrite('1')
    }

    async turnOff() {
        await this.runWrite('0')
    }

    getTemperature(): string | undefined {
        if (!this.termexHID) {
            return undefined
        }
        const response = this.send(`:${this.termexDevice.serialNumber} DAT.T.1 RD`)
        if (response.status === 'ERROR') {
            this.emitConnectionError()
            return undefined
        }
        return response.status === '0x00' ? response.data : undefined
    }

    getAlarmStatus(): boolean {
        if (!this.termexHID) {
            return false
        }
        const response = this.send(`:${this.termexDevice.serialNumber} ALM.STATUS RD`)

        console.log('responseresponse', response)
        // fail-safe: любая неопределённость считается сработавшей защитой
        return response.status === '0x00' && !!response.data && /^0+$/.test(response.data)
    }

    writeCurrentSetTemp(temperature: string | number) {
        if (!this.termexHID) {
            return
        }
        const response = this.send(`:${this.termexDevice.serialNumber} SET.VAL WR ${temperature}`)
        if (response.status === 'ERROR') {
            this.emitConnectionError()
        } else if (response.status !== '0x00') {
            this.emitStatusError(response.status)
        }
    }
}
