export interface Change {
  startTime: number,
  endTime: number,
  changeId: number | string,
  duration: number,
  waitForValue?: boolean,
  value?: number,
  crossingValueStart?: number,
  crossingValueEnd?: number,
  idname?: string,
}

export interface ValveLineType {
  name: 'ValveLine' | 'RPMSetter' | 'TempSetter' | `NewValveLine` | 'NewRPMSetter' | 'NewTempSetter',
  // name: string,
  id: number,
  shortName: string,
  changes: Array<Change>,
}

export interface ChosenElement {
  chosenLine: ValveLineType,
  previousChanges: Array<Change>,
  changeId: number | string,
  newElement: boolean,
  wrongSign: string,
  newStartTime: number,
  newEndTime: number,
  newRPMValue?: number,
  newTempValue?: number,
}
