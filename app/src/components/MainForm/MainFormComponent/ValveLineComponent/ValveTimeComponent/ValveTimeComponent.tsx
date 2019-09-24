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
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  scale: number,
}

class ValveTimeComponent extends PureComponent<Props>{
  currentEvent: React.MouseEvent<SVGRectElement, MouseEvent>

  static defaultProps = {
    waitForValue: false,
  }

  constructor(props: Props) {
    super(props)
  }

  getCrossingSpace = (
    { crossingValueStart, crossingValueEnd }: { crossingValueStart: number, crossingValueEnd: number },
  ): string => {
    console.log(crossingValueStart, crossingValueEnd)
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

  toggleValveTime = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    e.persist()
    e.stopPropagation()
    this.currentEvent = e
    const { changeId, showModal, setChosenValveTime, lineID } = this.props
    showModal()
    setChosenValveTime(lineID, +changeId)
  }

  getCrossingSpaceSvg = (
    { crossingValueStart, crossingValueEnd }: { crossingValueStart: number, crossingValueEnd: number },
  ): string => {
    const svgform = document.getElementById('svgform')
    if (crossingValueStart > 0 && crossingValueEnd < 0) {
      console.log(this.currentEvent.currentTarget)
      // svgform.appendChild(this.currentEvent.target as Node)
      return 'url(#grad--linear-cross)'
    } else if (crossingValueStart > 0) {
      console.log(this.currentEvent.currentTarget)
      // svgform.appendChild(this.currentEvent.target as Node)
      return 'url(#grad--linear-cross)'
    } else if (crossingValueEnd < 0) {
      // svgform.appendChild(this.currentEvent.target as Node)
      return 'url(#grad--linear-cross)'
    } else if (crossingValueStart === 0) {
      return 'url(#grad--linear-border-left'
    } else if (crossingValueEnd === 0) {
      return 'url(#grad--linear-border-rigth)'
    }
    return 'url(#grad--linear-normal)'
  }

  setToFront = (elem) => {
    // console.log('elem', elem)
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
      scale,
    } = this.props
    return (
      <Fragment>
        <rect
          y={5 + ind * 55}
          className={s.timeFormer}
          onClick={(e: React.MouseEvent<SVGRectElement, MouseEvent>) => this.toggleValveTime(e)}
          x={`${100 * startTime}%`}
          style={{
            fill: this.getCrossingSpaceSvg({ crossingValueStart, crossingValueEnd }),
            width: `${100 * width}%`,
          }}
        >
          {waitForValue ? (<div className={s.triangle_container}>
            <div className={s.triangle}>

            </div>
          </div>) : null}
        </rect>
        <foreignObject
          style={{ pointerEvents: 'none' }}
          x={`${100 * (startTime)}%`}
          y={5 + ind * 55}
          className={s.timeFormer_content}
          width={`${100 * width}%`}
          height="50">
          {/* <div className={s.timeFormer_content}> */}
          <span style={{ transform: `scaleX(${1 / scale})`}}
            className={s.timeFormer_sign}>
              {value}
            </span>
          {/* </div> */}
        </foreignObject>
        {/* <text style={{ pointerEvents: 'none' }}
          className={s.timeFormer_sign}
          y={5 + ind * 55 + 25}
          x={`${100 * (startTime + width / 2)}%`}
          text-anchor="middle"
          alignment-baseline="central"
          >
          {value}
        </text> */}
      </Fragment>
    )
  }
}


export default ValveTimeComponent
