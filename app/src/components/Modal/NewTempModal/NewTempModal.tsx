import React, { Component } from 'react'
import cn from 'classnames'
import s from './NewTempModal.css'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeTempValue: (TempValue: number) => void
}

interface ButtonProps {
  removeValveTime: () => void,
}

class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) { // eslint-disable-line
    super(props)
  }
  _removeValveTime = () => {
    const { removeValveTime } = this.props
    removeValveTime()
  }
  render() {
    return <button onClick={this._removeValveTime}>Remove</button>
  }
}

type CustomInputProps = {
  id: string,
  value: number,
  disabled: boolean,
  changeValue: (value: number) => void,
}

class CustomInput extends Component<CustomInputProps> { // eslint-disable-line
  static defaultProps = {
    disabled: false,
  }
  constructor(props: CustomInputProps) { // eslint-disable-line
    super(props)
  }
  _changeValue = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { changeValue } = this.props
    if (Number.isInteger(+e.target.value.trim()) && +e.target.value.trim() >= 0) {
      changeValue(+e.target.value)
    }
  }
  render() {
    const { value, id, disabled } = this.props
    return (<input
      id={id}
      disabled={disabled}
      type="text"
      onChange={this._changeValue}
      value={value}
    />)
  }
}

const getWrongValue = (startTime: number, endTime: number, TempValue: number, wrongSign: string): string => {
  if (startTime >= endTime) return 'Start time should be less then End time'
  if (TempValue < 10) return 'TempValue should be greater 10'
  if (TempValue > 70) return 'TempValue should be less 70'
  if (wrongSign) return wrongSign
  // if (newStartTime <= newEndTime) return 'Start time should be less then End time'
  return ''
}

const NewTempModal = ({
  chosenElement,
  closeModal,
  changeTempValue,
  changeStartTime,
  changeEndTime,
  resetToPreviousChanges,
  removeValveTime,
}: Props) => {
  const { wrongSign, newTempValue, newStartTime, newEndTime } = chosenElement
  const wrongSignValue = getWrongValue(newStartTime, newEndTime, newTempValue || 0, wrongSign)
  return (
    <div className={s.root}>
      <div className={s.content}>
        <header>Change Temp Values</header>
        <main>
          <div className={s.inputs} >
            <div>
              <label htmlFor="start-time">Start time</label>
              <br />
              <CustomInput
                id="start-time"
                changeValue={changeStartTime}
                value={newStartTime}
              />
            </div>
            <div>
              <label htmlFor="end-time">End time</label>
              <br />
              <CustomInput
                id="end-time"
                changeValue={changeEndTime}
                value={newEndTime}
              />
            </div>
          </div>
          <div>
            <label htmlFor="Temp_value">Temp value</label>
            <br />
            <CustomInput
              disabled={!newStartTime && !newEndTime}
              id="Temp_value"
              changeValue={changeTempValue}
              value={newTempValue || 0}
            />
          </div>
          <div>
            <label htmlFor="waitForValue">
              wait for value
              <input id="waitForValue" type="checkbox" />
            </label>
          </div>
          {wrongSignValue ?
            <div>
              <span>{wrongSignValue}</span>
            </div> : null}
          <button
            className={cn({ [s.button_disable]: wrongSignValue })}
            onClick={closeModal}
          >Ok</button>
          <Button
            removeValveTime={removeValveTime}
          />
          <button
            onClick={() => {
              resetToPreviousChanges()
              closeModal()
            }}
          >Cancel</button>
        </main>
      </div>
    </div>
  )
}

export default NewTempModal

