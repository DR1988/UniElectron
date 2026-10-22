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
  searchingSerial: 'SEARCHING_SERIAL',
  serialClosed: 'SERIAL_CLOSED',
  serialSending: 'SERIAL_SENDING',
  switchHV: 'SWITCH_HV',
  protocolFinish: 'protocolFinish',
  setRPMValue: 'SET_RPM_VALUE',
  switchValves: 'SWITCH_VALVES',
  checkValves: 'CHECK_VALVES',
  setThermostatCheck: 'SET_THERMOSTAT_CHECK',
  valveAction: 'VALVE_ACTION',
  flashFirmware: 'FLASH_FIRMWARE',
  flashProgress: 'FLASH_PROGRESS',
  flashError: 'FLASH_ERROR',
}

export interface startSignal {
  lineFormer: Array<ValveLineType>,
  allTime: number
}

export default socketConfig

