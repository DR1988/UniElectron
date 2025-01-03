import React, {useEffect, useRef} from 'react'
import styles from './TimeInput.css'

export type Props = {
  name: string,
  value: number,
  changeValue: (value: number) => void
  maxValue: number
  minValue: number
  step?: number
}

export const TimeInput: React.FC<Props> = (
  {
    name,
    value,
    changeValue, maxValue,
    minValue,
    step = 1
  }) => {

  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  if (minValue >= maxValue) {
    throw new Error('Min value should be less then a max value')
  }

  const increaseValue = (event: React.MouseEvent) => {
    // console.log('ince', value, step)
    const result = Math.min(value + step, maxValue)
    // changeValue(result)
    changeValue(step)
  }


  const decreaseValue = (event: React.MouseEvent) => {
    // console.log('ince', value, step)

    // console.log('value - step', value - step, minValue)
    const result = Math.max(value - step, minValue)
    // console.log('result', result)
    // changeValue(result)
    changeValue(-step)
  }

  const _changeValue = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const _value = +event.target.value.trim()
    if (Number.isInteger(_value) && _value >= minValue && _value <= maxValue) {
      // console.log('change end time', _value)
      const diff = _value - value
      console.log('diffdiff', diff)
      // changeValue(_value)
      changeValue(diff)
    }
  }

  return <div className={styles.container}>

    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={name}>
        {name}
      </label>
      <input className={styles.input} value={value} onChange={_changeValue} id={name} type="text"/>
    </div>

    <div className={styles.buttonContainer}>
      <button className={styles.button} onClick={increaseValue}>+</button>
      {/*<div><span>+</span></div>*/}
      <button className={styles.button} onClick={decreaseValue}>-</button>
      {/*<div className={styles.button} onClick={decreaseValue}><span>-</span></div>*/}
    </div>
  </div>
}
