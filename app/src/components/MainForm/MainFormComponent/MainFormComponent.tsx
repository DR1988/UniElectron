import React, {useState, useEffect, useCallback, useRef} from 'react'
import cn from 'classnames'
// import fs from 'fs'
import electron from 'electron'
import {Editor} from "react-draft-wysiwyg";
import {EditorState} from 'draft-js';

import {TemporaryProtocolButtonPosition, ValveLineType} from './../MainFormInterfaces'
import ValveTimeComponentAdder from './ValveTimeComponentAdder'
import ReactionFlowComponent from '../../ReactionFlowComponent/ReactionFlowComponent'
import ProcessSheetComponent, {Props as ProcessSheetComponentProps} from './ProcessSheetComponent/ProcessSheetComponent'

import s from './MainFormComponent.css'
import {RemoveSpaceOption} from '../../CommonTypes';
import { DnDProtocol } from './DnDProtocol/DnDProtocol';

const { dialog } = electron.remote
const EmptyName = ''
// max cursor travel (px) between mousedown and mouseup on a protocol button for it to count as a click, not a drag
const CAPTURE_CLICK_THRESHOLD = 5

// splits a total duration in seconds into hours / minutes / seconds strings
const decomposeAllTime = (totalSeconds: number) => ({
  hours: String(Math.floor(totalSeconds / 3600)),
  minutes: String(Math.floor((totalSeconds % 3600) / 60)),
  seconds: String(totalSeconds % 60),
})
interface Props extends ProcessSheetComponentProps {
  resetState: () => void,
  start: () => void,
  pause: () => void,
  stop: () => void,
  addNewValveTime: (chosenLine: ValveLineType) => void,
  connect: () => void,
  switchHV: () => void,
  HVOpen: boolean,
  socket: SocketIOClient.Socket,
  downloadProtocol: (path: string) => void,
  uploadProtocol: (path: string) => void
  uploadTemporaryProtocol: (path: string, temporaryProtocolButtonPosition: TemporaryProtocolButtonPosition) => void
  handleEditorStateChange: (editorState: EditorState) => void,
  serialConnected: boolean,
  textEditorState: EditorState,
  changeTime: (startTime: number, endTime: number) => void
  temporaryButtonNames: Record<TemporaryProtocolButtonPosition, string>
  setProtocol: (name: TemporaryProtocolButtonPosition) => void
  disableStart: boolean
  openInsertSpaceModal: () => void
  openRemoveSpaceModal: () => void
  openManualControlModal: () => void
  removeSelectedTimeElements: (startTime: number, endTime: number, mode: RemoveSpaceOption) => void
  changeAllTime: (value: number) => void
  allTimeError: string
}

const MainFormComponent = ({
  lineFormer,
  time,
  allTime,
  showModal,
  resetState,
  addNewValveTime,
  start,
  pause,
  stop,
  connect,
  socket,
  switchHV,
  HVOpen,
  downloadProtocol,
  uploadProtocol,
  serialConnected,
  handleEditorStateChange,
  textEditorState,
  changeTime,
  uploadTemporaryProtocol,
  temporaryButtonNames,
  setProtocol,
  disableStart,
  openInsertSpaceModal,
  openRemoveSpaceModal,
  openManualControlModal,
  changeAllTime,
  allTimeError,
  ...ProcessSheetComponentProps
}: Props) => {
  
  // where the capture (protocol grab) started - distinguishes a plain click from a drag
  const captureStartPosRef = useRef<{x: number, y: number} | null>(null)
  // which protocol button is pressed - a drag may start from it
  const capturingSlotRef = useRef<TemporaryProtocolButtonPosition | null>(null)
  // latest cursor position over the form - used to place the preview when a drag starts
  const lastMousePosRef = useRef<{x: number, y: number} | null>(null)
  const protocolRef = useRef<HTMLDivElement | null>(null)
  const [allTimeInputs, setAllTimeInputs] = useState(() => decomposeAllTime(allTime))
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const [capturedProtocol, captureProtocol] = useState<TemporaryProtocolButtonPosition | ''>('')
  const [screenSpaceWidth, setScreenSpaceRefWidth] = useState(0)
  // canvas zoom from CanvasProcessSheetComponent2 (scaleRef) - keeps the DnD preview in sync with it
  const [canvasScale, setCanvasScale] = useState(1)

  const onCaptureProtocol = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, protocol: TemporaryProtocolButtonPosition) => {
    // remember the grab only - the preview appears once a real drag starts (containerForm onMouseMove)
    captureStartPosRef.current = {x: event.nativeEvent.clientX, y: event.nativeEvent.clientY}
    capturingSlotRef.current = protocol
  }, [])

  // place the preview right after it mounts: the drag-start mousemove sets capturedProtocol,
  // but the element is not rendered yet inside that handler
  useEffect(() => {
    if (capturedProtocol && protocolRef.current && lastMousePosRef.current) {
      const bound = protocolRef.current.getBoundingClientRect()
      protocolRef.current.style.left = `${lastMousePosRef.current.x - bound.width/2}px`
      protocolRef.current.style.top = `${lastMousePosRef.current.y - bound.height/2}px`
    }
  }, [capturedProtocol])

  useEffect(() => {
    setAllTimeInputs(decomposeAllTime(allTime))
  }, [allTime])

  const handleAllTimeFieldChange = (field: 'hours' | 'minutes' | 'seconds') => (e: React.FormEvent<HTMLInputElement>) => {
    // minutes/seconds: empty falls back to 0, a leading zero is dropped on input ("05" -> "5")
    const rawValue = (field === 'minutes' || field === 'seconds')
      ? String(+e.currentTarget.value)
      : e.currentTarget.value

    // minutes/seconds cannot exceed 59: reject the keystroke entirely (controlled input keeps its previous value)
    if (field === 'minutes' || field === 'seconds') {
      if (!/^\d{1,2}$/.test(rawValue) || +rawValue > 59) {
        return
      }
    }

    const next = {...allTimeInputs, [field]: rawValue}
    setAllTimeInputs(next)

    // apply only when all three fields are valid: hours - any non-negative integer, minutes/seconds - 0..59
    if (/^\d+$/.test(next.hours) && /^\d+$/.test(next.minutes) && /^\d+$/.test(next.seconds)) {
      const hours = +next.hours
      const minutes = +next.minutes
      const seconds = +next.seconds
      changeAllTime(hours * 3600 + minutes * 60 + seconds)
    }
  }

  const openDialogForTemporaryButtons = (name: TemporaryProtocolButtonPosition) => {
      dialog.showOpenDialog(null, {
          defaultPath: '',
          title: 'Загрузить протокол',
          filters: [{
              extensions: ['json'],
              name: ''
          }],
      }).then(({filePaths}) => {
          if (filePaths.length) {
              uploadTemporaryProtocol(filePaths[0], name)
          }
      })
  }

  return (
    <div id="containerForm"
      onMouseMove={(event) => {
        lastMousePosRef.current = {x: event.nativeEvent.clientX, y: event.nativeEvent.clientY}

        // a press that moved beyond the threshold becomes a drag - show the preview now
        if (!capturedProtocol && capturingSlotRef.current && captureStartPosRef.current) {
          const start = captureStartPosRef.current
          if (Math.hypot(event.nativeEvent.clientX - start.x, event.nativeEvent.clientY - start.y) > CAPTURE_CLICK_THRESHOLD) {
            captureProtocol(capturingSlotRef.current)
          }
        }

        if (capturedProtocol && protocolRef.current) {
          const data = JSON.parse(window.localStorage.getItem(capturedProtocol))
          // clientX/clientY are viewport-relative, so convert them to containerForm's
          // coordinate space (its containing block) - otherwise the element is shifted
          // by the page scroll / offset of any positioned ancestor
          const rect = event.currentTarget.getBoundingClientRect()
          const protocolRefBound = protocolRef.current.getBoundingClientRect()
          protocolRef.current.style.left = `${event.nativeEvent.clientX - protocolRefBound.width/2}px`;
          protocolRef.current.style.top = `${event.nativeEvent.clientY - protocolRefBound.height/2}px`;
        }
        // if (capturedProtocol) {
        //   console.log(event.nativeEvent.offsetX)
        //   console.log(event.nativeEvent.offsetY)
        // }
      }}
      onMouseLeave={() => {
        capturingSlotRef.current = null
        captureProtocol('')
      }}
      onMouseUp={(event) => {
        capturingSlotRef.current = null
        captureProtocol('')
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          capturingSlotRef.current = null
          captureProtocol('')
        }
      }}
    >
      <div id="mainForm" className={s.mainForm}>
        <section className={s.sidebar}>
          <ReactionFlowComponent openManualControlModal={openManualControlModal} socket={socket} lineFormer={lineFormer} time={time} />
          <Editor
              editorState={textEditorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName={s.wrapperClassName}
              editorClassName={s.editorClassName}
              toolbar={{
                options: ['inline', 'fontSize', 'list', 'colorPicker', 'history'],
                inline: {
                  options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
                },
                list: {
                  options: ['unordered', 'ordered'],
                }
              }}
              onEditorStateChange={handleEditorStateChange}
          />
        </section>
        <section className={s['form-container']}>
          <section className={s['protocol-form']}>
            <ProcessSheetComponent
              lineFormer={lineFormer}
              showModal={showModal}
              time={time}
              allTime={allTime}
              changeTime={changeTime}
              addNewValveTime={addNewValveTime}
              {...ProcessSheetComponentProps}
              setContainerElement={setContainerElement}
              containerElement={containerElement}
              captureProtocol={captureProtocol}
              capturedProtocol={capturedProtocol}
              setProtocol={setProtocol}
              screenSpaceWidth={screenSpaceWidth}
              setScreenSpaceRefWidth={setScreenSpaceRefWidth}
              onScaleChange={setCanvasScale}
            />
          </section>
          <div className={s.allTimeRow}>
            <label htmlFor="all-time-hours">All time</label>
            <input
              id="all-time-hours"
              type="text"
              value={allTimeInputs.hours}
              onChange={handleAllTimeFieldChange('hours')}
            />
            <span className={s.allTimeUnit}>h</span>
            <input
              id="all-time-minutes"
              type="number"
              value={allTimeInputs.minutes}
              onChange={handleAllTimeFieldChange('minutes')}
            />
            <span className={s.allTimeUnit}>m</span>
            <input
              id="all-time-seconds"
              type="text"
              value={allTimeInputs.seconds}
              onChange={handleAllTimeFieldChange('seconds')}
            />
            <span className={s.allTimeUnit}>s</span>
            {allTimeError ?
              <span className={s.allTimeError}>{allTimeError}</span> : null}
          </div>
          {/* <div className={cn(s.spaceButtonsContainer)}>
            <button
              className={s.spaceButton}
              onClick={openInsertSpaceModal}
            >
              Insert Space
            </button>
            <button
              className={s.spaceButton}
              onClick={openRemoveSpaceModal}
            >
              Remove Space
            </button>

            <button
              className={(s.spaceButton, s.manualButton)}
              onClick={openManualControlModal}
            >
              Manual Control
            </button>
          </div> */}
        </section>
      </div>
      <div className={s.buttons} >
        <button
            className={s.protocolButton}
            onClick={connect}>Connect</button>
        <button
            className={cn({ [s.inactive]: disableStart }, s.protocolButton)}
          onClick={start}>Start</button>
        {/* <button
          className={cn({ [s.inactive]: !serialConnected }, s.protocolButton)}
          onClick={pause}>Pause</button> */}
        <button
          className={cn({ [s.inactive]: !serialConnected }, s.protocolButton)}
          onClick={stop}>Stop</button>
        <button onClick={resetState}>Reset</button>
        <button
            className={s.protocolButton}
            onClick={() => {
          dialog.showSaveDialog(null, {
            defaultPath: '',
            title: 'Сохранить протокол',
            filters: [{
              extensions: ['json'],
              name: ''
            }],
          }).then(({filePath}) => {
              downloadProtocol(filePath)
          })
        }}>Save</button>
        <button
          className={s.protocolButton}
          onClick={() => {
          dialog.showOpenDialog(null, {
            defaultPath: '',
            title: 'Загрузить протокол',
            filters: [{
              extensions: ['json'],
              name: ''
            }],
          }).then(({filePaths}) => {
            if (filePaths.length) {
              uploadProtocol(filePaths[0])
            }
          })
        }}>Load</button>
        <button
          className={cn({ [s.inactive]: !serialConnected}, s.protocolButton)}
          onClick={switchHV}>{HVOpen ? 'Open valves' : 'Close valves'}</button>
      </div>
      <div className={s.temporaryContainer}>
        <span className={s.temporaryTitle}>Protocol Set Buttons</span>
            <div className={s.loadingProtocolButtons}>
                {(Object.keys(temporaryButtonNames) as TemporaryProtocolButtonPosition[]).map((position) => {
                    const name = temporaryButtonNames[position]
                    return (
                        <button
                            key={position}
                            title={name || EmptyName}
                            onMouseDown={(event) => {
                                if (event.nativeEvent.button === 0) {
                                    onCaptureProtocol(event, position)
                                }
                            }}
                            onMouseUp={(event) => {
                                if (event.nativeEvent.button === 2) {
                                    openDialogForTemporaryButtons(position)
                                } else if (event.nativeEvent.button === 0 && !capturedProtocol) {
                                    // a plain click (no drag started) loads the protocol right away;
                                    // a drag ends on the canvas, which loads it there instead
                                    const start = captureStartPosRef.current
                                    if (start && Math.hypot(event.nativeEvent.clientX - start.x, event.nativeEvent.clientY - start.y) <= CAPTURE_CLICK_THRESHOLD) {
                                        setProtocol(position)
                                    }
                                }
                            }}
                            className={cn(s.loadingProtocolButton, !name && s.emptyProtocolButton)}
                        >
                            {name || EmptyName}
                            <span
                                className={s.protocolButtonDots}
                                title="Загрузить протокол"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={() => openDialogForTemporaryButtons(position)}
                            >...</span>
                        </button>
                    )
                })}
          </div>
      </div>

      <DnDProtocol allTime={allTime} screenSpaceWidth={screenSpaceWidth} scale={canvasScale} protocolRef={protocolRef} capturedProtocol={capturedProtocol}/>
    </div>
  )
}

export default MainFormComponent
