import React from 'react'

import s from './MainFormComponent.scss'
import { ValveLineType } from './../MainFormInterfaces'
import ValveLineComponent from './ValveLineComponent'
import TimeLine from './TimeLineComponent'
import ValveTimeComponentAdder from './ValveTimeComponentAdder'

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
}: Props) => (
    <div id="mainForm" className={s.mainForm}>
      <section className={s.sidebar}>
        {/* <NoteComponent /> */}
        {/* <ReactionFlowComponent /> */}
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
          <div className={s.buttons} >
            <button onClick={resetState}>Reset</button>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={stop}>Stop</button>
          </div>
        </section>
        <ValveTimeComponentAdder
          lines={lineFormer}
          showModal={showModal}
          addNewValveTime={addNewValveTime}
        />
      </section>
    </div>
  )


export default MainFormComponent
