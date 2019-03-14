import React, { Component, StatelessComponent } from 'react'
import cn from 'classnames'

import s from './NewValveLineModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface { }

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

const NewValveLineModal: StatelessComponent<Props> = ({
  resetToPreviousChanges,
  closeModal,
  chosenElement,
  changeStartTime,
  changeEndTime,
}) => {
  const isSetValveTimeEnable = (newStartTime: number, newEndTime: number, wrongSign: string): string => {
    if (newStartTime >= newEndTime) return 'Start time should be less then End time'
    if (wrongSign) return wrongSign
    // if (newStartTime <= newEndTime) return 'Start time should be less then End time'
    return ''
  }
  const { wrongSign, newStartTime, newEndTime } = chosenElement
  return (
    <div className={s.root}>
      <div className={s.content}>
        <header>Change Values</header>
        <main>
          <div className={s.inputs} >
            <div>
              <label htmlFor="start-time">Start time</label>
              <br />
              <CustomInput
                id="start-time"
                changeValue={changeStartTime}
                value={!isNaN(newStartTime) ? newStartTime : 0}
              // defaultValue={!newElement ? chosenLine.changes[changeId].startTime : 0}
              />
            </div>
            <div>
              <label htmlFor="end-time">End time</label>
              <br />
              <CustomInput
                id="end-time"
                changeValue={changeEndTime}
                value={!isNaN(newEndTime) ? newEndTime : 0}
              // defaultValue={!newElement ? chosenLine.changes[changeId].endTime : 0}
              />
            </div>
          </div>
          {isSetValveTimeEnable(newStartTime, newEndTime, wrongSign) ?
            <div>
              <span>{isSetValveTimeEnable(newStartTime, newEndTime, wrongSign)}</span>
            </div> : null}
          <button
            className={cn({ [s.button_disable]: isSetValveTimeEnable(newStartTime, newEndTime, wrongSign) })}
            onClick={closeModal}
          >Ok</button>
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

export default NewValveLineModal
