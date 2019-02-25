import React, { Component } from 'react'

import s from './MainForm.scss'
import { ChosenElement, ValveLineType } from './MainFormInterfaces'
import MainFormComponent from './MainFormComponent/MainFormComponent'

interface Props {
  socket: SocketIOClient.Socket
}

interface State {
  chosenElement: ChosenElement,
  distance: number,
  time: number,
  allTime: number,
  showEditModal: boolean,
  lineFormer: Array<ValveLineType>,
}

class MainForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.initialState = {
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
          name: 'RPMSetter',
          shortName: 'RPM',
          id: 8,
          changes: [],
        },
        {
          name: 'TempSetter',
          shortName: 'T°C',
          id: 9,
          changes: [],
        },
      ],
    }

    this.state = {
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
            waitForValue: true,
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
      lineFormer: [
        {
          name: 'ValveLine',
          id: 0,
          shortName: 'GV1',
          changes: [
            { startTime: 0, endTime: 10, changeId: 0, duration: 10, crossingValueEnd: NaN, crossingValueStart: NaN },
            { startTime: 20, endTime: 80, changeId: 1, duration: 60, crossingValueEnd: NaN, crossingValueStart: NaN },
            { startTime: 120, endTime: 240, changeId: 2, duration: 120, crossingValueEnd: NaN, crossingValueStart: NaN },
            { startTime: 290, endTime: 340, changeId: 3, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN },
          ],
        },
        {
          name: 'ValveLine',
          id: 1,
          shortName: 'GV2',
          changes: [{ startTime: 30, endTime: 50, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }],
        },
        {
          name: 'ValveLine',
          id: 2,
          shortName: 'GV3',
          changes: [{ startTime: 0, endTime: 10, changeId: 0, duration: 10, crossingValueEnd: NaN, crossingValueStart: NaN }],
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
          changes: [{ startTime: 0, endTime: 100, changeId: 0, duration: 100, crossingValueEnd: NaN, crossingValueStart: NaN }],
        },
        {
          name: 'ValveLine',
          id: 7,
          shortName: 'HV2',
          changes: [{ startTime: 0, endTime: 100, changeId: 0, duration: 100, crossingValueEnd: NaN, crossingValueStart: NaN }],
        },
        {
          name: 'RPMSetter',
          shortName: 'RPM',
          id: 8,
          changes: [
            {
              startTime: 0,
              endTime: 50,
              value: 500,
              changeId: 0,
              duration: 50,
              waitForValue: true,
              crossingValueEnd: NaN,
              crossingValueStart: NaN,
            },
            {
              startTime: 100,
              endTime: 150,
              value: 2000,
              changeId: 1,
              duration: 50,
              waitForValue: true,
              crossingValueEnd: NaN,
              crossingValueStart: NaN,
            },
            {
              startTime: 200,
              endTime: 250,
              value: 1500,
              changeId: 2,
              duration: 50,
              waitForValue: true,
              crossingValueEnd: NaN,
              crossingValueStart: NaN,
            },
            {
              startTime: 300,
              endTime: 350,
              value: 1000,
              changeId: 3,
              duration: 50,
              waitForValue: true,
              crossingValueEnd: NaN,
              crossingValueStart: NaN,
            },
          ],
        },
        {
          name: 'TempSetter',
          shortName: 'T°C',
          id: 9,
          changes: [{ startTime: 300, endTime: 350, value: 45, changeId: 0, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN }],
        },
      ],
    }
  }

  initialState: State

  resetState = () => {
    this.setState({
      ...this.initialState,
    })
  }
  
  start = () => { }
  pause = () => { }
  stop = () => { }
  showModal = () => {
    console.log('show modal')
  }
  addNewValveTime = () => { }
  setChosenValveTime = () => { }

  render() {
    return (
      <div
        id="form-Manupalation"
        className={s.root}
      >
        <MainFormComponent
          resetState={this.resetState}
          start={this.start}
          pause={this.pause}
          stop={this.stop}
          showModal={this.showModal}
          addNewValveTime={this.addNewValveTime}
          setChosenValveTime={this.setChosenValveTime}
          {...this.state}
        />
      </div>
    )
  }
}


export default MainForm
