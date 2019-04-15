import React, { StatelessComponent } from 'react'
import PropTypes from 'prop-types'

import s from './TimeLineComponent.css'

interface Props {
  allTime: number,
  time: number,
  distance: number,
  width?: string
}

const TimeLineComponent: StatelessComponent<Props> = ({
  allTime,
  time,
  distance,
  width = '100%',
}) => {
  // console.log('distance', distance)
  // console.log('time', time)
  const dividersTemplate = []
  if (allTime > 0) {
    const maxI = allTime / 50
    for (let i = 0; i <= maxI; i++) {
      dividersTemplate.push(
        <div key={i} className={s['time-former']}>
          <div className={s.divider} />
          <div className={s['time-count']}>{Math.floor((allTime * i) / maxI)}</div>
        </div>,
      )
    }
  }

  let formWidth = 0
  let scale = 1
  const ttllefRightPadding = 40
  if (typeof window !== 'undefined' && document.getElementById('form-Manupalation')) {
    formWidth = document.getElementById('form-Manupalation').offsetWidth
    if ((formWidth - ttllefRightPadding) / allTime > 1 && allTime > 0) {
      scale = (formWidth - ttllefRightPadding) / allTime
    }
  }
  // console.log(scale)
  return (<div className={s['time-line_wraper']}>
    <div className={s['time-line']} style={{ width: width }} >
      <div className={s['time-show']}>
        {dividersTemplate}
      </div>
    </div>
    <div
      className={s['time-presenter']}
      style={{ left: `${distance}%`, transition: `left ${time}s linear` }}
      // style={{ left: distance * scale, transition: `left ${time}s linear` }}
    >
      <div className={s.line} />
      <div className={s['arrow-up']} />
    </div>
  </div>
  )
}

export default TimeLineComponent
