import React, { Component, Fragment } from 'react'

import s from './ValveLineComponent.css'
import ValveTimeComponent from './ValveTimeComponent'
import { ValveLineType } from '../../MainFormInterfaces'

interface Props {
  ind?: number,
  line: ValveLineType,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  scale: number,
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
    const { showModal, setChosenValveTime, allTime, line, ind, scale } = this.props
    const lineName = line.name
    return (
      <Fragment>
        <rect
          y={5 + ind * 55}
          width={'100%'}
          // d={`M0 ${5 + ind * 55} L500 ${5 + ind * 55} L500 ${5 + (ind + 1) * 55} L0 ${5 + (ind + 1) * 55} z`}
          className={s['time-box_keeper']}
        >
        </rect>
        {
          line.changes.map((el) => {
            const { startTime, endTime, value, crossingValueEnd, crossingValueStart } = el
            const duration = endTime - startTime
            return (
              <ValveTimeComponent
                ind={ind}
                waitForValue={el.waitForValue}
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
                scale={scale}
              />
            )
          })
        }
      </Fragment>
    )
  }
}


export default ValveLineComponent
