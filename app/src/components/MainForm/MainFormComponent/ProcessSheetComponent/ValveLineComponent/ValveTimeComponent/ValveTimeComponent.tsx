import React, { Component, PureComponent } from 'react'

import s from './ValveTimeComponent.css'

interface Props {
  waitForValue?: boolean,
  changeId: number | string,
  value: number,
  startTime: number,
  width: number,
  lineID: number,
  crossingValueStart: number,
  crossingValueEnd: number,
  showModal: (e: React.SyntheticEvent<HTMLDivElement>) => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  scale: number,
  formRef: HTMLDivElement | null
}

type ValveTimeComponentState = {
  verticalLineY: number
}

class ValveTimeComponent extends PureComponent<Props, ValveTimeComponentState>{
  static defaultProps = {
    waitForValue: false,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      verticalLineY: 0
    }
  }

  getCrossingSpace = (
    { crossingValueStart, crossingValueEnd }: { crossingValueStart: number, crossingValueEnd: number },
  ): string => {
    if (crossingValueStart > 0 && crossingValueEnd < 0) {
      return `linear-gradient(90deg, rgba(0, 0, 0, 0) ${100 * crossingValueStart}%, rgba(171, 193, 197, 1) 0%, rgba(171, 193, 197, 1) ${100 + 100 * crossingValueEnd}%, rgba(0, 0, 0, 0) 0),
      rgba(171, 193, 197, 0.5) repeating-linear-gradient(-45deg, transparent, transparent 7.5px,
      rgba(226, 5, 5, 0.5) 7.5px, rgba(226, 5, 5, 0.5) 15px)`
    } else if (crossingValueStart > 0) {
      return `linear-gradient(90deg, rgba(171, 193, 197, 0.3) ${100 * crossingValueStart}%, rgba(171, 193, 197, 1) 0%),
      rgba(171, 193, 197, 0.5) repeating-linear-gradient(-45deg, transparent, transparent 7.5px,
      rgba(226, 5, 5, 0.5) 7.5px, rgba(226, 5, 5, 0.5) 15px)`
    } else if (crossingValueEnd < 0) {
      return `linear-gradient(90deg, rgba(171, 193, 197, 1) ${100 + 100 * crossingValueEnd}%, rgba(0, 0, 0, 0) 0),
      rgba(171, 193, 197, 0.5) repeating-linear-gradient(-45deg, transparent, transparent 7.5px,
      rgba(226, 5, 5, 0.5) 7.5px, rgba(226, 5, 5, 0.5) 15px)`
    } else if (crossingValueStart === 0) {
      return 'linear-gradient(90deg, red 3px, rgba(171, 193, 197, 1) 0%)'
    } else if (crossingValueEnd === 0) {
      return `linear-gradient(90deg, rgba(171, 193, 197, 1) calc(${100}% - 3px), red 3px)`
    }
    return 'rgba(171, 193, 197, 1)'
  }

  toggleValveTime = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const { changeId, showModal, setChosenValveTime, lineID } = this.props
    showModal(e)
    setChosenValveTime(lineID, +changeId)
  }

  render() {
    const {
      value,
      width,
      startTime,
      crossingValueStart,
      crossingValueEnd,
      lineID,
      changeId,
      waitForValue,
      scale,
      formRef,
    } = this.props

    return (
      <div
        onMouseEnter={(e) => {
          const valveTimeComponentTop = e.currentTarget.getBoundingClientRect().top
          const formTop = formRef?.getBoundingClientRect().top
          this.setState({
            verticalLineY: formTop - valveTimeComponentTop
          })
        }}
        onMouseLeave={() => {
          this.setState({
            verticalLineY: 0
          })
        }}
        className={s.timeFormer}
        onClick={this.toggleValveTime}
        style={{
          left: `${100 * startTime}%`,
          background: this.getCrossingSpace({ crossingValueStart, crossingValueEnd }),
          zIndex: crossingValueStart || crossingValueEnd ? 2 : 'auto',
          width: `${100 * width}%`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: this.state.verticalLineY ? formRef?.getBoundingClientRect().height : 0,
            backgroundColor: 'red',
            top: this.state.verticalLineY,
            zIndex: 3
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: this.state.verticalLineY ? formRef?.getBoundingClientRect().height : 0,
            backgroundColor: 'red',
            top: this.state.verticalLineY,
            right: 0,
            zIndex: 3
          }}
        />
        <div style={{position: 'absolute'}}/>
        {waitForValue ? (<div className={s.triangle_container}>
          <div className={s.triangle}>

          </div>
        </div>) : null}
        <div className={s.timeFormer_content}>
          <span style={{ transform: `scaleX(${1 / scale})` }}
            className={s.timeFormer_sign}>
            {value}
          </span>
        </div>
      </div>
    )
  }
}


export default ValveTimeComponent
