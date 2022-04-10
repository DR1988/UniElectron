import React, {useRef, useState} from 'react'

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

const ValveTimeComponent:React.FC<Props> = (props) => {

  const [verticalLineY, setVerticalLineY] = useState<number | null>(null)
  const [draggable, setDraggable] = useState(false)

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
    } = props

    const ref = useRef<HTMLDivElement | null>(null)
    const formBounds = formRef?.getBoundingClientRect()
    return (
      <div
        ref={ref}
        onMouseEnter={(e) => {
          const valveTimeComponentTop = e.currentTarget.getBoundingClientRect().top
          const formTop = formRef?.getBoundingClientRect().top
          setVerticalLineY( formTop - valveTimeComponentTop)
        }}
        onMouseLeave={() => {
            setDraggable(false)
            mouseDragRef.current = false
            setVerticalLineY(null)
        }}
        onDragStart={() => {
            return false
        }}
        onMouseDown={(e) => {
            setDraggable(true)
        }}
        onMouseUp={(e) => {
            if (!mouseDragRef.current) {
                toggleValveTime(e)
            }
            mouseDragRef.current = false
            setDraggable(false)
        }}
        onMouseMove={e => {
            if (draggable && ref.current) {
                mouseDragRef.current = true
                const valveTimeComponentBound = e.currentTarget.getBoundingClientRect()

                // console.log('scale', scale)
                // console.log('fiff', (e.pageX - formRef.getBoundingClientRect().left - valveTimeComponentBound.width / 2)/scale)
                ref.current.style.left = (e.pageX - formRef.getBoundingClientRect().left - valveTimeComponentBound.width / 2) / scale + 'px'

                // console.log(formBounds)
            }
            // console.log('eee', e.nativeEvent.clientX, e.clientX)
        }}
        className={s.timeFormer}
        // onClick={toggleValveTime}
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
