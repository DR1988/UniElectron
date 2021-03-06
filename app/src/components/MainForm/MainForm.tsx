import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { ipcRenderer } from 'electron'

import s from './MainForm.css'
import { ChosenElement, ValveLineType, Change } from './MainFormInterfaces'
import MainFormComponent from './MainFormComponent/MainFormComponent'

import Modal, { Props as modalProps } from '../Modal'
import ValveLineModal from '../Modal/ValveLineModal'
import NewValveLineModal from '../Modal/NewValveLineModal'
import RMPModal from '../Modal/RMPModal'
import NewRMPModal from '../Modal/NewRMPModal'
import NewTempModal from '../Modal/NewTempModal'
import TempModal from '../Modal/TempModal'

import socketConfig, { startSignal } from '../../../config/socket.config'
import { withCondition } from '../HOC'

const ModalWithCondition = withCondition((props: modalProps) => <Modal {...props} />)

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
  HVOpen: boolean,
  serialConnected: boolean,
}

class MainForm extends Component<Props, State> {

  svgPageX: number

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
          shortName: 'TC',
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
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN },
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
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
          ],
        },
        {
          name: 'ValveLine',
          id: 2,
          shortName: 'GV3',
          changes: [
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
          ],
        },
        {
          name: 'ValveLine',
          id: 3,
          shortName: 'GV4',
          changes: [
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
          ],
        },
        {
          name: 'ValveLine',
          id: 4,
          shortName: 'GV5',
          changes: [
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
          ],
        },
        {
          name: 'ValveLine',
          id: 5,
          shortName: 'GV6',
          changes: [
            { startTime: 150, endTime: 170, changeId: 0, duration: 20, crossingValueEnd: NaN, crossingValueStart: NaN }
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
          id: 9,
          changes: [
            { startTime: 50, endTime: 100, value: 32, changeId: 0, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
            { startTime: 100, endTime: 150, value: 34, changeId: 1, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
            { startTime: 150, endTime: 200, value: 36, changeId: 2, duration: 50, crossingValueEnd: NaN, crossingValueStart: NaN, waitForValue: false },
          ],
        },
      ],
    }
  }

  componentDidMount() {
    const { lineFormer, allTime } = this.state
    // const StartSignal: startSignal = {
    //   lineFormer,
    //   allTime,
    // }
    // this.props.socket.emit(socketConfig.start, StartSignal)
    this.props.socket.on(socketConfig.makeChange, (data) => {
      // console.log('data', data)
      if (this.state.showEditModal) {
        this.setState({
          ...data,
          showEditModal: true,
        })
      } else {
        this.setState({
          ...data,
        })
      }
    })
    this.props.socket.on(socketConfig.start, (data, s) => {
      // console.log(data)
      console.log('--------start---------', new Date())
      // console.log('ssssss', s)
      const { distance, time } = data
      // console.log('start time, distance', time, distance)
      this.setState({
        distance,
        time,
      })
    })
    this.props.socket.on(socketConfig.pause, (data) => {
      console.log('--------pause---------', new Date())
      console.log(Date.now())
      // console.log('data', data)
      const { time, distance, allTime } = this.state
      // console.log('time distance', time, distance)
      // console.log('distance', 100 * data.currentTime / time)
      this.setState({
        distance: 100 * data.currentTime / allTime,
        time: 0,
      })
    })
    this.props.socket.on(socketConfig.stop, (data) => {
      const { distance, time } = data
      this.setState({
        distance,
        time,
      })
    })

    this.props.socket.on(socketConfig.connected, (data: boolean) => {
      this.setState({
        serialConnected: data,
      })
    })

    ipcRenderer.on('file-loaded', (event, data: {
      lineFormer: Array<ValveLineType>,
      allTime: number
    }) => {
      this.setState({
        lineFormer: data.lineFormer,
        allTime: data.allTime
      })
    })
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners()
  }

  initialState: State

  resetState = () => {
    this.setState({
      ...this.initialState,
    })
  }

  start = () => {
    const { lineFormer, allTime } = this.state
    const StartSignal: startSignal = {
      lineFormer,
      allTime,
    }
    this.props.socket.emit(socketConfig.start, StartSignal)
  }

  pause = () => this.props.socket.emit(socketConfig.pause)

  connect = () => this.props.socket.emit(socketConfig.connect)

  stop = () => {
    console.log('stop')
    this.props.socket.emit(socketConfig.stop)
    // this.props.socket.emit('INC')
  }

  showModal = () => {
    console.log(this.state.chosenElement.chosenLine.name)
    console.log(this.state.showEditModal)
    if (!this.state.showEditModal) {
      this.setState({
        ...this.state,
        showEditModal: true,
      })
    }
  }

  addNewValveTime = (chosenLine: ValveLineType): void => {
    this.setState({
      chosenElement: {
        ...this.state.chosenElement,
        chosenLine: {
          ...chosenLine,
          name: `New${chosenLine.name}` as ValveLineType['name'],
        },
        newEndTime: 0,
        newStartTime: 0,
        newRPMValue: 0,
        newTempValue: 0,
        changeId: Math.random(), // shortid.generate(),
        newElement: true,
        previousChanges: [...chosenLine.changes],
      },
    })
  }

  emitChanges = () => {
    console.log('emit changes')
  }

  setChosenValveTime = (lineID: number, changeId: number): void => {
    const chosenLine: ValveLineType = this.state.lineFormer.filter(line => line.id === lineID)[0]
    // console.log('chosenLine.changes', chosenLine)
    const chosenElement = {
      ...this.state.chosenElement,
      chosenLine,
      changeId,
      newElement: false,
      previousChanges: [...chosenLine.changes],
    }
    this.setState({
      chosenElement,
    })
  }

  removeValveTime = () => {
    const { chosenElement, lineFormer } = this.state
    const { chosenLine, changeId } = chosenElement

    const changes = chosenLine.changes.filter(change => change.changeId !== changeId)
    const newChosenElement = {
      ...chosenElement,
      chosenLine: {
        ...chosenLine,
        changes,
      },
    }

    const newlineFormer = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes = changes
    const newState = {
      ...this.state,
      lineFormer: newlineFormer,
      showEditModal: false,
      chosenElement: newChosenElement,
    }
    // this.props.socket.emit(socketConfig.makeChange, newState)
    this.setState({ ...newState })
  }

  closeModal = () => {
    this.setState({
      showEditModal: false,
      chosenElement: {
        ...this.state.chosenElement,
        wrongSign: '',
      },
    }, () => this.emitChanges())
  }

  changeEndTime = (value: number): void => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine, previousChanges } = chosenElement

    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    const startTime = lineFormer[chosenLine.id].changes[index].startTime

    const newlineFormer = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes[index].endTime = value
    newlineFormer[chosenLine.id].changes[index].duration = startTime - value
    const newChosenLine: ValveLineType = cloneDeep(chosenLine)
    newChosenLine.changes[index].endTime = value
    newChosenLine.changes[index].duration = startTime - value

    if (newChosenLine.changes[index + 1]) {
      let wrongSign = ''
      if (newChosenLine.changes[index + 1].startTime <= value) {
        newlineFormer[chosenLine.id].changes[index].crossingValueEnd = newChosenLine.changes[index + 1].startTime - value
        newChosenLine.changes[index].crossingValueEnd = newChosenLine.changes[index + 1].startTime - value
        wrongSign = 'your changed value crossing next valve open time'
      } else if (chosenLine.changes[index + 1].startTime > value) {
        newChosenLine.changes[index].crossingValueEnd = NaN
        newlineFormer[chosenLine.id].changes[index].crossingValueEnd = NaN
        wrongSign = ''
      }
      const newState = {
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          wrongSign,
          chosenLine: newChosenLine,
        },
      }
      this.setState(newState)
      return
    }

    const maxTime = Math.max(...newlineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))
    const allTime = value > maxTime ? value : maxTime

    this.setState({
      ...this.state,
      lineFormer: newlineFormer,
      allTime,
      chosenElement: {
        ...this.state.chosenElement,
        chosenLine: newChosenLine,
      },
    })
  }

  changeStartTime = (value: number): void => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement

    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    const endTime = lineFormer[chosenLine.id].changes[index].endTime

    const newlineFormer = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes[index].startTime = value
    newlineFormer[chosenLine.id].changes[index].duration = endTime - value
    const newChosenLine: ValveLineType = cloneDeep(chosenLine)
    newChosenLine.changes[index].startTime = value
    newChosenLine.changes[index].duration = endTime - value

    if (newChosenLine.changes[index - 1]) {
      let wrongSign = ''
      if (newChosenLine.changes[index - 1].endTime >= value) {
        newlineFormer[chosenLine.id].changes[index].crossingValueStart = newChosenLine.changes[index - 1].endTime - value
        newChosenLine.changes[index].crossingValueStart = newChosenLine.changes[index - 1].endTime - value
        wrongSign = 'your changed value crossing previous valve open time'
      } else if (chosenLine.changes[index - 1].endTime < value) {
        newChosenLine.changes[index].crossingValueStart = NaN
        newlineFormer[chosenLine.id].changes[index].crossingValueStart = NaN
        wrongSign = ''
      }
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          wrongSign,
          chosenLine: newChosenLine,
        },
      })
      return
    }
    this.setState({
      ...this.state,
      lineFormer: newlineFormer,
      chosenElement: {
        ...this.state.chosenElement,
        chosenLine: newChosenLine,
      },
    })
  }

  resetToPreviousChanges = () => {
    const { chosenElement, lineFormer } = this.state
    const { chosenLine } = chosenElement

    const newlineFormer: Array<ValveLineType> = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes = [...chosenElement.previousChanges]
    const maxTime = Math.max(...newlineFormer.map((lines) => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))
    this.setState({
      ...this.state,
      lineFormer: newlineFormer,
      allTime: maxTime,
    })
  }

  insertItem = (array: Array<Change>, index: number, change: Change): Array<Change> => {
    const newArray = array.slice()
    newArray.splice(index, 0, {
      startTime: change.startTime,
      endTime: change.endTime,
      changeId: change.changeId,
      duration: change.duration,
      crossingValueEnd: NaN,
      crossingValueStart: NaN,
    })
    return newArray
  }

  changeNewStartTime = (newStartTime: number): void => {
    const { chosenElement, lineFormer } = this.state
    const { chosenLine, previousChanges, newEndTime, changeId } = chosenElement
    const { changes } = chosenLine
    if (!previousChanges.length) {
      const currentItemIndex = 0
      const filteredChange = changes.filter(change => change.changeId !== changeId)
      const newChanges =
        this.insertItem(filteredChange, currentItemIndex,
          {
            startTime: newStartTime,
            endTime: newEndTime,
            changeId,
            duration: newEndTime - newStartTime,
          })
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes = newChanges
      newlineFormer[chosenLine.id].changes[currentItemIndex].duration = newEndTime - newStartTime
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes = newChanges
      newChosenLine.changes[currentItemIndex].duration = newEndTime - newStartTime
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...chosenElement,
          chosenLine: newChosenLine,
          newStartTime,
        },
      })
      return
    }
    let currentItemIndex = previousChanges.length
    if (newEndTime <= changes[previousChanges.length - 1].endTime) {
      for (let i = 0; i < previousChanges.length; i += 1) {
        if (newEndTime <= previousChanges[i].endTime) {
          currentItemIndex = i
          const filteredChange = changes.filter(change => change.changeId !== changeId)
          const newChanges =
            this.insertItem(filteredChange, currentItemIndex,
              {
                startTime: newStartTime,
                endTime: newEndTime,
                changeId,
                duration: newEndTime - newStartTime,
              })

          const newlineFormer = cloneDeep(lineFormer)
          newlineFormer[chosenLine.id].changes = newChanges
          newlineFormer[chosenLine.id].changes[currentItemIndex].duration = newEndTime - newStartTime
          const newChosenLine: ValveLineType = cloneDeep(chosenLine)
          newChosenLine.changes = newChanges
          newChosenLine.changes[currentItemIndex].duration = newEndTime - newStartTime

          let wrongSign = ''
          if (newChosenLine.changes[currentItemIndex + 1].startTime <= newEndTime) {
            newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueEnd = newChosenLine.changes[currentItemIndex + 1].startTime - newEndTime
            newChosenLine.changes[currentItemIndex].crossingValueEnd = newChosenLine.changes[currentItemIndex + 1].startTime - newEndTime
            wrongSign = 'your changed value crossing next valve open time'
          } else if (newChosenLine.changes[currentItemIndex + 1].startTime > newEndTime) {
            newChosenLine.changes[currentItemIndex].crossingValueEnd = NaN
            newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueEnd = NaN
          }

          const maxTime = Math.max(...newlineFormer.map((lines) => {
            if (lines.changes.length) {
              return lines.changes[lines.changes.length - 1].endTime
            }
            return 0
          }))
          const allTime = newEndTime > maxTime ? newEndTime : maxTime
          this.setState({
            ...this.state,
            lineFormer: newlineFormer,
            allTime,
            chosenElement: {
              ...chosenElement,
              chosenLine: newChosenLine,
              wrongSign,
              newStartTime,
            },
          })
          return
        }
      }
    }
  }

  changeNewEndTime = (newEndTime: number): void => {
    const { chosenElement, lineFormer } = this.state
    const { chosenLine, previousChanges, newStartTime, changeId } = chosenElement
    const { changes } = chosenLine
    if (!previousChanges.length) {
      const currentItemIndex = 0
      const filteredChange = changes.filter(change => change.changeId !== changeId)
      const newChanges =
        this.insertItem(filteredChange, currentItemIndex,
          {
            startTime: newStartTime,
            endTime: newEndTime,
            changeId,
            duration: newEndTime - newStartTime,
          })
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes = newChanges
      newlineFormer[chosenLine.id].changes[currentItemIndex].duration = newEndTime - newStartTime
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes = newChanges
      newChosenLine.changes[currentItemIndex].duration = newEndTime - newStartTime
      const maxTime = Math.max(...newlineFormer.map((lines) => {
        if (lines.changes.length) {
          return lines.changes[lines.changes.length - 1].endTime
        }
        return 0
      }))
      const allTime = newEndTime > maxTime ? newEndTime : maxTime

      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        allTime,
        chosenElement: {
          ...chosenElement,
          chosenLine: newChosenLine,
          newEndTime,
        },
      })
      return
    }

    let currentItemIndex = previousChanges.length
    if (newStartTime <= changes[previousChanges.length - 1].startTime) {
      for (let i = 0; i < previousChanges.length; i += 1) {
        if (newStartTime <= previousChanges[i].startTime) {
          currentItemIndex = i
          const filteredChange = changes.filter(change => change.changeId !== changeId)
          const newChanges =
            this.insertItem(filteredChange, currentItemIndex,
              {
                startTime: newStartTime,
                endTime: newEndTime,
                changeId,
                duration: newEndTime - newStartTime,
              })

          const newlineFormer = cloneDeep(lineFormer)
          newlineFormer[chosenLine.id].changes = newChanges
          newlineFormer[chosenLine.id].changes[currentItemIndex].duration = newEndTime - newStartTime
          const newChosenLine: ValveLineType = cloneDeep(chosenLine)
          newChosenLine.changes = newChanges
          newChosenLine.changes[currentItemIndex].duration = newEndTime - newStartTime

          let wrongSign = ''
          if (newChosenLine.changes[currentItemIndex + 1].startTime <= newEndTime) {
            newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueEnd = newChosenLine.changes[currentItemIndex + 1].startTime - newEndTime
            newChosenLine.changes[currentItemIndex].crossingValueEnd = newChosenLine.changes[currentItemIndex + 1].startTime - newEndTime
            wrongSign = 'your changed value crossing next valve open time'
          } else if (newChosenLine.changes[currentItemIndex + 1].startTime > newEndTime) {
            newChosenLine.changes[currentItemIndex].crossingValueEnd = NaN
            newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueEnd = NaN
          }

          const maxTime = Math.max(...newlineFormer.map((lines) => {
            if (lines.changes.length) {
              return lines.changes[lines.changes.length - 1].endTime
            }
            return 0
          }))
          const allTime = newEndTime > maxTime ? newEndTime : maxTime
          this.setState({
            ...this.state,
            lineFormer: newlineFormer,
            allTime,
            chosenElement: {
              ...chosenElement,
              chosenLine: newChosenLine,
              wrongSign,
              newEndTime,
            },
          })
          return
        }
      }
    }
    const filteredChange = changes.filter(change => change.changeId !== changeId)
    const newChanges =
      this.insertItem(filteredChange, currentItemIndex,
        {
          startTime: newStartTime,
          endTime: newEndTime,
          changeId,
          duration: newEndTime - newStartTime,
        })

    const newlineFormer = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes = newChanges
    newlineFormer[chosenLine.id].changes[currentItemIndex].duration = newEndTime - newStartTime
    const newChosenLine: ValveLineType = cloneDeep(chosenLine)
    newChosenLine.changes = newChanges
    newChosenLine.changes[currentItemIndex].duration = newStartTime - newEndTime
    let wrongSign = ''
    if (newChosenLine.changes[currentItemIndex - 1].endTime >= newStartTime) {
      newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueStart =
        newChosenLine.changes[currentItemIndex - 1].endTime - newStartTime
      newChosenLine.changes[currentItemIndex].crossingValueStart =
        newChosenLine.changes[currentItemIndex - 1].endTime - newStartTime
      wrongSign = 'your changed value crossing next valve open time'
    } else if (newChosenLine.changes[currentItemIndex - 1].endTime < newStartTime) {
      newChosenLine.changes[currentItemIndex].crossingValueStart = NaN
      newlineFormer[chosenLine.id].changes[currentItemIndex].crossingValueStart = NaN
    }
    const maxTime = Math.max(...newlineFormer.map((lines) => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))
    const allTime = newEndTime > maxTime ? newEndTime : maxTime

    this.setState({
      ...this.state,
      lineFormer: newlineFormer,
      allTime,
      chosenElement: {
        ...chosenElement,
        wrongSign,
        chosenLine: newChosenLine,
        newEndTime,
      },
    })
  }

  changeRPMValue = (RPMValue: number) => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)

    if (RPMValue >= 0) {
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes[index].value = RPMValue
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes[index].value = RPMValue
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          chosenLine: newChosenLine,
        },
      })
    }
  }

  changeTempValue = (TempValue: number) => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)

    if (TempValue >= 0) {
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes[index].value = TempValue
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes[index].value = TempValue
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          chosenLine: newChosenLine,
        },
      })
    }
  }

  changeNewRPMValue = (RPMValue: number) => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    if (RPMValue >= 0) {
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes[index].value = RPMValue
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes[index].value = RPMValue
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          newRPMValue: RPMValue,
          chosenLine: newChosenLine,
        },
      })
    }
  }

  changeNewTempValue = (TempValue: number) => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    if (TempValue >= 0) {
      const newlineFormer = cloneDeep(lineFormer)
      newlineFormer[chosenLine.id].changes[index].value = TempValue
      const newChosenLine: ValveLineType = cloneDeep(chosenLine)
      newChosenLine.changes[index].value = TempValue
      this.setState({
        ...this.state,
        lineFormer: newlineFormer,
        chosenElement: {
          ...this.state.chosenElement,
          newTempValue: TempValue,
          chosenLine: newChosenLine,
        },
      })
    }
  }

  changeWaitForValue = () => {
    const { chosenElement, lineFormer } = this.state
    const { changeId, chosenLine } = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    const newlineFormer = cloneDeep(lineFormer)
    const { waitForValue } = newlineFormer[chosenLine.id].changes[index]
    newlineFormer[chosenLine.id].changes[index].waitForValue = !waitForValue
    const newChosenLine: ValveLineType = cloneDeep(chosenLine)
    newChosenLine.changes[index].waitForValue = !waitForValue
    this.setState({
      ...this.state,
      lineFormer: newlineFormer,
      chosenElement: {
        ...this.state.chosenElement,
        chosenLine: newChosenLine,
      },
    })
  }

  switchHV = () => {
    console.log(this.state.HVOpen)
    this.props.socket.emit(socketConfig.switchHV, this.state.HVOpen)
    this.setState({
      HVOpen: !this.state.HVOpen,
    })
  }

  downloadProtocol = (path: string) => {
    ipcRenderer.send('download-button', {
      path,
      data: {
        lineFormer: this.state.lineFormer,
        allTime: this.state.allTime
      }
    })
  }

  uploadProtocol = (path: string) => {
    console.log('path', path)
    ipcRenderer.send('load-button', {
      path
    })
  }

  render() {
    const { showEditModal, chosenElement } = this.state
    // console.log(chosenElement.chosenLine.name === 'NewValveLine')
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
          connect={this.connect}
          showModal={this.showModal}
          addNewValveTime={this.addNewValveTime}
          setChosenValveTime={this.setChosenValveTime}
          socket={this.props.socket}
          switchHV={this.switchHV}
          downloadProtocol={this.downloadProtocol}
          uploadProtocol={this.uploadProtocol}
          {...this.state}
        />
        <ModalWithCondition
          condition={showEditModal}
          closeModal={this.closeModal}
          // coordinate={this.modalCoordinates}
          render={() => {
            switch (chosenElement.chosenLine.name) {
              case 'ValveLine':
                return (<ValveLineModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeStartTime}
                  changeEndTime={this.changeEndTime}
                />)
              case 'NewValveLine':
                return (<NewValveLineModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeNewStartTime}
                  changeEndTime={this.changeNewEndTime}
                />)
              case 'RPMSetter':
                return (<RMPModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeStartTime}
                  changeEndTime={this.changeEndTime}
                  changeRPMValue={this.changeRPMValue}
                  changeWaitForValue={this.changeWaitForValue}
                />)
              case 'NewRPMSetter':
                return (<NewRMPModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeNewStartTime}
                  changeEndTime={this.changeNewEndTime}
                  changeRPMValue={this.changeNewRPMValue}
                />)
              case 'TempSetter':
                return (<TempModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeStartTime}
                  changeEndTime={this.changeEndTime}
                  changeTempValue={this.changeTempValue}
                />)
              case 'NewTempSetter':
                return (<NewTempModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeNewStartTime}
                  changeEndTime={this.changeNewEndTime}
                  changeTempValue={this.changeNewTempValue}
                />)
              default: return <div>asd</div>
            }
          }}
        />
      </div>
    )
  }
}

export default MainForm
