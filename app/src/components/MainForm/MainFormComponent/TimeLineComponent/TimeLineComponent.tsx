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
  // console.log('TimeLineComponent distance', distance)
  // console.log('TimeLineComponent time', time)
  const dividersTemplate = []
  const dividersTemplatePercent = []
  if (allTime > 0) {
    const sliceCount = 6;
    const maxI = allTime / 50
    for (let i = 0; i <= sliceCount; i++) {
      dividersTemplate.push(
        <div key={i} className={s['time-former']}>
          <div className={s.divider} />
          <div className={s['time-count']}>{Math.floor((allTime * i) / sliceCount)}</div>
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
    {/* <div style={{
      width: '100%',
      background: 'rgba(255, 0,0,0.3)',
      height: '20px',
      margin: '10px 0 10px 0',
      display: 'flex',
      justifyContent: 'space-between',
    }}
    className={s['time-show']}
    >
      {dividersTemplatePercent}
    </div> */}
  </div>
  )
}

export default TimeLineComponent
