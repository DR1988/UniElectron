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
  serial_closed: 'SERIAL_CLOSED',
}

export interface startSignal {
  lineFormer: Array<ValveLineType>,
  allTime: number
}
