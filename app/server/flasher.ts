import SerialPort from 'serialport'
import * as fs from 'fs'

// STK500v2 (AVR068) параметры ATmega2560, снятые с avrdude (avrdude.conf + живой захват кадров)
const MESSAGE_START = 0x1b
const TOKEN = 0x0e
const CMD_SIGN_ON = 0x01
const CMD_LOAD_ADDRESS = 0x06
const CMD_ENTER_PROGMODE_ISP = 0x10
const CMD_LEAVE_PROGMODE_ISP = 0x11
const CMD_PROGRAM_FLASH_ISP = 0x13
const CMD_READ_FLASH_ISP = 0x14
const CMD_READ_SIGNATURE_ISP = 0x1b

const PAGE_SIZE = 256
const SIGNATURE = [0x1e, 0x98, 0x01]
// timeout=200 stabdelay=100 cmdexedelay=25 synchloops=32 bytedelay=0 pollvalue=0x53 pollindex=3
const ENTER_PROGMODE_PARAMS = [0xc8, 0x64, 0x19, 0x20, 0x00, 0x53, 0x03]
// control stack из pgm_enable: "1010.1100--0101.0011--xxxx.xxxx--xxxx.xxxx"
const CONTROL_STACK = [0xac, 0x53, 0x00, 0x00]
// paged write flash: mode|0x80=0xc1 delay=10 loadpage_lo=0x40 writepage=0x4c read_lo=0x20 readback=00 00
const PROGRAM_FLASH_HEADER = [0xc1, 0x0a, 0x40, 0x4c, 0x20, 0x00, 0x00]
// первый байт команды read_lo: "0010.0000--aaaa.aaaa--aaaa.aaaa--oooo.oooo"
const READ_FLASH_LO_BYTE = 0x20
// загрузчик (stk500boot_v2_mega2560) работает на 115200 (UBRR=16, U2X=1)
const BOOTLOADER_BAUD = 115200

export interface FlashProgress {
  phase: 'connecting' | 'writing' | 'verifying' | 'done',
  done: number,
  total: number
}

interface ParsedFrame {
  seq: number,
  payload: Buffer
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export default class Stk500v2Flasher {
  private port: SerialPort | null = null
  private seq = 1
  private rx = Buffer.alloc(0)
  private waiters: Array<{ resolve: (payload: Buffer) => void; reject: (e: Error) => void }> = []

  constructor(private onProgress?: (p: FlashProgress) => void) {}

  async flash(portPath: string, hexPath: string): Promise<void> {
    const image = Stk500v2Flasher.parseIntelHex(fs.readFileSync(hexPath, 'utf8'))
    if (image.length > 0x3e000) {
      throw new Error('Прошивка больше раздела приложения ATmega2560 (> 248 КБ)')
    }

    try {
      this.progress({ phase: 'connecting', done: 0, total: 1 })
      await this.openPort(portPath)
      const name = await this.signOn()
      console.log('STK500v2 programmer:', name)

      await this.command(Buffer.concat([
        Buffer.from([CMD_ENTER_PROGMODE_ISP]),
        Buffer.from(ENTER_PROGMODE_PARAMS),
        Buffer.from(CONTROL_STACK),
      ]))

      const sig: number[] = []
      for (let i = 0; i < 3; i++) {
        const resp = await this.command(Buffer.from([CMD_READ_SIGNATURE_ISP, 0x04, 0x30, 0x00, i, 0x00]))
        sig.push(resp[2])
      }
      if (sig.some((b, i) => b !== SIGNATURE[i])) {
        const hex = sig.map(b => ('0' + b.toString(16)).slice(-2)).join(' ')
        throw new Error(`Неожиданная сигнатура чипа: ${hex} (ожидалось 1e 98 01)`)
      }

      const pages = Math.ceil(image.length / PAGE_SIZE)
      for (let p = 0; p < pages; p++) {
        await this.loadAddress(p * PAGE_SIZE)
        await this.programPage(Stk500v2Flasher.getPage(image, p))
        this.progress({ phase: 'writing', done: p + 1, total: pages })
      }

      for (let p = 0; p < pages; p++) {
        await this.loadAddress(p * PAGE_SIZE)
        const resp = await this.command(Buffer.from([CMD_READ_FLASH_ISP, 0x01, 0x00, READ_FLASH_LO_BYTE]))
        const read = resp.slice(2, 2 + PAGE_SIZE)
        if (!read.equals(Stk500v2Flasher.getPage(image, p))) {
          throw new Error(`Ошибка верификации: страница ${p} (байт 0x${(p * PAGE_SIZE).toString(16)}) не совпадает с файлом`)
        }
        this.progress({ phase: 'verifying', done: p + 1, total: pages })
      }

      // после ответа загрузчик делает сброс и прыгает в приложение (0x0)
      await this.command(Buffer.from([CMD_LEAVE_PROGMODE_ISP, 0x01, 0x01]))
      await sleep(100)
      this.progress({ phase: 'done', done: 1, total: 1 })
    } finally {
      await this.closePort()
    }
  }

  private progress(p: FlashProgress) {
    if (this.onProgress) {
      this.onProgress(p)
    }
  }

  private openPort(portPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.port = new SerialPort(portPath, {
          baudRate: BOOTLOADER_BAUD,
          autoOpen: false,
        })
      } catch (e) {
        reject(e as Error)
        return
      }
      this.port.on('data', this.onData)
      // по умолчанию dtr=true/rts=true: при открытии CH340 устанавливает DTR,
      // авто-reset плата -> сброс MCU -> загрузчик (BOOTRST=0)
      this.port.open((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  private closePort(): Promise<void> {
    return new Promise((resolve) => {
      const port = this.port
      this.port = null
      this.waiters.forEach(w => w.reject(new Error('порт закрыт')))
      this.waiters = []
      if (port) {
        port.removeAllListeners('data')
        if (port.isOpen) {
          port.close(() => resolve())
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  private setControls(dtr: boolean, rts: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (this.port && this.port.isOpen) {
        this.port.set({ dtr, rts }, () => resolve())
      } else {
        resolve()
      }
    })
  }

  // sign-on с ретраями: покрывает окно старта загрузчика (~70 мс после сброса)
  // и случай, когда для входа в загрузчик нужен дополнительный DTR-импульс
  private async signOn(): Promise<string> {
    for (let round = 0; round < 2; round++) {
      if (round === 1) {
        // второй круг: явно переключить DTR/RTS, чтобы вызвать reset платы
        await this.setControls(false, false)
        await sleep(100)
        await this.setControls(true, true)
        await sleep(300)
      }
      for (let i = 0; i < 40; i++) {
        try {
          this.writeFrame(Buffer.from([CMD_SIGN_ON]))
          const resp = await this.waitForResponse(250)
          if (resp[0] === CMD_SIGN_ON && resp[1] === 0 && resp.length > 3) {
            this.seq++
            return resp.slice(3).toString('utf8')
          }
        } catch (e) {
          // нет ответа - пробуем снова
        }
      }
    }
    throw new Error('Загрузчик не отвечает на sign-on. Проверьте подключение USB-порта и попробуйте ещё раз.')
  }

  private async command(payload: Buffer, timeoutMs = 3000, retries = 5): Promise<Buffer> {
    let lastErr: Error = new Error('command failed')
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        this.writeFrame(payload)
        const resp = await this.waitForResponse(timeoutMs)
        if (resp.length < 2) {
          throw new Error('слишком короткий ответ загрузчика')
        }
        const status = resp[1]
        if (status !== 0) {
          throw new Error(`команда 0x${payload[0].toString(16)} завершилась со статусом 0x${status.toString(16)}`)
        }
        this.seq++
        return resp
      } catch (e) {
        lastErr = e as Error
        // ресинхронизация: несколько sign-on, затем повтор команды
        for (let s = 0; s < 3; s++) {
          try {
            this.writeFrame(Buffer.from([CMD_SIGN_ON]))
            const resp = await this.waitForResponse(500)
            if (resp[0] === CMD_SIGN_ON && resp[1] === 0) {
              break
            }
          } catch (syncErr) {
            // пробуем дальше
          }
        }
      }
    }
    throw lastErr
  }

  private loadAddress(byteAddr: number): Promise<Buffer> {
    // flash адресуется словами (addrshift=1); у ATmega2560 в определении памяти
    // есть load_ext_addr, поэтому бит31 (extended/RAMPZ) avrdude ставит всегда
    const word = (byteAddr >> 1) | 0x80000000
    return this.command(Buffer.from([
      CMD_LOAD_ADDRESS,
      (word >>> 24) & 0xff,
      (word >>> 16) & 0xff,
      (word >>> 8) & 0xff,
      word & 0xff,
    ]))
  }

  private programPage(data: Buffer): Promise<Buffer> {
    return this.command(Buffer.concat([
      Buffer.from([CMD_PROGRAM_FLASH_ISP, data.length >> 8, data.length & 0xff]),
      Buffer.from(PROGRAM_FLASH_HEADER),
      data,
    ]))
  }

  private writeFrame(payload: Buffer): void {
    const len = payload.length
    const frame = Buffer.alloc(6 + len)
    frame[0] = MESSAGE_START
    frame[1] = this.seq
    frame[2] = (len >> 8) & 0xff
    frame[3] = len & 0xff
    frame[4] = TOKEN
    payload.copy(frame, 5)
    let csum = 0
    for (let i = 0; i < 5 + len; i++) {
      csum ^= frame[i]
    }
    frame[5 + len] = csum
    if (this.port && this.port.isOpen) {
      this.port.write(frame)
    }
  }

  private waitForResponse(timeoutMs: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject }
      this.waiters.push(waiter)
      setTimeout(() => {
        const i = this.waiters.indexOf(waiter)
        if (i >= 0) {
          this.waiters.splice(i, 1)
        }
        reject(new Error('таймаут ответа загрузчика'))
      }, timeoutMs)
    })
  }

  private onData = (chunk: Buffer) => {
    this.rx = Buffer.concat([this.rx, chunk])
    for (;;) {
      const frame = this.tryParseFrame()
      if (!frame) {
        break
      }
      // отвечаем только на свой seq; чужие кадры игнорируем
      if (frame.seq === this.seq && this.waiters.length > 0) {
        this.waiters.shift()!.resolve(frame.payload)
      }
    }
  }

  private tryParseFrame(): ParsedFrame | null {
    const i = this.rx.indexOf(MESSAGE_START)
    if (i < 0) {
      this.rx = Buffer.alloc(0)
      return null
    }
    if (i > 0) {
      this.rx = this.rx.slice(i)
    }
    if (this.rx.length < 6) {
      return null
    }
    const len = (this.rx[2] << 8) | this.rx[3]
    if (this.rx[4] !== TOKEN) {
      this.rx = this.rx.slice(1)
      return null
    }
    if (this.rx.length < 6 + len) {
      return null
    }
    let csum = 0
    for (let j = 0; j < 5 + len; j++) {
      csum ^= this.rx[j]
    }
    if (csum !== this.rx[5 + len]) {
      this.rx = this.rx.slice(1)
      return null
    }
    const frame: ParsedFrame = {
      seq: this.rx[1],
      payload: this.rx.slice(5, 5 + len),
    }
    this.rx = this.rx.slice(6 + len)
    return frame
  }

  private static getPage(image: Buffer, page: number): Buffer {
    const offset = page * PAGE_SIZE
    let data = image.slice(offset, offset + PAGE_SIZE)
    if (data.length < PAGE_SIZE) {
      data = Buffer.concat([data, Buffer.alloc(PAGE_SIZE - data.length, 0xff)])
    }
    return data
  }

  static parseIntelHex(text: string): Buffer {
    let base = 0
    const bytes = new Map<number, number>()
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line.startsWith(':')) {
        continue
      }
      const rec = Buffer.from(line.slice(1), 'hex')
      // count(1) + address(2) + type(1) + data(count) + checksum(1) = 5 + count
      if (rec.length < 5 || rec.length !== 5 + rec[0]) {
        throw new Error(`Intel HEX: повреждённая строка "${line}"`)
      }
      const count = rec[0]
      const addr = (rec[1] << 8) | rec[2]
      const type = rec[3]
      const payload = rec.slice(4, 4 + count)
      let sum = 0
      for (let i = 0; i < rec.length; i++) {
        sum = (sum + rec[i]) & 0xff
      }
      if (sum !== 0) {
        throw new Error(`Intel HEX: ошибка контрольной суммы в строке "${line}"`)
      }
      switch (type) {
        case 0x00:
          for (let i = 0; i < count; i++) {
            bytes.set(base + addr + i, payload[i])
          }
          break
        case 0x01:
          // end of file
          break
        case 0x02:
          base = ((payload[0] << 8) | payload[1]) << 4
          break
        case 0x04:
          base = ((payload[0] << 8) | payload[1]) << 16
          break
        case 0x03:
        case 0x05:
          // start address - не нужен для прошивки
          break
        default:
          throw new Error(`Intel HEX: неизвестный тип записи 0x${type.toString(16)}`)
      }
    }
    if (bytes.size === 0) {
      throw new Error('Intel HEX: в файле нет данных')
    }
    let maxAddr = 0
    bytes.forEach((_, a) => {
      if (a > maxAddr) {
        maxAddr = a
      }
    })
    const out = Buffer.alloc(maxAddr + 1, 0xff)
    bytes.forEach((b, a) => {
      out[a] = b
    })
    return out
  }
}
