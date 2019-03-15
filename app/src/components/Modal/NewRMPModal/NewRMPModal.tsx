import React, { Component } from 'react'
import cn from 'classnames'

import s from './NewRMPModal.css'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeRPMValue: (NewRPMValue: number) => void
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

interface CustomInputProps {
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

const getWrongValue = (startTime: number, endTime: number, RPMValue: number, wrongSign: string): string => {
  if (startTime >= endTime) return 'Start time should be less then End time'
  if (RPMValue < 100) return 'RPMValue should be greater 100'
  if (RPMValue > 3000) return 'RPMValue should be less 3000'
  if (wrongSign) return wrongSign
  // if (newStartTime <= newEndTime) return 'Start time should be less then End time'
  return ''
}

const NewRMPModal = ({
  chosenElement,
  closeModal,
  changeRPMValue,
  changeStartTime,
  changeEndTime,
  resetToPreviousChanges,
  removeValveTime,
}: Props) => {
  const { wrongSign, newRPMValue, newStartTime, newEndTime } = chosenElement
  const wrongSignValue = getWrongValue(newStartTime, newEndTime, newRPMValue || 0, wrongSign)
  return (
    <div className={s.root}>
      <div className={s.content}>
        <header>Change RPM Values</header>
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
            <label htmlFor="RPM_value">RPM value</label>
            <br />
            <CustomInput
              disabled={!newStartTime && !newEndTime}
              id="RPM_value"
              changeValue={changeRPMValue}
              value={newRPMValue || 0}
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

export default NewRMPModal

