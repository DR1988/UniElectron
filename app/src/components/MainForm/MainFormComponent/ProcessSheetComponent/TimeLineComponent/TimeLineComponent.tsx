import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

import s from './TimeLineComponent.css'

interface Props {
  allTime: number,
  time: number,
  distance: number,
  scale: number,
  width?: string
  timeLineHeight?: number
}

const TimeLineComponent: FunctionComponent<Props> = ({
  allTime,
  time,
  distance,
  scale,
  width = '100%',
  timeLineHeight,
}) => {
  const dividersTemplate = []
  const dividersTemplatePercent = []
  if (allTime > 0) {
    const sliceCount = 6;
    const maxI = allTime / 50
    for (let i = 0; i <= sliceCount; i++) {
      dividersTemplate.push(
        <div key={i}
        style={{ transform: `scaleX(${1 / scale})` }}
        className={s['time-former']}>
          <div className={s.divider} />
          <div className={s['time-count']} >
            {Math.floor((allTime * i) / sliceCount)}
          </div>
        </div>,
      )
    }
  }
  if (allTime > 0) {
    for (let i = 0; i <= 10; i++) {
      dividersTemplatePercent.push(
        <div key={i} className={s['time-former']}>
          <div className={s.divider} />
          <div className={s['time-count']}>{Math.floor((i))}</div>
        </div>,
      )
    }
  }

  return (<div
    className={s['time-line_wraper']}>
    <div className={s['time-line']}
      style={{
        width: width,
      }} >
      <div
        className={s['time-show']}>
        {dividersTemplate}
      </div>
    </div>
    <div
      className={s['time-presenter']}
      style={{ left: `${distance * scale}%`, transition: `left ${time}s linear`, transform: `scaleX(${1 / scale})` }}
    >
      <div className={s.line} style={{height: timeLineHeight}} />
      <div className={s['arrow-up']} />
    </div>
  </div>
  )
}

export default TimeLineComponent
