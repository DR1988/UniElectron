import { ValveLineType } from '../src/components/MainForm/MainFormInterfaces'

const Errors = {
  thermoStatInitError: 'THERMO_STAT_INIT_ERROR',
  connectionError: 'CONNECTION_ERROR',
}

const socketConfig = {
  ...Errors,
  start: 'START',
  makeChange: 'MAKE_CHANGE',
  pause: 'PAUSE',
  stop: 'STOP',
  rpmChange: 'rpmChange',
  tempChange: 'tempChange',
  connect: 'CONNECT',
  connected: 'CONNECTED',
  serialClosed: 'SERIAL_CLOSED',
  serialSending: 'SERIAL_SENDING',
  switchHV: 'SWITCH_HV',
}

export interface startSignal {
  lineFormer: Array<ValveLineType>,
  allTime: number
}

export default socketConfig

