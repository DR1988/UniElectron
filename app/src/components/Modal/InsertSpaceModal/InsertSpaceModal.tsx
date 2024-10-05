import React, { Component, useEffect, useState } from 'react'
import cn from 'classnames'
import type {InsertSpace} from '../../MainForm/MainFormInterfaces'

import s from './../styles/ValveLineModal.css'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends InsertSpace {
  closeModal: () => void
  resetChanges: () => void
  changeStartTime: (startTime: number) => void
  changeAddtitionalTime: (addtitionalTime: number) => void
 } 

type ButtonProps = {
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
  // defaultValue: number,
  id: string,
  value: number,
  changeValue: (value: number) => void,
}

class CustomInput extends Component<CustomInputProps> { // eslint-disable-line
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
    const { value, id } = this.props
    return (<input
      id={id}
      type="text"
      onChange={this._changeValue}
      value={value}
    />)
  }
}


export const InsertSpaceModal = ({
  closeModal,
  changeStartTime,
  changeAddtitionalTime,
  startTimeValue,
  additionalTimeValue,
  isOpen,
  resetChanges,
}: Props) => {
    const [wrongMessage, setWongMessage] = useState('')

    const _changeStartTime = (value: number) => {
      changeStartTime(value)
    }

    const _changeAddtitionalTime = (value: number) => {
        changeAddtitionalTime(value)
      }

    return (
      <div className={s.root}>
        <div className={s.content}>
          <header> <h3>
            Change Values
            </h3>
          </header>
          <main>
            <div className={s.inputs} >
              <div>
                <label htmlFor="start-time">Start time</label>
                <br />
                <CustomInput
                  id="start-time"
                  changeValue={_changeStartTime}
                  value={startTimeValue}
                />
              </div>
              <div>
                <label htmlFor="additional-time">Additional time</label>
                <br />
                <CustomInput
                  id="additional-time"
                  changeValue={_changeAddtitionalTime}
                  value={additionalTimeValue}
                />
              </div>
            </div>
            {wrongMessage ?
              <div className={s.wrong_sign_container}>
                <span>{wrongMessage}</span>
              </div> : null}
            <section className={s.buttons}>
              <button
                className={cn({ [s.button_disable]: !!wrongMessage})}
                onClick={closeModal}
              >Ok</button>
              <button
                onClick={() => {
                  resetChanges()
                  closeModal()
                }}
              >Cancel</button>
            </section>
          </main>
        </div>
      </div>
    )
  }
