import React, {StatelessComponent, PureComponent, useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import TimeLine from './TimeLineComponent'
import ValveLineComponent from './ValveLineComponent'

import { ValveLineType } from './../../MainFormInterfaces'

import s from './ProcessSheetComponent.css'
import { render } from 'react-dom'

export interface Props {
  distance: number,
  time: number,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  lineFormer: Array<ValveLineType>,
  changeTime: (startTime: number, endTime: number) => void
}

interface State {
  scale: number,
  translateX: number,
  isMoving: boolean,
}
const ProcessSheetComponent:React.FC<Props> = (props) => {

  let currentX: number = 0
  let sheetWidth: number
  let crossCursor: boolean = false

  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [formHeight, setFormHeight] = useState(0)

  const formRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current?.offsetHeight) {
      setFormHeight(formRef.current?.offsetHeight)
    }
  }, [formRef.current])

  useEffect(() => {
    const listener = (e) => {
      const sectionWidth = sectionRef.current?.getBoundingClientRect().width
      setTranslateX(sectionWidth/2 - sectionWidth/2 / (scale))
    }
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [scale])

  const changScale = (e: React.WheelEvent) => {
    if (sectionRef.current) {
      if (e.deltaY < 0) {
        increaseScale()
      } else {
        decreaseScale()
      }
    }
  }

  const increaseScale = () => {
    if (scale < 15) {
      const sectionWidth = sectionRef.current.getBoundingClientRect().width
      setTranslateX(sectionWidth / 2 - sectionWidth / 2 / (scale + 0.5))
      setScale(scale + 0.5)
    }
  }

  const decreaseScale = () => {
    if (scale > 1) {
      const sectionWidth = sectionRef.current.getBoundingClientRect().width
      setTranslateX(sectionWidth/2 - sectionWidth/2 / (scale - 0.5))
      setScale(scale - 0.5)
    } else if (translateX !== 0) {
      setTranslateX(0)
    }
  }

  const lockOnForm = (e: React.MouseEvent) => {
    // this.crossCursor = true
    if (e.nativeEvent.which === 2) {
      setIsMoving(!isMoving)
      currentX = e.pageX + translateX
    }
  }

  const moveForm = (e: React.MouseEvent) => {
    const dx = currentX - e.pageX
    if (Math.abs(dx) < e.currentTarget.clientWidth * 0.45) {
      if (scale !== 1) {
        setTranslateX(translateX)
      }
    }
  }

  const unlockForm = () => {
    crossCursor = false
    setIsMoving(false)
  }

  const {
    distance,
    time,
    allTime,
    showModal,
    setChosenValveTime,
    lineFormer,
  } = props

  return (
    <section className={s.container}>
      <div className={s.lineNamesContainer}>
        {lineFormer.map(line => (
          <div key={line.id} className={s.lineNames}>
            <span>{line.shortName}</span>
          </div>
        ))}
      </div>
      <section
        id="processSheet"
        className={cn(s['lines-keeper'], { [s.crossed]: crossCursor })}
        onWheel={changScale}
        onMouseDown={lockOnForm}
        onMouseUp={lockOnForm}
        onMouseMove={isMoving ? moveForm : f => f}
        onMouseLeave={unlockForm}
        ref={sectionRef}
      >
        <div
          ref={formRef}
          style={{
            transform: `scaleX(${scale}) translateX(${translateX}px)`
          }}
          className={s.lineKeeperContent}
        >
          {lineFormer.map(elem => <ValveLineComponent
            key={elem.id}
            line={elem}
            allTime={allTime}
            showModal={showModal}
            setChosenValveTime={setChosenValveTime}
            scale={scale}
            changeTime={props.changeTime}
            formRef={formRef.current}
          />,
          )}
          <TimeLine
            timeLineHeight={formHeight}
            scale={scale}
            distance={distance}
            time={time}
            allTime={allTime}
          />
        </div>
      </section>
    </section>
  )
}

export default ProcessSheetComponent
