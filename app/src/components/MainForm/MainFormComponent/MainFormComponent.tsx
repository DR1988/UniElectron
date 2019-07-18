import React from 'react'
import cn from 'classnames'

import s from './MainFormComponent.css'
import { ValveLineType } from './../MainFormInterfaces'
import ValveLineComponent from './ValveLineComponent'
import TimeLine from './TimeLineComponent'
import ValveTimeComponentAdder from './ValveTimeComponentAdder'
import ReactionFlowComponent from '../../ReactionFlowComponent/ReactionFlowComponent'

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
}: Props) => {
  console.log('serialConnected', serialConnected)
  return (
    <div>

      <div id="mainForm" className={s.mainForm}>
        <section className={s.sidebar}>
          {/* <NoteComponent /> */}
          <ReactionFlowComponent socket={socket} lineFormer={lineFormer} time={time} />
        </section>
        <section className={s['form-container']}>
          {/* <LineDescriptionComponent lines={lineFormer} /> */}
          <section className={s['lines-keeper']}>
            {lineFormer.map(elem => <ValveLineComponent
              key={elem.id}
              line={elem}
              allTime={allTime}
              showModal={showModal}
              setChosenValveTime={setChosenValveTime}
            />,
            )}
            <TimeLine
              distance={distance}
              time={time}
              allTime={allTime}
            />
            {/* <div className={s.buttons} >
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={resetState}>Reset</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={start}>Start</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={pause}>Pause</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={stop}>Stop</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={() => alert('not implemented')}>Load</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={() => alert('not implemented')}>Save</button>
            <button
              className={cn({ [s.inactive]: !serialConnected })}
              onClick={switchHV}>{HVOpen ? 'Open valves' : 'Close valves'}</button>
            <button onClick={connect}>Connect</button>
          </div> */}
          </section>
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
        <button onClick={() => alert('not implemented')}>Save</button>
        <button
          className={cn({ [s.inactive]: !serialConnected })}
          onClick={switchHV}>{HVOpen ? 'Open valves' : 'Close valves'}</button>
      </div>
    </div>
  )
}


export default MainFormComponent
