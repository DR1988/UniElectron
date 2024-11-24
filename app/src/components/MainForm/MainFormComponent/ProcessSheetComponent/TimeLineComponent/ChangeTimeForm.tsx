import React, {FunctionComponent} from 'react';

import styles from './ChangeTime.css'

export type Props = {
  startTime: number
  endTime: number
  changeStartTime: (value: number) => void
  changeEndTime: (value: number) => void
}

export const ChangeTimeForm: FunctionComponent<Props> = (
  {
    startTime,
    endTime,
    changeStartTime,
    changeEndTime,
  }) => {

  const _changeStartTime = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const _value = +event.target.value.trim()
    if (Number.isInteger(_value) && _value >= 0 && _value < endTime) {
      console.log('change start time', _value)
      changeStartTime(_value)
    }
  }

  const _changeEndTime = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const _value = +event.target.value.trim()
    if (Number.isInteger(_value) && _value >= 0 && _value > startTime) {
      console.log('change end time', _value)
      changeEndTime(_value)
    }
  }

  return <section
    onMouseDown={e => e.stopPropagation()}
    className={styles.container}
  >
    <div className={styles.content}>
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <label className={styles.controlLabel}>
            Star Time
          <input
            className={styles.controlInput}
            value={startTime}
            onChange={_changeStartTime}
          />
          </label>
        </div>
        <div className={`${styles.controls} ${styles.restControl}`}>
          <label
            className={styles.controlLabel}>
            End Time
          <input
            className={styles.controlInput}
            value={endTime}
            onChange={_changeEndTime}
          />
          </label>
        </div>
      </div>
    </div>
  </section>
}
