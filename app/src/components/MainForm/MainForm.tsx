import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {ipcRenderer} from 'electron'

import s from './MainForm.css'
import {
  ValveLineType,
  Change,
  TemporaryFileLoaded,
  TemporaryProtocolButtonPosition,
  ShortNames
} from './MainFormInterfaces'
import MainFormComponent from './MainFormComponent/MainFormComponent'
import {MainFormState, resetedState, initialState} from './initialConfig'

import Modal, {Props as modalProps} from '../Modal'
import ValveLineModal from '../Modal/ValveLineModal'
import NewValveLineModal from '../Modal/NewValveLineModal'
import RMPModal from '../Modal/RMPModal'
import NewRMPModal from '../Modal/NewRMPModal'
import NewTempModal from '../Modal/NewTempModal'
import TempModal from '../Modal/TempModal'
import {InsertSpaceModal} from '../Modal/InsertSpaceModal/InsertSpaceModal'

import socketConfig, {startSignal} from '../../../config/socket.config'
import {withCondition} from '../HOC'
import {convertFromRaw, convertToRaw, EditorState, RawDraftContentState} from 'draft-js';
import SearchingBoardModal from '../Modal/SearchingBoardModal/SearchingBoardModal';
import {RemoveSpaceModal} from '../Modal/RemoveSpaceModal/RemoveSpaceModal'
import {ManualControlModal} from '../Modal/ManualControlModal/ManulaControlModal'
import {RemoveSpaceOption} from '../CommonTypes';

const ModalWithCondition = withCondition((props: modalProps) => <Modal {...props} />)

interface Props {
  socket: SocketIOClient.Socket
}

class MainForm extends Component<Props, MainFormState> {

  svgPageX: number

  constructor(props: Props) {
    super(props)
    this.resetedState = resetedState
    this.state = initialState
  }

  componentDidMount() {
    const {lineFormer, allTime} = this.state
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
      const {distance, time} = data
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
      const {time, distance, allTime} = this.state
      // console.log('time distance', time, distance)
      // console.log('distance', 100 * data.currentTime / time)
      this.setState({
        distance: 100 * data.currentTime / allTime,
        time: 0,
      })
    })

    this.props.socket.on(socketConfig.stop, (data) => {
      const {distance, time} = data
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

    this.props.socket.on(socketConfig.searchingSerial, (data: boolean) => {
      this.setState({
        searchingSerial: data,
      })
    })

    ipcRenderer.on('file-loaded', (event, data: {
      lineFormer: Array<ValveLineType>,
      allTime: number
      editorState: RawDraftContentState,
    }) => {
      this.setState({
        lineFormer: data.lineFormer,
        allTime: data.allTime,
        textEditorState: EditorState.createWithContent(convertFromRaw(data.editorState)),
      })
    })

    ipcRenderer.on('temporary-file-loaded', (event, data: TemporaryFileLoaded) => {
      const {protocol, temporaryButtons} = data

      window.localStorage.setItem(temporaryButtons.buttonPosition, JSON.stringify({
        temporaryButtons: {
          buttonPosition: temporaryButtons.buttonPosition,
          name: temporaryButtons.name
        },
        protocol: {
          lineFormer: protocol.lineFormer,
          allTime: protocol.allTime,
          textEditorState: protocol.editorState
        },
      }))

      this.setState({
        lineFormer: protocol.lineFormer,
        allTime: protocol.allTime,
        textEditorState: EditorState.createWithContent(convertFromRaw(protocol.editorState)),
        temporaryButtonNames: {
          ...this.state.temporaryButtonNames,
          [temporaryButtons.buttonPosition]: temporaryButtons.name
        }
      })
    })

    this.getFromLocalStorage()

    this.props.socket.on(socketConfig.protocolFinish, () => {
      this.setState({
        ...this.state,
        disableStart: false,
      })
    })
  }

  getFromLocalStorage = () => {
    const firstTemporaryButtonData = JSON.parse(window.localStorage.getItem('firstTemporaryButton'))
    const secondTemporaryButtonData = JSON.parse(window.localStorage.getItem('secondTemporaryButton'))
    const thirdTemporaryButtonData = JSON.parse(window.localStorage.getItem('thirdTemporaryButton'))
    const fourthTemporaryButtonData = JSON.parse(window.localStorage.getItem('fourthTemporaryButton'))
    const fifthTemporaryButtonData = JSON.parse(window.localStorage.getItem('fifthTemporaryButton'))
    const sixthTemporaryButtonData = JSON.parse(window.localStorage.getItem('sixthTemporaryButton'))
    const seventhTemporaryButtonData = JSON.parse(window.localStorage.getItem('seventhTemporaryButton'))
    const eigthTemporaryButtonData = JSON.parse(window.localStorage.getItem('eigthTemporaryButton'))

    this.setLocalStorageData(firstTemporaryButtonData)
    this.setLocalStorageData(secondTemporaryButtonData)
    this.setLocalStorageData(thirdTemporaryButtonData)
    this.setLocalStorageData(fourthTemporaryButtonData)
    this.setLocalStorageData(fifthTemporaryButtonData)
    this.setLocalStorageData(sixthTemporaryButtonData)
    this.setLocalStorageData(seventhTemporaryButtonData)
    this.setLocalStorageData(eigthTemporaryButtonData)
  }

  setLocalStorageData = (data: TemporaryFileLoaded) => {
    if (data) {
      console.log('buttonPosition', data.temporaryButtons.buttonPosition)
      setTimeout(() => {
        // setTimeout - хак чтобы установить все значения в стейт для temporaryButtonNames
        this.setState({
          ...this.state,
          temporaryButtonNames: {
            ...this.state.temporaryButtonNames,
            [data.temporaryButtons.buttonPosition]: data.temporaryButtons.name,
          }
        })

      }, 0)
    }
  }


  componentWillUnmount() {
    this.props.socket.removeAllListeners()
  }

  resetedState: MainFormState

  resetState = () => {
    this.setState({
      ...this.resetedState,
      textEditorState: this.state.textEditorState,
      temporaryButtonNames: this.state.temporaryButtonNames,
    })
  }

  start = () => {
    const {lineFormer, allTime} = this.state
    const StartSignal: startSignal = {
      lineFormer,
      allTime,
    }
    this.props.socket.emit(socketConfig.start, StartSignal)
    this.setState({...this.state, disableStart: true})
  }

  pause = () => this.props.socket.emit(socketConfig.pause)

  connect = () => this.props.socket.emit(socketConfig.connect)

  stop = () => {
    console.log('stop')
    this.props.socket.emit(socketConfig.stop)
    this.setState({...this.state, disableStart: false})
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
    const {chosenElement, lineFormer} = this.state
    const {chosenLine, changeId} = chosenElement

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

    const maxTime = Math.max(...newlineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    const newState = {
      ...this.state,
      lineFormer: newlineFormer,
      showEditModal: false,
      allTime: maxTime || this.state.allTime,
      chosenElement: newChosenElement,
    }
    // this.props.socket.emit(socketConfig.makeChange, newState)
    this.setState({...newState})
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine, previousChanges} = chosenElement

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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement

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

  changeTime = (startTime: number, endTime: number): void => {
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement

    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)

    const newlineFormer = cloneDeep(lineFormer)
    newlineFormer[chosenLine.id].changes[index].startTime = startTime
    newlineFormer[chosenLine.id].changes[index].endTime = endTime
    const newChosenLine: ValveLineType = cloneDeep(chosenLine)
    console.log('startTimestartTime', startTime)
    newChosenLine.changes[index].startTime = startTime
    newChosenLine.changes[index].endTime = endTime
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
    const {chosenElement, lineFormer} = this.state
    const {chosenLine} = chosenElement

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
    const {chosenElement, lineFormer} = this.state
    const {chosenLine, previousChanges, newEndTime, changeId} = chosenElement
    const {changes} = chosenLine
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
    const {chosenElement, lineFormer} = this.state
    const {chosenLine, previousChanges, newStartTime, changeId} = chosenElement
    const {changes} = chosenLine
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement
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
    const {chosenElement, lineFormer} = this.state
    const {changeId, chosenLine} = chosenElement
    const index = lineFormer[chosenLine.id].changes.findIndex(change => change.changeId === changeId)
    const newlineFormer = cloneDeep(lineFormer)
    const {waitForValue} = newlineFormer[chosenLine.id].changes[index]
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
        allTime: this.state.allTime,
        editorState: convertToRaw(this.state.textEditorState.getCurrentContent()),
      }
    })
  }

  uploadProtocol = (path: string) => {
    console.log('path', path)
    ipcRenderer.send('load-button', {
      path
    })
  }

  uploadTemporaryProtocol = (path: string, temporaryProtocolButtonPosition: TemporaryProtocolButtonPosition) => {
    ipcRenderer.send('temporary-load-button', {
      path,
      temporaryProtocolButtonPosition
    })
  }

  handleEditorStateChange = (editorState: EditorState) => {
    this.setState({
      textEditorState: editorState
    })
  }

  setProtocol = (name: TemporaryProtocolButtonPosition) => {
    const data = JSON.parse(window.localStorage.getItem(name))
    if (data) {
      const {protocol} = data
      this.setState({
        lineFormer: protocol.lineFormer,
        allTime: protocol.allTime,
        textEditorState: EditorState.createWithContent(convertFromRaw(protocol.textEditorState)),
      })
    }

  }

  openInsertSpaceModal = () => {
    const newlineFormer = cloneDeep(this.state.lineFormer)
    this.setState({
      inserModalChanges: {
        ...this.state.inserModalChanges,
        isOpen: true,
      },
      savedLineFormer: newlineFormer
    })
  }

  closeInsertSpaceModal = () => {
    this.setState({
      inserModalChanges: {
        ...this.state.inserModalChanges,
        isOpen: false,
        additionalTimeValue: 0,
        startTimeValue: 0,
      },
    })
  }

  getInsertedLineFormer = (
    startTime: number,
    addTime: number,
    lineFormer: Array<ValveLineType>
  ) => {
    const insertedLineFormer = lineFormer.map(lf => {
      const insertedChange = lf.changes.map(change => {
        if (change.endTime <= startTime) {
          return change
        } else if (startTime <= change.startTime) {
          return {
            ...change,
            startTime: change.startTime + addTime,
            endTime: change.endTime + addTime
          }
        } else if (startTime > change.startTime && startTime < change.endTime) {
          return {
            ...change,
            endTime: change.endTime + addTime
          }
        }

        return change
      })

      return {
        ...lf,
        changes: insertedChange
      }
    })

    return insertedLineFormer

  }

  getRemoveLineFormer = (
    startTime: number,
    endTime: number,
    lineFormer: Array<ValveLineType>,
    mode: RemoveSpaceOption
  ): Array<ValveLineType> => {
    let endTimeDiff = 0
    if (mode === 'remove_changes') {
      const period = endTime - startTime

      const insertedLineFormer = lineFormer.map(lf => {
        const insertedChange = lf.changes.map(change => {
          // if (change.changeId === 4 && change.value === 600) {
          //   debugger
          //   console.log('change', change)
          // }

          if (startTime <= change.startTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE1')
            }
            return {
              ...change,
              changeId: undefined // should filter -> remove
            }
          } else if (startTime <= change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE2')
            }
            return {
              ...change,
              startTime: endTime,
            }
          } else if (startTime > change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE4')
            }
            return {
              ...change,
              // startTime: change.startTime + period, //  startTime,
              endTime: change.endTime - period,
            }
          } else if (startTime > change.startTime && startTime < change.endTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE5')
            }
            return {
              ...change,
              endTime: startTime,
            }
          }

          return change
        })


        return {
          ...lf,
          changes: insertedChange.filter(fchange => fchange.changeId !== undefined)
        }
      })

      return insertedLineFormer as Array<ValveLineType>

    } else if (mode === 'remove_all') {
      const period = endTime - startTime

      const insertedLineFormer = lineFormer.map(lf => {
        const insertedChange = lf.changes.map(change => {
          // if (change.changeId === 4 && change.value === 600) {
          //   debugger
          //   console.log('change', change)
          // }

          if (startTime <= change.startTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE_A1')
            }
            return {
              ...change,
              changeId: undefined // should filter -> remove
            }
          } else if (startTime <= change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE_A2', endTime - period, change.endTime - period)
            }
            return {
              ...change,
              startTime: startTime,
              endTime: change.endTime - period
            }
          } else if (startTime > change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE_A4')
            }
            return {
              ...change,
              // startTime: change.startTime + period, //  startTime,
              endTime: change.endTime - period,
            }
          } else if (startTime > change.startTime && startTime < change.endTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE_A5')
            }
            return {
              ...change,
              endTime: startTime,
            }
          } else if (startTime < change.startTime && endTime < change.startTime) {
            return {
              ...change,
              startTime: change.startTime - period,
              endTime: change.endTime - period
            }
          }

          return change
        })


        return {
          ...lf,
          changes: insertedChange.filter(fchange => fchange.changeId !== undefined)
        }
      })

      return insertedLineFormer as Array<ValveLineType>

    } else if (mode === 'insert_space') {
      const period = endTime - startTime

      const insertedLineFormer = lineFormer.map(lf => {
        const insertedChange = lf.changes.map(change => {
          // if (change.changeId === 4 && change.value === 600) {
          //   debugger
          //   console.log('change', change)
          // }

          if (startTime <= change.startTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE_I1')
            }
            return {
              ...change,
              startTime: change.startTime + period,
              endTime: change.endTime + period,
            }
          } else if (startTime <= change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE_I2', endTime - period, change.endTime - period)
            }
            return {
              ...change,
              startTime: change.startTime + period,
              endTime: change.endTime + period,
            }
          } else if (startTime > change.startTime && endTime < change.endTime && endTime > change.startTime) {
            if (change.value === 300) {
              console.log('CASE_I4')
            }
            return {
              ...change,
              // startTime: change.startTime + period, //  startTime,
              endTime: change.endTime + period,
            }
          } else if (startTime > change.startTime && startTime < change.endTime && endTime >= change.endTime) {
            if (change.value === 300) {
              console.log('CASE_I5')
            }
            return {
              ...change,
              endTime: change.endTime + period,
            }
          } else if (startTime < change.startTime && endTime < change.startTime) {
            return {
              ...change,
              startTime: change.startTime + period,
              endTime: change.endTime + period
            }
          }

          return change
        })


        return {
          ...lf,
          changes: insertedChange.filter(fchange => fchange.changeId !== undefined)
        }
      })

      return insertedLineFormer as Array<ValveLineType>
    }

    return lineFormer

  }

  changeInsertSpaceStartTime = (value: number) => {
    const additionalTime = this.state.inserModalChanges.additionalTimeValue
    const prevLineFormer = this.state.savedLineFormer

    const insertedLineFormer = this.getInsertedLineFormer(value, additionalTime, prevLineFormer)

    const maxTime = Math.max(...prevLineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    this.setState({
      ...this.state,
      lineFormer: insertedLineFormer,
      allTime: maxTime + additionalTime,
      inserModalChanges: {
        ...this.state.inserModalChanges,
        startTimeValue: value
      }
    })
  }

  changeInsertSpaceAddtitionalTime = (value: number) => {
    const insertSpaceStartTime = this.state.inserModalChanges.startTimeValue
    const prevLineFormer = this.state.savedLineFormer

    const insertedLineFormer = this.getInsertedLineFormer(insertSpaceStartTime, value, prevLineFormer)

    const maxTime = Math.max(...prevLineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    this.setState({
      ...this.state,
      lineFormer: insertedLineFormer,
      allTime: maxTime + value,
      inserModalChanges: {
        ...this.state.inserModalChanges,
        additionalTimeValue: value
      }
    })

  }

  resetInsertModalChanges = () => {
    const prevLineFormer = this.state.savedLineFormer
    const maxTime = Math.max(...prevLineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    this.setState({
      lineFormer: prevLineFormer,
      allTime: maxTime
    })
  }

  openRemoveSpaceModal = () => {
    const newlineFormer = cloneDeep(this.state.lineFormer)
    this.setState({
      removeModalChanges: {
        ...this.state.removeModalChanges,
        isOpen: true,
      },
      savedLineFormer: newlineFormer
    })
  }

  closeRemoveSpaceModal = () => {
    this.setState({
      removeModalChanges: {
        ...this.state.removeModalChanges,
        isOpen: false,
        endTimeValue: 0,
        startTimeValue: 0,
      },
    })
  }

  changeRemoveSpaceStartTime = (value: number) => {
    const endTime = this.state.removeModalChanges.endTimeValue

    if (endTime === 0) {
      console.log('value', value);

      this.setState({
        ...this.state,
        removeModalChanges: {
          ...this.state.removeModalChanges,
          startTimeValue: value
        }
      })
    } else {

      const prevLineFormer = this.state.savedLineFormer
      const period = endTime - value

      const insertedLineFormer = this.getRemoveLineFormer(value, endTime, prevLineFormer)

      const maxTime = Math.max(...prevLineFormer.map(lines => {
        if (lines.changes.length) {
          return lines.changes[lines.changes.length - 1].endTime
        }
        return 0
      }))

      this.setState({
        ...this.state,
        lineFormer: insertedLineFormer,
        allTime: maxTime - period,
        removeModalChanges: {
          ...this.state.removeModalChanges,
          startTimeValue: value
        }
      })
    }
  }

  changeRemoveSpaceEndTime = (value: number) => {
    const startTime = this.state.removeModalChanges.startTimeValue

    if (value <= startTime) {
      this.setState({
        ...this.state,
        removeModalChanges: {
          ...this.state.removeModalChanges,
          endTimeValue: value
        }
      })
    } else {

      const prevLineFormer = this.state.savedLineFormer
      const period = value - startTime

      const insertedLineFormer = this.getRemoveLineFormer(startTime, value, prevLineFormer)

      const maxTime = Math.max(...prevLineFormer.map(lines => {
        if (lines.changes.length) {
          return lines.changes[lines.changes.length - 1].endTime
        }
        return 0
      }))

      this.setState({
        ...this.state,
        lineFormer: insertedLineFormer,
        allTime: maxTime - period,
        removeModalChanges: {
          ...this.state.removeModalChanges,
          endTimeValue: value
        }
      })

    }
  }

  removeSelectedTimeElements = (startTime: number, endTime: number, mode: RemoveSpaceOption) => {
    if (isNaN(startTime) || isNaN(endTime) || !mode) {
      return
    }

    const newlineFormer = cloneDeep(this.state.lineFormer)
    const period = endTime - startTime

    const insertedLineFormer = this.getRemoveLineFormer(startTime, endTime, newlineFormer, mode)

    const maxTime = Math.max(...newlineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    let allTime = maxTime
    if (mode === 'remove_all') {
      allTime = maxTime - period
    } else if (mode === 'insert_space') {
      allTime += period
    }

    this.setState({
      ...this.state,
      lineFormer: insertedLineFormer,
      allTime: allTime,
    })
  }

  resetRemoveModalChanges = () => {
    const prevLineFormer = this.state.savedLineFormer
    const maxTime = Math.max(...prevLineFormer.map(lines => {
      if (lines.changes.length) {
        return lines.changes[lines.changes.length - 1].endTime
      }
      return 0
    }))

    this.setState({
      lineFormer: prevLineFormer,
      allTime: maxTime
    })
  }

  openManualControlModal = () => {
    this.setState({
      isManualControlModalOpen: true
    })
  }

  closeManualControlModal = () => {
    this.setState({
      isManualControlModalOpen: false
    })
  }

  sendRPMValueToController = (rpmValue: number) => {

    this.props.socket.emit(socketConfig.setRPMValue, rpmValue)
  }

  toggleManualControlValves = (shorName: ShortNames, value: boolean) => {
    this.props.socket.emit(socketConfig.switchValves, {shorName, value})
  }

  render() {
    const {showEditModal, chosenElement} = this.state
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
          handleEditorStateChange={this.handleEditorStateChange}
          changeTime={this.changeTime}
          uploadTemporaryProtocol={this.uploadTemporaryProtocol}
          temporaryButtonNames={this.state.temporaryButtonNames}
          setProtocol={this.setProtocol}
          openInsertSpaceModal={this.openInsertSpaceModal}
          openRemoveSpaceModal={this.openRemoveSpaceModal}
          openManualControlModal={this.openManualControlModal}
          removeSelectedTimeElements={this.removeSelectedTimeElements}
          {...this.state}
        />
        <ModalWithCondition
          condition={showEditModal}
          closeModal={this.closeModal}
          resetToPreviousChanges={this.resetToPreviousChanges}
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
              case 'AUX':
                return (<ValveLineModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeStartTime}
                  changeEndTime={this.changeEndTime}
                />)
              case 'NewAUX':
                return (<NewValveLineModal
                  removeValveTime={this.removeValveTime}
                  chosenElement={chosenElement}
                  closeModal={this.closeModal}
                  resetToPreviousChanges={this.resetToPreviousChanges}
                  changeStartTime={this.changeNewStartTime}
                  changeEndTime={this.changeNewEndTime}
                />)
              default:
                return <div>NOTHING TO SHOW</div>
            }
          }}
        />
        <ModalWithCondition
          condition={this.state.searchingSerial}
          render={() => <SearchingBoardModal/>}
        />
        <ModalWithCondition
          closeModal={this.closeInsertSpaceModal}
          condition={this.state.inserModalChanges.isOpen}
          resetToPreviousChanges={this.resetInsertModalChanges}
          render={() =>
            <InsertSpaceModal
              closeModal={this.closeInsertSpaceModal}
              changeStartTime={this.changeInsertSpaceStartTime}
              changeAddtitionalTime={this.changeInsertSpaceAddtitionalTime}
              {...this.state.inserModalChanges}
              resetChanges={this.resetInsertModalChanges}
            />
          }
        />
        <ModalWithCondition
          closeModal={this.closeRemoveSpaceModal}
          condition={this.state.removeModalChanges.isOpen}
          resetToPreviousChanges={this.resetRemoveModalChanges}
          render={() =>
            <RemoveSpaceModal
              closeModal={this.closeRemoveSpaceModal}
              changeStartTime={this.changeRemoveSpaceStartTime}
              changeEndTime={this.changeRemoveSpaceEndTime}
              {...this.state.removeModalChanges}
              resetChanges={this.resetRemoveModalChanges}
            />
          }
        />
        <ModalWithCondition
          closeModal={this.closeManualControlModal}
          condition={this.state.isManualControlModalOpen}
          containerMargin={30}
          render={() =>
            <ManualControlModal
              sendRPMValue={this.sendRPMValueToController}
              closeModal={this.closeManualControlModal}
              toggleValve={this.toggleManualControlValves}
            />
          }
        />

      </div>
    )
  }
}

export default MainForm
