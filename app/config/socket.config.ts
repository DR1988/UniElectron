import { ValveLineType } from '../src/components/MainForm/MainFormInterfaces'

export default {
  start: 'START',
  makeChange: 'MAKE_CHANGE',
  pause: 'PAUSE',
  stop: 'STOP',
  rpmChange: 'rpmChange',
}

export interface startSignal {
  lineFormer: Array<ValveLineType>,
  allTime: number
}
