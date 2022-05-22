import {ChosenElement, ValveLineType, Change, TemporaryProtocolButtonPosition} from './MainFormInterfaces'
import {EditorState} from 'draft-js';

export interface MainFormState {
    chosenElement: ChosenElement,
    distance: number,
    time: number,
    allTime: number,
    showEditModal: boolean,
    lineFormer: Array<ValveLineType>,
    HVOpen: boolean,
    serialConnected: boolean,
    textEditorState: EditorState
    temporaryButtonNames: Record<TemporaryProtocolButtonPosition, string>
  }

export const resetedState: MainFormState = {
  chosenElement: {
    wrongSign: '',
    chosenLine: {
      name: 'ValveLine',
      id: 0,
      shortName: 'GV1',
      changes: [{ startTime: 0, endTime: 0, changeId: 0, duration: 0, crossingValueEnd: NaN, crossingValueStart: NaN }],
    },
    newStartTime: 0,
    newEndTime: 0,
    previousChanges: [{ startTime: 0, endTime: 0, changeId: 0, duration: 0, crossingValueEnd: NaN, crossingValueStart: NaN }],
    changeId: 0,
    newElement: false,
  },
  distance: 0,
  time: 0,
  showEditModal: false,
  allTime: 0,
  lineFormer: [
    {
      name: 'ValveLine',
      id: 0,
      shortName: 'GV1',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 1,
      shortName: 'GV2',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 2,
      shortName: 'GV3',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 3,
      shortName: 'GV4',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 4,
      shortName: 'GV5',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 5,
      shortName: 'GV6',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 6,
      shortName: 'HV1',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 7,
      shortName: 'HV2',
      changes: [],
    },
    {
      name: 'ValveLine',
      id: 8,
      shortName: 'HV2',
      changes: [],
    },
    {
      name: 'RPMSetter',
      shortName: 'RPM',
      id: 9,
      changes: [],
    },
    {
      name: 'TempSetter',
      shortName: 'TC',
      id: 10,
      changes: [],
    },
    {
      name: 'AUX',
      id: 11,
      shortName: 'AUX1',
      changes: [],
    },
    {
      name: 'AUX',
      id: 12,
      shortName: 'AUX2',
      changes: [],
    },
  ],
  HVOpen: false,
  serialConnected: false,
  textEditorState: EditorState.createEmpty(),
  temporaryButtonNames: {
    firstTemporaryButton: '',
    secondTemporaryButton: '',
    thirdTemporaryButton: ''
  }
}

export const initialState: MainFormState = {
  chosenElement: {
    chosenLine: {
      name: 'RPMSetter',
      id: 8,
      shortName: 'RPM',
      changes: [{
        startTime: 300,
        endTime: 350,
        value: 1000,
        changeId: 0,
        duration: 50,
        waitForValue: false,
        crossingValueEnd: NaN,
        crossingValueStart: NaN,
      }],
    },
    newStartTime: 0,
    newEndTime: 0,
    previousChanges: [],
    newElement: false,
    changeId: 0,
    wrongSign: '',
  },
  distance: 0,
  time: 0,
  showEditModal: false,
  allTime: 350,
  HVOpen: false,
  serialConnected: false,
  lineFormer: [
    {
      name: 'ValveLine',
      id: 0,
      shortName: 'GV1',
      changes: [
        { startTime: 20, endTime: 40, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 20, endTime: 80, changeId: 1, duration: 60, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 120, endTime: 240, changeId: 2, duration: 120, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 290, endTime: 340, changeId: 3, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN },
      ],
    },
    {
      name: 'ValveLine',
      id: 1,
      shortName: 'GV2',
      changes: [
        { startTime: 50, endTime: 70, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'ValveLine',
      id: 2,
      shortName: 'GV3',
      changes: [
        { startTime: 80, endTime: 100, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'ValveLine',
      id: 3,
      shortName: 'GV4',
      changes: [
        { startTime: 110, endTime: 130, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'ValveLine',
      id: 4,
      shortName: 'GV5',
      changes: [
        { startTime: 140, endTime: 160, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'ValveLine',
      id: 5,
      shortName: 'GV6',
      changes: [
        { startTime: 170, endTime: 190, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'ValveLine',
      id: 6,
      shortName: 'HV1',
      changes: [
        { startTime: 0, endTime: 15, changeId: 0, duration: 15, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 45, endTime: 60, changeId: 1, duration: 15, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 100, endTime: 120, changeId: 2, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 150, endTime: 160, changeId: 3, duration: 10, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 200, endTime: 215, changeId: 4, duration: 15, crossingValueEnd: NaN, crossingValueStart: NaN },

        // { startTime: 0, endTime: 20, changeId: 2, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 50, endTime: 60, changeId: 3, duration: 10, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 100, endTime: 115, changeId: 4, duration: 15, crossingValueEnd: NaN, crossingValueStart: NaN },
      ],
    },
    {
      name: 'ValveLine',
      id: 7,
      shortName: 'HV2',
      changes: [
        { startTime: 15, endTime: 35, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 60, endTime: 90, changeId: 1, duration: 30, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 125, endTime: 145, changeId: 2, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 150, endTime: 190, changeId: 3, duration: 40, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 220, endTime: 245, changeId: 4, duration: 25, crossingValueEnd: NaN, crossingValueStart: NaN },

        // { startTime: 25, endTime: 45, changeId: 2, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 50, endTime: 90, changeId: 3, duration: 40, crossingValueEnd: NaN, crossingValueStart: NaN },
        // { startTime: 120, endTime: 145, changeId: 4, duration: 25, crossingValueEnd: NaN, crossingValueStart: NaN },
      ],
    },
    {
      name: 'ValveLine',
      id: 8,
      shortName: 'HV3',
      changes: [
        { startTime: 35, endTime: 55, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 120, endTime: 190, changeId: 1, duration: 70, crossingValueEnd: NaN, crossingValueStart: NaN },
        { startTime: 225, endTime: 245, changeId: 2, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
      ],
    },
    {
      name: 'RPMSetter',
      shortName: 'RPM',
      id: 9,
      changes: [
        {
          startTime: 0,
          endTime: 50,
          value: 500,
          changeId: 0,
          duration: 50,
          waitForValue: false,
          crossingValueEnd: NaN,
          crossingValueStart: NaN,
        },
        {
          startTime: 70,
          endTime: 90,
          value: 400,
          changeId: 1,
          duration: 20,
          waitForValue: false,
          crossingValueEnd: NaN,
          crossingValueStart: NaN,
        },
        {
          startTime: 100,
          endTime: 150,
          value: 300,
          changeId: 2,
          duration: 50,
          waitForValue: false,
          crossingValueEnd: NaN,
          crossingValueStart: NaN,
        },
        {
          startTime: 200,
          endTime: 250,
          value: 500,
          changeId: 3,
          duration: 50,
          waitForValue: false,
          crossingValueEnd: NaN,
          crossingValueStart: NaN,
        },
        {
          startTime: 300,
          endTime: 350,
          value: 600,
          changeId: 4,
          duration: 50,
          waitForValue: false,
          crossingValueEnd: NaN,
          crossingValueStart: NaN,
        },
      ],
    },
    {
      name: 'TempSetter',
      shortName: 'TC',
      id: 10,
      changes: [
        { startTime: 0, endTime: 30, value: 32, changeId: 0, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
        { startTime: 50, endTime: 80, value: 34, changeId: 1, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
        { startTime: 150, endTime: 200, value: 36, changeId: 2, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
      ],
    },
    {
      name: 'AUX',
      id: 11,
      shortName: 'AUX1',
      changes: [
        { startTime: 20, endTime: 30, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
    {
      name: 'AUX',
      id: 12,
      shortName: 'AUX2',
      changes: [
        { startTime: 10, endTime: 40, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
      ],
    },
  ],
  textEditorState: EditorState.createEmpty(),
  temporaryButtonNames: {
    firstTemporaryButton: '',
    secondTemporaryButton: '',
    thirdTemporaryButton: ''
  }
}
