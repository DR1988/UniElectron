import React, { Component, PureComponent, Fragment } from 'react'

import s from './ValveTimeComponent.css'

interface Props {
  ind?: number,
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
}

class ValveTimeComponent extends PureComponent<Props>{
  static defaultProps = {
    waitForValue: false,
  }

  constructor(props: Props) {
    super(props)
  }

  getCrossingSpace = (
    { crossingValueStart, crossingValueEnd }: { crossingValueStart: number, crossingValueEnd: number },
  ): string => {
    console.log(crossingValueStart, crossingValueEnd )
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

  getCrossingSpaceSvg = (
    { crossingValueStart, crossingValueEnd }: { crossingValueStart: number, crossingValueEnd: number },
  ): string => {
    console.log('crossingValueStart', crossingValueStart)
    console.log('crossingValueEnd', crossingValueEnd)
    const stop1 = document.getElementById('stop-1')
    const stop2 = document.getElementById('stop-2')
    const stop3 = document.getElementById('stop-3')
    const stop4 = document.getElementById('stop-4')
    if (crossingValueStart > 0 && crossingValueEnd < 0) {
      stop2.setAttribute('offset', `${100 * crossingValueStart}%`)
      stop3.setAttribute('offset', `${100 * crossingValueStart}%`)
      return 'url(#grad--linear-cross)'
    } else if (crossingValueStart > 0) {
      stop2.setAttribute('offset', `${ crossingValueStart }%`)
      stop3.setAttribute('offset', `${ crossingValueStart }%`)
      return 'url(#grad--linear-cross)'
    } else if (crossingValueEnd < 0) {

    } else if (crossingValueStart === 0) {

    } else if (crossingValueEnd === 0) {

    }
    return 'url(#grad--linear-normal)'
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
      ind,
    } = this.props
    return (
      <Fragment>
        <linearGradient id="grad--linear-cross">
          <stop id="stop-1" offset="0%" stopColor="rgba(121, 123, 197, 1)" />
          <stop id="stop-2" offset="20%" stopColor="rgba(121, 123, 197, 1)" />
          <stop id="stop-3" offset="20%" stopColor="rgba(171, 193, 197, 1)" />
          <stop id="stop-4" offset="100%" stopColor="rgba(171, 193, 197, 1)" />
        </linearGradient>
        <linearGradient id="grad--linear-normal">
          <stop offset="0%" stopColor="rgba(171, 193, 197, 1)" />
          <stop offset="100%" stopColor="rgba(171, 193, 197, 1)" />
        </linearGradient>
        <rect
          y={5 + ind * 55}
          className={s.timeFormer}
          onClick={this.toggleValveTime}
          x={`${100 * startTime}%`}
          // d={`M0 0 L500 0 L500 ${5 + 0 * 55} L0 ${5 + 0 * 55} z`}
          style={{
            // left: `${100 * startTime}%`,
            // fill: this.getCrossingSpaceSvg({ crossingValueStart, crossingValueEnd }),
            // fill: 'url(#grad--linear-normal)',
            fill: this.getCrossingSpaceSvg({ crossingValueStart, crossingValueEnd }),
            // zIndex: crossingValueStart || crossingValueEnd ? 2 : 'auto',
            // crossingValue >= 0 ?
            // // `linear-gradient(90deg, rgba(71, 193, 197, 0.3) ${100 * crossingValue}%, rgba(171, 193, 197, 1) 0%)`
            // `linear-gradient(90deg, rgba(0, 0, 0, 0) ${100 * crossingValue}%, rgba(171, 193, 197, 1) 0%),
            // rgba(171, 193, 197, 0.5) repeating-linear-gradient(-45deg, transparent, transparent 7.5px,
            // rgba(226, 5, 5, 0.5) 7.5px, rgba(226, 5, 5, 0.5) 15px)`
            // : 'rgba(171, 193, 197, 1)',
            width: `${100 * width}%`,
          }}
        >
          {waitForValue ? (<div className={s.triangle_container}>
            <div className={s.triangle}>

            </div>
          </div>) : null}
          {/* {changeId === chosenElement.changeId && lineID === chosenElement.chosenLine.id ?
          <div className={s.modal}>
          <div>{chosenElement.changeId}</div>
        </div> : null } */}
          <div className={s.timeFormer_content}>
            <span className={s.timeFormer_sign}>
              {value}
            </span>
          </div>
        </rect>
      </Fragment>
    )
  }
}


export default ValveTimeComponent
