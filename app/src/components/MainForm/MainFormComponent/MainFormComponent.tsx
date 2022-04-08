import React from 'react'
import cn from 'classnames'
// import fs from 'fs'
import electron from 'electron'
import {Editor} from "react-draft-wysiwyg";
import {EditorState} from 'draft-js';

import {ValveLineType} from './../MainFormInterfaces'
import ValveTimeComponentAdder from './ValveTimeComponentAdder'
import ReactionFlowComponent from '../../ReactionFlowComponent/ReactionFlowComponent'
import ProcessSheetComponent, {Props as ProcessSheetComponentProps} from './ProcessSheetComponent/ProcessSheetComponent'

import s from './MainFormComponent.css'

const { dialog } = electron.remote

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
  handleEditorStateChange: (editorState: EditorState) => void,
  serialConnected: boolean,
  textEditorState: EditorState | null,
}

const MainFormComponent = ({
  lineFormer,
  time,
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
  ...ProcessSheetComponentProps
}: Props) => {

  return (
    <div>

      <div id="mainForm" className={s.mainForm}>
        <section className={s.sidebar}>
          <ReactionFlowComponent socket={socket} lineFormer={lineFormer} time={time} />
          <Editor
              editorState={textEditorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName={s.wrapperClassName}
              editorClassName="editorClassName"
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'history']
              }}
              onEditorStateChange={handleEditorStateChange}
          />
        </section>
        <section className={s['form-container']}>
          <ProcessSheetComponent
            lineFormer={lineFormer}
            showModal={showModal}
            time={time}
            {...ProcessSheetComponentProps}
          />
          <ValveTimeComponentAdder
            lines={lineFormer}
            showModal={showModal}
            addNewValveTime={addNewValveTime}
          />
        </section>
      </div>
      <div className={s.buttons} >
        <button onClick={connect}>Connect</button>
        <button
          // className={cn({ [s.inactive]: !serialConnected })}
          onClick={start}>Start</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={pause}>Pause</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={stop}>Stop</button>
        <button onClick={resetState}>Reset</button>
        <button onClick={() => {
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
        <button onClick={() => {
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
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={switchHV}>{HVOpen ? 'Open valves' : 'Close valves'}</button>
      </div>
    </div>
  )
}

export default MainFormComponent
