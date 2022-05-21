import React, {MouseEvent, useRef, useState} from 'react'

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
  changeTime: (startTime: number, endTime: number) => void
  allTime: number
}

const ValveTimeComponent:React.FC<Props> = (props) => {

  const [verticalLineY, setVerticalLineY] = useState<number | null>(null)
  const [draggable, setDraggable] = useState(false)
  const [isCover, setCover] = useState(0)

  const mouseDragRef = useRef(false)

  const getCrossingSpace = (
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

  const toggleValveTime = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const { changeId, showModal, setChosenValveTime, lineID } = props
    showModal(e)
    setChosenValveTime(lineID, +changeId)
  }

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
      changeTime,
      setChosenValveTime,
      allTime,
    } = props

    const ref = useRef<HTMLDivElement | null>(null)
    const formBounds = formRef?.getBoundingClientRect()
    const shiftX = useRef<number | null>(null)
    return (
      <div
        ref={ref}
        onMouseEnter={(e) => {
          const valveTimeComponentTop = e.currentTarget.getBoundingClientRect().top
          const formTop = formRef?.getBoundingClientRect().top
          setVerticalLineY( formTop - valveTimeComponentTop)
        }}
        //TODO: make it work when it needs to be
        onMouseLeave={() => {
            setDraggable(false)
            mouseDragRef.current = false
            setVerticalLineY(null)
        }}
        // onDragStart={() => {
        //     return false
        // }}
        // onMouseDown={(e) => {
        //     shiftX.current = e.clientX - e.currentTarget.getBoundingClientRect().left
        //     setChosenValveTime(lineID, +changeId)
        //     setDraggable(true)
        // }}
        // onMouseUp={(e) => {
        //     if(e.nativeEvent.button === 2) {
        //         toggleValveTime(e)
        //         return
        //     }
        //     if (!mouseDragRef.current) {
        //         toggleValveTime(e)
        //         setDraggable(false)
        //         return
        //     }
        //
        //     mouseDragRef.current = false
        //     setDraggable(false)
        //
        //     changeTime(
        //         Math.round(parseInt(ref.current.style.left) / formRef.getBoundingClientRect().width * allTime * scale),
        //         Math.round((parseInt(ref.current.style.left)) / formRef.getBoundingClientRect().width * allTime * scale + width * allTime))
        // }}
        // onMouseMove={e => {
        //     if (draggable && ref.current) {
        //         setCover(1)
        //         mouseDragRef.current = true
        //         ref.current.style.left = (e.pageX - formRef.getBoundingClientRect().left - shiftX.current)/ scale + 'px'
        //     }
        // }}
        className={s.timeFormer}
        onClick={toggleValveTime}
        style={{
          left: `${100 * startTime}%`,
          background: getCrossingSpace({ crossingValueStart, crossingValueEnd }),
          zIndex: crossingValueStart || crossingValueEnd ? 2 : 'auto',
          width: `${100 * width}%`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: verticalLineY !== null ? formBounds.height : 0,
            backgroundColor: 'red',
            top: verticalLineY,
            zIndex: 3
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: verticalLineY !== null ? formBounds.height : 0,
            backgroundColor: 'red',
            top: verticalLineY,
            right: 0,
            zIndex: 3,
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


export default ValveTimeComponent
