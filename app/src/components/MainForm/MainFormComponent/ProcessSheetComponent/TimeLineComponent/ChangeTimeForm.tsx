import React, {FunctionComponent, useState} from 'react';

import styles from './ChangeTime.css'
import {
  getTimeIntervalsFromSeconds,
  TIME_RECORD
} from '../../../../../utils';
import {TimeInput} from './TimeInput';

export type Props = {
  allTime: number
  startTime: number
  endTime: number
  changeStartTime: (value: number) => void
  changeEndTime: (value: number) => void
}

export const TimeValue = {
  Seconds: 'Seconds',
  Minutes: 'Minutes',
  Hours: 'Hours'
} as const

const daysToSeconds = (value: number) => {
  return hoursToSeconds(value) * 24
}

const hoursToSeconds = (value: number) => {
  return value * 60 * 60
}

const minutesToSeconds = (value: number) => {
  return value * 60
}

export type ValueOf<T> = T[keyof T];

export type TimeTypes = ValueOf<typeof TimeValue>

export const ChangeTimeForm: FunctionComponent<Props> = (
  {
    allTime,
    startTime,
    endTime,
    changeStartTime,
    changeEndTime,
  }) => {

  const allTimeTotalArr = getTimeIntervalsFromSeconds(allTime)
  const startTimeTotalArr = getTimeIntervalsFromSeconds(startTime)
  const endTimeTotalArr = getTimeIntervalsFromSeconds(endTime)

  const _changeStartTime = (timeRecord: TIME_RECORD) => {
    const {value, interval} = timeRecord
    let newStartTime = startTime

    if (interval === 'seconds') {
      newStartTime += value
    } else if (interval === 'minutes') {
      newStartTime += minutesToSeconds(value)
    } else if (interval === 'hour') {
      newStartTime += hoursToSeconds(value)
    } else if (interval === 'day') {
      newStartTime += daysToSeconds(value)
    }

    if (newStartTime < endTime && newStartTime >= 0) {
      changeStartTime(newStartTime)
    }
  }

  const _changeEndTime = (timeRecord: TIME_RECORD) => {
    const {value, interval} = timeRecord
    let newEndTime = endTime

    if (interval === 'seconds') {
      newEndTime += value
    } else if (interval === 'minutes') {
      newEndTime += minutesToSeconds(value)
    } else if (interval === 'hour') {
      newEndTime += hoursToSeconds(value)
    } else if (interval === 'day') {
      newEndTime += daysToSeconds(value)
    }

    if (newEndTime > startTime && newEndTime <= allTime) {
      changeEndTime(newEndTime)
    } else if (newEndTime >= allTime) {
      changeEndTime(allTime)
    }
  }


  return <section
    onMouseDown={e => e.stopPropagation()}
    className={styles.container}
  >
    <div className={styles.content}>
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <span className={styles.controlLabel}>Star Time</span>
          <div style={{display: 'flex'}}>
            {allTimeTotalArr.map(item => {
              const resultItem = startTimeTotalArr.find(el => el.interval === item.interval)
              return <div key={item.interval} style={{marginLeft: 5}}>
                <TimeInput
                  name={item.interval}
                  value={resultItem?.value || 0}
                  step={1}
                  changeValue={(value) => _changeStartTime({...item, value})}
                  maxValue={item.maxValue}
                  minValue={0}
                />
              </div>
            })}
          </div>

        </div>
        <div className={`${styles.controls} ${styles.restControl}`}>
          <span className={styles.controlLabel}>End Time</span>
          <div style={{display: 'flex'}}>
            {allTimeTotalArr.map(item => {
              const resultItem = endTimeTotalArr.find(el => el.interval === item.interval)
              return <div key={item.interval} style={{marginLeft: 5}}>
                <TimeInput
                  name={item.interval}
                  value={resultItem?.value || 0}
                  step={1}
                  changeValue={(value) => _changeEndTime({...item, value})}
                  maxValue={item.maxValue}
                  minValue={0}
                />
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
}
