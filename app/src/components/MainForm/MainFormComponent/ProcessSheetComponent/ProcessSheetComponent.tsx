import React, {
  StatelessComponent,
  PureComponent,
  useState,
  useRef,
  useEffect,
  MouseEventHandler,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import TimeLine from './TimeLineComponent'
import ValveLineComponent from './ValveLineComponent'

import {ValveLineType} from './../../MainFormInterfaces'

import s from './ProcessSheetComponent.css'
import {render} from 'react-dom'
import ValveTimeComponentAdder from '../ValveTimeComponentAdder/ValveTimeComponentAdder'
import throttle from 'lodash/throttle';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {CanvasProcessSheetComponent2} from './CanvasProcessSheetComponent2';

export interface Props {
  distance: number,
  time: number,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  lineFormer: Array<ValveLineType>,
  changeTime: (startTime: number, endTime: number) => void
  addNewValveTime: (chosenLine: ValveLineType) => void,
  removeSelectedTimeElements: (startTime: number, endTime: number, mode: RemoveSpaceOption) => void
}

interface State {
  scale: number,
  translateX: number,
  isMoving: boolean,
}

const ProcessSheetComponent: React.FC<Props> = (props) => {

  let currentX: number = 0
  let sheetWidth: number
  let crossCursor: boolean = false

  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [formHeight, setFormHeight] = useState(0)
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)

  const formRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current?.offsetHeight) {
      setTimeout(() => { // костыль - так как в TimeLine компоненте не адекватно подстваляет выоста в стили и происходит пересчет высоты формы
        setFormHeight(formRef.current?.offsetHeight)
      }, 0)
    }
  }, [])

  useEffect(() => {
    const listener = (e) => {
      const sectionWidth = sectionRef.current?.getBoundingClientRect().width
      setTranslateX(sectionWidth / 2 - sectionWidth / 2 / (scale))
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
      setTranslateX(sectionWidth / 2 - sectionWidth / 2 / (scale - 0.5))
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
    addNewValveTime,
    removeSelectedTimeElements
  } = props

  const mousePosition = useRef(0)


  const throttleStartPositionRef = useRef(throttle((position: number) => {
    mousePosition.current = position
  }, 30));

  const handleMouseMove = (event: React.MouseEvent) => {
    throttleStartPositionRef.current(event.clientX - event.currentTarget.getBoundingClientRect().left)
  }

  useEffect(() => {
    if (containerRef.current) {
        setContainerElement(containerRef.current)
    }
  }, [containerRef.current])
  
  return (
    <section className={s.container} ref={mainContainerRef}>
      <div className={s.valveAdderAndLineNamesContainer}>
        <div className={s.lineNamesContainer}>
          {lineFormer.map(line => (
            <div key={line.name + line.id} className={s.lineNames}>
              <span>{line.shortName}</span>
              <div className={s.lineNamesSignContainer}>{line.description}</div>
            </div>
          ))}
        </div>
        <div className={s.valveAdderContainer}>
          <ValveTimeComponentAdder
            lines={lineFormer}
            showModal={showModal}
            addNewValveTime={addNewValveTime}
          />
        </div>
      </div>
      <div
        ref={containerRef}
        style={{display: 'flex', minWidth: 500, width: '100%', flexDirection: 'column', overflow: 'hidden'}}>

        {containerElement ?
          <CanvasProcessSheetComponent2
            distance={distance}
            time={time}
            allTime={allTime}
            showModal={showModal}
            setChosenValveTime={setChosenValveTime}
            addNewValveTime={addNewValveTime}
            removeSelectedTimeElements={removeSelectedTimeElements}
            lineFormer={lineFormer}
            container={containerElement}
          />
            : null
        }

        {/*<section*/}
        {/*  // onMouseMove={handleMouseMove}*/}
        {/*  id="processSheet"*/}
        {/*  className={cn(s['lines-keeper'], {[s.crossed]: crossCursor})}*/}
        {/*  onWheel={changScale}*/}
        {/*  onMouseDown={lockOnForm}*/}
        {/*  onMouseUp={lockOnForm}*/}
        {/*  onMouseMove={isMoving ? moveForm : f => f}*/}
        {/*  onMouseLeave={unlockForm}*/}
        {/*  ref={sectionRef}*/}
        {/*>*/}
        {/*  <div*/}
        {/*    ref={formRef}*/}
        {/*    style={{*/}
        {/*      transform: `scaleX(${scale}) translateX(${translateX}px)`*/}
        {/*    }}*/}
        {/*    className={s.lineKeeperContent}*/}
        {/*  >*/}
        {/*    {lineFormer.map(elem => <ValveLineComponent*/}
        {/*        key={elem.name + elem.id}*/}
        {/*        line={elem}*/}
        {/*        allTime={allTime}*/} 
        {/*        showModal={showModal}*/}
        {/*        setChosenValveTime={setChosenValveTime}*/}
        {/*        scale={scale}*/}
        {/*        changeTime={props.changeTime}*/}
        {/*        formRef={formRef.current}*/}
        {/*      />,*/}
        {/*    )}*/}
        {/*    <TimeLine*/}
        {/*      formRef={formRef.current}*/}
        {/*      timeLineHeight={formHeight}*/}
        {/*      scale={scale}*/}
        {/*      distance={distance}*/}
        {/*      time={time}*/}
        {/*      allTime={allTime}*/}
        {/*      removeSelectedTimeElements={removeSelectedTimeElements}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</section>*/}
      </div>
    </section>
  )
}

export default ProcessSheetComponent
