import React from 'react'
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

const { dialog } = electron.remote
const EmptyName = ''
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
  changeTime,
  uploadTemporaryProtocol,
  temporaryButtonNames,
  setProtocol,
  disableStart,
  openInsertSpaceModal,
  openRemoveSpaceModal,
  ...ProcessSheetComponentProps
}: Props) => {

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
    <div>
      <div id="mainForm" className={s.mainForm}>
        <section className={s.sidebar}>
          <ReactionFlowComponent socket={socket} lineFormer={lineFormer} time={time} />
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
            {/* <ValveTimeComponentAdder
              lines={lineFormer}
              showModal={showModal}
              addNewValveTime={addNewValveTime}
            /> */}
            <ProcessSheetComponent
              lineFormer={lineFormer}
              showModal={showModal}
              time={time}
              changeTime={changeTime}
              addNewValveTime={addNewValveTime}
              {...ProcessSheetComponentProps}
            />
            {/* <ValveTimeComponentAdder
              lines={lineFormer}
              showModal={showModal}
              addNewValveTime={addNewValveTime}
            /> */}
          </section>
          <div className={cn(s.spaceButtonsContainer)}>
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
          </div>
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
                <button
                title= {temporaryButtonNames.firstTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                      if (event.nativeEvent.button === 2) {
                          openDialogForTemporaryButtons('firstTemporaryButton')
                      }
                      if (event.nativeEvent.button === 0) {
                          setProtocol('firstTemporaryButton')
                      }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.firstTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.firstTemporaryButton || EmptyName}
                </button>
                <button
                title= {temporaryButtonNames.secondTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('secondTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('secondTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.secondTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.secondTemporaryButton || EmptyName}
                </button>
                <button
                title={temporaryButtonNames.thirdTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('thirdTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('thirdTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.thirdTemporaryButton || EmptyName}
                </button>
                <button     
                title= {temporaryButtonNames.fourthTemporaryButton || EmptyName}           
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('fourthTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('fourthTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.fourthTemporaryButton || EmptyName}
                </button>
                <button
                title= {temporaryButtonNames.fifthTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('fifthTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('fifthTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.fifthTemporaryButton || EmptyName}
                </button>
                <button
                title= {temporaryButtonNames.sixthTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('sixthTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('sixthTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.sixthTemporaryButton || EmptyName}
                </button>
                <button
                title={temporaryButtonNames.seventhTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('seventhTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('seventhTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.seventhTemporaryButton || EmptyName}
                </button>
                <button
                    title={temporaryButtonNames.eigthTemporaryButton || EmptyName}
                    onMouseUp={(event) => {
                        if (event.nativeEvent.button === 2) {
                            openDialogForTemporaryButtons('eigthTemporaryButton')
                        }
                        if (event.nativeEvent.button === 0) {
                            setProtocol('eigthTemporaryButton')
                        }
                    }}
                    className={cn(s.loadingProtocolButton, !temporaryButtonNames.thirdTemporaryButton && s.emptyProtocolButton)}
                >
                    {temporaryButtonNames.eigthTemporaryButton || EmptyName}
                </button>
               
          </div>
      </div>
     
    </div>
  )
}

export default MainFormComponent
