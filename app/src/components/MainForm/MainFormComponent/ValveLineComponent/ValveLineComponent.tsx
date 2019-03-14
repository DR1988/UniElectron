import React, { Component } from 'react'

import s from './ValveLineComponent.scss'
import ValveTimeComponent from './ValveTimeComponent'
import { ValveLineType } from '../../MainFormInterfaces'

interface Props {
  line: ValveLineType,
  allTime: number,
  showModal: () => void,
  closeModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void
}

class ValveLineComponent extends Component<Props>{

  setValue = (
    lineName: 'ValveLine' | 'RPMSetter' | 'TempSetter' | 'NewValveLine' | 'NewRPMSetter' | 'NewTempSetter',
    value: number, duration: number): number => {
    switch (lineName) {
      case 'RPMSetter':
      case 'TempSetter':
        return value
      default:
        return duration
    }
  }

  render() {
    const { showModal, setChosenValveTime, allTime, line } = this.props
    const lineName = line.name
    return (
      <div className={s['time-box_keeper']}>
        {line.changes.map((el) => {
          const { startTime, endTime, value, crossingValueEnd, crossingValueStart } = el
          const duration = endTime - startTime
          return (
            <ValveTimeComponent
              key={el.changeId}
              lineID={line.id}
              changeId={el.changeId}
              value={this.setValue(lineName, value || 0, duration)}
              startTime={startTime / allTime}
              width={duration / allTime}
              showModal={showModal}
              setChosenValveTime={setChosenValveTime}
              crossingValueEnd={crossingValueEnd}
              crossingValueStart={crossingValueStart}
            />
          )
        })}
      </div>
    )
  }
}


export default ValveLineComponent
