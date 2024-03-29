import React, { PureComponent } from 'react'

import s from './ValveLineComponent.css'
import ValveTimeComponent from './ValveTimeComponent'
import {ValveLineType} from '../../../MainFormInterfaces';

interface Props {
  line: ValveLineType,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void
  scale: number,
  formRef: HTMLDivElement | null
  changeTime: (startTime: number, endTime: number) => void
}

class ValveLineComponent extends PureComponent<Props>{

  setValue = (
    lineName: 'ValveLine' | 'RPMSetter' | 'TempSetter' | 'NewValveLine' | 'NewRPMSetter' | 'NewTempSetter' | 'AUX' | 'NewAUX',
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
    const { showModal, setChosenValveTime, allTime, line, scale, formRef, changeTime } = this.props
    const lineName = line.name
    return (
      <div className={s['time-box_keeper']}
        style={{
          // transform: `scaleX(${scale})`
        }}
      >
        {line.changes.map((el) => {
          const { startTime, endTime, value, crossingValueEnd, crossingValueStart } = el
          const duration = endTime - startTime
          return (
            <ValveTimeComponent
              waitForValue={el.waitForValue}
              key={el.changeId}
              lineID={line.id}
              changeId={el.changeId}
              value={this.setValue(lineName, value || 0, duration)}
              startTime={startTime / allTime}
              width={duration / allTime}
              allTime={allTime}
              showModal={showModal}
              setChosenValveTime={setChosenValveTime}
              crossingValueEnd={crossingValueEnd}
              crossingValueStart={crossingValueStart}
              scale={scale}
              formRef={formRef}
              changeTime={changeTime}
            />
          )
        })}
      </div>
    )
  }
}


export default ValveLineComponent
