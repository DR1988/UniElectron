import React, { StatelessComponent, Component } from 'react'
import cn from 'classnames'

import s from './../styles/ValuesModal.css'
import CommonMoadlInterface from '../modalInterfaces'

interface ButtonProps {
  removeValveTime: () => void
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
  // defaultValue: number,
  id: string,
  value: number,
  changeValue: (value: number) => void,
}

class CustomInput extends Component<CustomInputProps> { // eslint-disable-line
  constructor(props: CustomInputProps) { // eslint-disable-line
    super(props)
  }
  _changeValue = (event: React.FormEvent<HTMLInputElement>) => {
    const { changeValue } = this.props
    const { value } = event.currentTarget
    if (Number.isInteger(+value.trim()) && +value.trim() >= 0) {
      changeValue(+value)
    }
  }
  render() {
    const { value, id } = this.props
    return (<input
      id={id}
      type="text"
      onChange={this._changeValue}
      value={value}
    />)
  }
}

const isSetValveTimeEnable = (startTime: number, endTime: number, RPMValue: number, wrongSign: string): string => {
  if (startTime >= endTime) return 'Start time should be less then End time'
  if (RPMValue < 100) return 'RPMValue should be greater 100'
  if (RPMValue > 3000) return 'RPMValue should be less 3000'
  if (wrongSign) return wrongSign
  // if (newStartTime <= newEndTime) return 'Start time should be less then End time'
  return ''
}

interface Props extends CommonMoadlInterface {
  changeRPMValue: (RPMValue: number) => void,
  changeWaitForValue: () => void,
}

const RMPModal: StatelessComponent<Props> = ({
  chosenElement,
  closeModal,
  changeRPMValue,
  changeStartTime,
  changeEndTime,
  resetToPreviousChanges,
  removeValveTime,
  changeWaitForValue,
}) => {
  const { chosenLine, changeId, wrongSign } = chosenElement
  const filteredChange = chosenLine.changes.filter(change => change.changeId === changeId)[0]
  const { value, startTime, endTime, waitForValue } = filteredChange
  const wrongSignValue = isSetValveTimeEnable(startTime, endTime, value, wrongSign)
  return (
    <div className={s.root}>
      <div className={s.content}>
        <header><h3>Change RPM Values</h3></header>
        <main>
          <div className={s.inputs} >
            <div>
              <label htmlFor="start-time">Start time</label>
              <br />
              <CustomInput
                id="start-time"
                changeValue={changeStartTime}
                value={filteredChange.startTime}
              />
            </div>
            <div>
              <label htmlFor="end-time">End time</label>
              <br />
              <CustomInput
                id="end-time"
                changeValue={changeEndTime}
                value={filteredChange.endTime}
              />
            </div>
            <div>
              <label htmlFor="RPM_value">RPM value</label>
              <br />
              <CustomInput
                id="RPM_value"
                changeValue={changeRPMValue}
                value={value || 0}
              />
            </div>
          </div>
          {/* <div className={cn(s.left_margin, s.wait_value_container)}>
            <label htmlFor="waitForValue">
              wait for value
              <input checked={waitForValue} onChange={changeWaitForValue} id="waitForValue" type="checkbox" />
            </label>
          </div> */}
          {wrongSignValue ?
            <div className={s.left_margin}>
              <span>{wrongSignValue}</span>
            </div> : null}
          <section className={s.buttons}>
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
          </section>
        </main>
      </div>
    </div>
  )
}


export default RMPModal
