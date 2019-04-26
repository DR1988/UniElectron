import { ValveLineType } from '../src/components/MainForm/MainFormInterfaces'

export default {
  start: 'START',
  makeChange: 'MAKE_CHANGE',
  pause: 'PAUSE',
  stop: 'STOP',
  rpmChange: 'rpmChange',
  connect: 'CONNECT',
  connected: 'CONNECTED',
  connectionError: 'CONNECTION_ERROR',
  serialClosed: 'SERIAL_CLOSED',
  serialSending: 'SERIAL_SENDING',
}

export interface startSignal {
  lineFormer: Array<ValveLineType>,
  allTime: number
}
