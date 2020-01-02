import React, { StatelessComponent } from 'react'
import PropTypes from 'prop-types'

import TimeLine from './TimeLineComponent'
import ValveLineComponent from './ValveLineComponent'

import { ValveLineType } from './../../MainFormInterfaces'

import s from './ProcessSheetComponent.css'

export interface Props {
  changScale: (e: React.WheelEvent) => void,
  lockOnForm: (e) => void,
  isMoving: boolean,
  moveForm: (e: React.MouseEvent) => void,
  unlockForm: () => void,
  distance: number,
  time: number,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  scale: number,
  translateX: number,
  lineFormer: Array<ValveLineType>,
}

const ProcessSheetComponent: StatelessComponent<Props> = ({
  changScale,
  lockOnForm,
  isMoving,
  moveForm,
  unlockForm,
  distance,
  time,
  allTime,
  showModal,
  setChosenValveTime,
  scale,
  translateX,
  lineFormer,
}) => {
  // console.log(scale)

  return (<section
    className={s['lines-keeper']}
    onWheel={changScale}
    onMouseDown={lockOnForm}
    onMouseUp={lockOnForm}
    onMouseMove={isMoving ? moveForm : f => f}
    onMouseLeave={unlockForm}
  >
    <div style={{
      transform: `scaleX(${scale}) translateX(${translateX}px)`
    }}
    className={s.lineKeeperContent}
    >
      {lineFormer.map(elem => <ValveLineComponent
        key={elem.id}
        line={elem}
        allTime={allTime}
        showModal={showModal}
        setChosenValveTime={setChosenValveTime}
        scale={scale}
      />,
      )}
      <TimeLine
        scale={scale}
        distance={distance}
        time={time}
        allTime={allTime}
      />
    </div>

  </section >
  )
}

export default ProcessSheetComponent
