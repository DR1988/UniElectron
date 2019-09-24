import React from 'react'
import cn from 'classnames'
// import fs from 'fs'
// import electron from 'electron'

import s from './MainFormComponent.css'
import { ValveLineType } from './../MainFormInterfaces'
import ValveLineComponent from './ValveLineComponent'
import TimeLine from './TimeLineComponent'
import ValveTimeComponentAdder from './ValveTimeComponentAdder'
import ReactionFlowComponent from '../../ReactionFlowComponent/ReactionFlowComponent'

// const { dialog } = electron.remote

interface Props {
  resetState: () => void,
  start: () => void,
  pause: () => void,
  stop: () => void,
  showModal: () => void,
  addNewValveTime: (chosenLine: ValveLineType) => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  distance: number,
  time: number,
  lineFormer: Array<ValveLineType>,
  allTime: number,
  connect: () => void,
  switchHV: () => void,
  HVOpen: boolean,
  socket: SocketIOClient.Socket,
  downloadProtocol: () => void,
  uploadProtocol: () => void
  serialConnected: boolean,
  scale: number
}

const MainFormComponent = ({
  distance,
  time,
  lineFormer,
  allTime,
  showModal,
  resetState,
  addNewValveTime,
  setChosenValveTime,
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
  scale,
  inrease,
  decrease,
  changScale,
  lockOnForm,
  translateX,
  moveForm,
  isMoving,
  unlockForm,
}: Props) => {
  console.log('translateX', translateX)
  // console.log('serialConnected', serialConnected)
  return (
    <div>
      <div id="mainForm" className={s.mainForm}>
        <section className={s.sidebar}>
          {/* <NoteComponent /> */}
          <ReactionFlowComponent socket={socket} lineFormer={lineFormer} time={time} />
        </section>
        <section className={s['form-container']}>
          {/* <LineDescriptionComponent lines={lineFormer} /> */}
          <svg style={{ transform: `scaleX(${scale}) translateX(${translateX}px)`}}
            id="svgform"
            className={s['lines-keeper']}
            onWheel={changScale}
            onMouseDown={lockOnForm}
            onMouseUp={lockOnForm}
            onMouseMove={isMoving ? moveForm : f => f}
            onMouseLeave={unlockForm}
          >
            <g>
              <linearGradient id="grad"
                spreadMethod="pad"
                x1="0" y1="30%" x2="23.5%" y2="20%">
                <stop offset="0%" stopColor="rgba(171, 193, 197, 0.3)" />
                <stop offset="25%" stopColor="rgba(171, 193, 197, 0.3)" />
                <stop offset="25%" stopColor="rgba(226, 5, 5, 0.3)" />
                <stop offset="50%" stopColor="rgba(226, 5, 5, 0.3)" />
                <stop offset="50%" stopColor="rgba(171, 193, 197, 0.3)" />
                <stop offset="75%" stopColor="rgba(171, 193, 197, 0.3)" />
                <stop offset="75%" stopColor="rgba(226, 5, 5, 0.3)" />
                <stop offset="100%" stopColor="rgba(226, 5, 5, 0.3)" />
              </linearGradient>

              <linearGradient id="grad--linear-border-left">
                <stop offset="0%" stopColor="crimson" />
                <stop offset="2%" stopColor="crimson" />
                <stop offset="2%" stopColor="rgba(171, 193, 197, 1)" />
                <stop offset="100%" stopColor="rgba(171, 193, 197, 1)" />
              </linearGradient>

              <linearGradient id="grad--linear-border-rigth">
                <stop offset="0%" stopColor="rgba(171, 193, 197, 1)" />
                <stop offset="98%" stopColor="rgba(171, 193, 197, 1)" />
                <stop offset="98%" stopColor="crimson" />
                <stop offset="100%" stopColor="crimson" />
              </linearGradient>

              <linearGradient id="grad--linear-cross"
                xlinkHref="#grad"
                spreadMethod="repeat" >
              </linearGradient>
              <linearGradient id="grad--linear-normal">
                <stop offset="0%" stopColor="rgba(171, 193, 197, 1)" />
                <stop offset="100%" stopColor="rgba(171, 193, 197, 1)" />
              </linearGradient>
            </g>
            <g>
              {lineFormer.map((elem, ind) => <ValveLineComponent
                ind={ind}
                key={elem.id}
                line={elem}
                allTime={allTime}
                showModal={showModal}
                setChosenValveTime={setChosenValveTime}
                scale={scale}
              />,
              )}
            </g>
            <TimeLine
              scaleX={scale}
              distance={distance}
              time={time}
              allTime={allTime}
            />
          </svg>
          <ValveTimeComponentAdder
            lines={lineFormer}
            showModal={showModal}
            addNewValveTime={addNewValveTime}
          />
        </section>
      </div>
      <div className={s.buttons} >
        <button onClick={connect}>Connect</button>
        <button onClick={() => alert('not implemented')}>Load</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={start}>Start</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={pause}>Pause</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={stop}>Stop</button>
        <button onClick={resetState}>Reset</button>
        <button onClick={() => {
          alert('not implemented')
          // var file = new Blob(['asddad'], { type: 'txt' });
          // console.log(file)
          // var a = document.createElement("a"),
          //   url = URL.createObjectURL(file);
          // a.href = url;
          // a.download = 'protocol';
          // document.body.appendChild(a);
          // a.click();
          // a.remove();

          // dialog.showSaveDialog((filename: string) => {
          //   fs.writeFile(filename, "file new", (err) => {
          //     if(err) {
          //       console.log(err)
          //       return;
          //     }

          //     alert('file created')
          //   })
          // })
        }}>Save</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={switchHV}>{HVOpen ? 'Open valves' : 'Close valves'}</button>
        <button onClick={inrease}>+</button>
        <button onClick={decrease}>-</button>
      </div>
    </div>
  )
}

export default MainFormComponent
