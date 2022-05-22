import {RawDraftContentState} from 'draft-js';

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
  name: 'ValveLine' | 'RPMSetter' | 'TempSetter' | `NewValveLine` | 'NewRPMSetter' | 'NewTempSetter' | 'AUX'| 'NewAUX',
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

export type TemporaryProtocolButtonPosition = 'firstTemporaryButton' | 'secondTemporaryButton' | 'thirdTemporaryButton'

export type TemporaryFileLoaded = {
  temporaryButtons: {
    buttonPosition: TemporaryProtocolButtonPosition
    name: string
  },
  protocol: {
    lineFormer: Array<ValveLineType>,
    allTime: number
    editorState: RawDraftContentState,
  }
}
