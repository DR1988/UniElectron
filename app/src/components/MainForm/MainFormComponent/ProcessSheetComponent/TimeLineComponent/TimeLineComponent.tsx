import React, {FunctionComponent, useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import {createPortal} from 'react-dom';
import ClickOutHandler from 'react-onclickout'

import s from './TimeLineComponent.css'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import {ContextMenu} from './ContextMenu';
import {contextMenuSize} from './constant';
import {RemoveSpaceOption} from '../../../../CommonTypes';
import {ChangeTimeForm} from './ChangeTimeForm';

interface Props {
  allTime: number,
  time: number,
  distance: number,
  scale: number,
  width?: string
  timeLineHeight?: number
  removeSelectedTimeElements: (startTime: number, endTime: number, mode: RemoveSpaceOption) => void
  formRef: HTMLDivElement | null
}

console.log('ClickOutHandler', ClickOutHandler)
type DraggableActions = 'start_enabled' | 'draggable' | 'drag_finished'
type RemoveButtonRefPosition = 'left' | 'inside' | 'right'

const TimeLineComponent: FunctionComponent<Props> = (
  {
    allTime,
    time,
    distance,
    scale,
    width = '100%',
    timeLineHeight,
    removeSelectedTimeElements,
    formRef,
  }) => {

  // const [startPositionEnable, setStartPositionEnable] = useState<DraggableActions>('start_enabled')
  const [startPositionEnable, setStartPositionEnable] = useState<DraggableActions>('draggable')
  const [removeButtonPosition, setRemoveButtonPosition] = useState<RemoveButtonRefPosition>('inside')
  const [endPositionEnable, setEndPositionEnable] = useState(false)
  const [coverEnable, setCoverEnable] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [changeTimeModal, setChangeTimeModal] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number, swapX: boolean, swapY: boolean }>({
    x: 0,
    y: 0,
    swapX: false,
    swapY: false
  })
  const [changeTimeModalPosition, setChangeTimeModalPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0,
  })

  const [currentStartPosition, setCurrentStartPosition] = useState<number | undefined>(30)
  const [currentStopPosition, setCurrentStopPosition] = useState<number | undefined>(80)

  const dividersTemplate = []
  const dividersTemplatePercent = []
  if (allTime > 0) {
    const sliceCount = 6;
    const maxI = allTime / 50
    for (let i = 0; i <= sliceCount; i++) {
      dividersTemplate.push(
        <div key={i}
             style={{transform: `scaleX(${1 / scale})`}}
             className={s['time-former']}>
          <div className={s.divider}/>
          <div className={s['time-count']}>
            {Math.floor((allTime * i) / sliceCount)}
          </div>
        </div>,
      )
    }
  }
  if (allTime > 0) {
    for (let i = 0; i <= 10; i++) {
      dividersTemplatePercent.push(
        <div key={i} className={s['time-former']}>
          <div className={s.divider}/>
          <div className={s['time-count']}>{Math.floor((i))}</div>
        </div>,
      )
    }
  }

  const timeLineRef = useRef<null | HTMLDivElement>(null)
  const removeButtonRef = useRef<null | HTMLButtonElement>(null)
  const bothSetPosition = useRef<number>(0)


  const throttleStartPositionRef = useRef<(p: number | undefined, sp?: number | undefined) => void>(throttle((position: number | undefined, stopPosition) => {
    if (timeLineRef.current) {
      const positionPercent = 100 * position / timeLineRef.current.offsetWidth
      const stopPositionPixel = stopPosition * timeLineRef.current.offsetWidth / 100
      if (!stopPosition) {
        setCurrentStartPosition(positionPercent)
      } else if (stopPosition && position < stopPositionPixel - 1) {
        setCurrentStartPosition(positionPercent)
      }
    }
  }, 30));

  const throttleFinishPositionRef = useRef<(p: number | undefined, sp?: number | undefined) => void>(throttle((position: number, startPosition: number | undefined) => {
    if (timeLineRef.current) {
      const positionPercent = 100 * position / timeLineRef.current.offsetWidth
      const startPositionPixel = startPosition * timeLineRef.current.offsetWidth / 100

      if (!startPosition) {
        setCurrentStopPosition(positionPercent)
      } else if (startPosition && position > startPositionPixel + 1) {
        setCurrentStopPosition(positionPercent)
      }
    }
  }, 30));

  const captureResizeStartRef = useRef(false)
  const captureResizeFinishRef = useRef(false)
  const captureBothSizeChangeRef = useRef(false)

  const changePosition = useCallback((event) => {
    if (captureResizeStartRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left; //x position within the element.
      throttleStartPositionRef?.current(x / scale, currentStopPosition)
    }
    if (captureResizeFinishRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left; //x position within the element.
      throttleFinishPositionRef?.current(x / scale, currentStartPosition)
    }
  }, [scale, startPositionEnable, currentStopPosition, currentStartPosition])

  const handleBothMove = useCallback((event) => {
    if (captureResizeStartRef.current || captureResizeFinishRef.current) {
      return
    }

    event.stopPropagation()
    if (timeLineRef.current && bothSetPosition.current && captureBothSizeChangeRef.current) {
      const rect = timeLineRef.current.getBoundingClientRect();
      // const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left; //x position within t

      // console.log('event.clientX', event.clientX, x, bothSetPosition.current)
      const diff = bothSetPosition.current - x

      const diffPercent = diff / scale * 100 / timeLineRef.current.offsetWidth
      bothSetPosition.current = x

      if (currentStartPosition - diffPercent >= 0 && currentStopPosition - diffPercent <= 100) {
        setCurrentStartPosition(currentStartPosition - diffPercent)
        setCurrentStopPosition(currentStopPosition - diffPercent)
      }
    }

  }, [currentStartPosition, currentStopPosition, scale])

  const captureResizeStart = () => {
    captureResizeStartRef.current = true
  }

  const captureResizeFinish = () => {
    captureResizeFinishRef.current = true
  }

  const captureBothSizeChange = () => {
    captureBothSizeChangeRef.current = true
  }

  const releaseResizeStart = () => {
    captureResizeStartRef.current = false
  }

  const releaseResizeFinish = () => {
    captureResizeFinishRef.current = false
  }

  const releaseBothSizeChange = () => {
    captureBothSizeChangeRef.current = false
  }

  const closeBothSelection = (event) => {
    if (event.target === timeLineRef.current && startPositionEnable === 'draggable' || startPositionEnable === 'drag_finished') {
      setStartPositionEnable('start_enabled')
      setCurrentStartPosition(undefined)
      setCurrentStopPosition(undefined)
      setShowContextMenu(false)
    }
  }

  const startTime = Math.round(currentStartPosition * allTime / 100)
  const stopTime = Math.round(currentStopPosition * allTime / 100)

  const openContextMenu = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if (formRef) {
      const formBound = formRef.getBoundingClientRect()
      const currentTargetRect = event.currentTarget.getBoundingClientRect()
      const eventOffsetX = event.pageX - currentTargetRect.left
      const eventOffsetY = event.pageY - currentTargetRect.top;
      // console.log('currentTargetRect', event.currentTarget, currentTargetRect)
      const maxRightPosition = event.pageX + contextMenuSize.width
      const maxBottomPosition = event.pageY + contextMenuSize.height

      let swapX = false
      let swapY = false


      if (formBound.right < maxRightPosition) {
        swapX = true
      }

      if (formBound.bottom < maxBottomPosition) {
        swapY = true
      }

      setContextMenuPosition({x: eventOffsetX, y: eventOffsetY, swapX, swapY})
      setShowContextMenu(true)
    }

  }

  const closeContextMenu = useCallback(() => {
    setShowContextMenu(false)
  }, [])

  const selectMode = useCallback((mode: RemoveSpaceOption) => {
    removeSelectedTimeElements(startTime, stopTime, mode)
  }, [startTime, stopTime])

  const openChangeTimeModal = useCallback((event) => {
    if (formRef) {
      const formBound = formRef.getBoundingClientRect()
      // console.log('formBound', formBound)
      const currentTargetRect = event.currentTarget.getBoundingClientRect()
      // console.log('event.currentTarget', event.currentTarget)
      console.log('currentTargetRect', currentTargetRect.x)
      console.log('formBoundx', formBound.x)
      console.log('event.pageX', event.pageX)
      const eventOffsetX = event.pageX - currentTargetRect.left
      const eventOffsetY = event.pageY - formBound.top;

      setChangeTimeModalPosition({x: eventOffsetX, y: currentTargetRect.y - 48 - formBound.y})
      setChangeTimeModal(true)
    }
  }, [formRef])

  const closeChangeTimeModal = useCallback(() => {
    setChangeTimeModal(false)
  }, [])

  return (
    <div
      ref={timeLineRef}
      onMouseLeave={() => {
        console.log('LEAVE')
        releaseResizeStart()
        releaseResizeFinish()
        releaseBothSizeChange()
        setCoverEnable(false)
      }}
      onMouseMove={changePosition}
      onMouseDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left; //x position within the element

        if (startPositionEnable === 'start_enabled') {
          setStartPositionEnable('draggable')
          // setDeltaPosition({x: x / scale, y: 0})
          throttleStartPositionRef?.current(x / scale)
          captureResizeFinish()
        }

      }}
      onMouseUp={() => {
        console.log('UUUUPPP')
        releaseResizeStart()
        releaseResizeFinish()
        setCoverEnable(false)
      }}
      onDoubleClick={closeBothSelection}

      className={s['time-line_wraper']}>
      {coverEnable ?
        <div style={{position: 'absolute', height: timeLineHeight, width: '100%', backgroundColor: 'rgba(0,0,0,0.1'}}/>
        : null
      }
      <div
        className={s['time-line']}
        style={{
          width: width,
          pointerEvents: 'none'
        }}
      >
        <div
          className={s['time-show']}>
          {dividersTemplate}
        </div>
      </div>
      <div
        className={s['time-presenter']}
        style={{left: `${distance * scale}%`, transition: `left ${time}s linear`, transform: `scaleX(${1 / scale})`}}
      >
        <div className={s.line}
             style={{height: timeLineHeight}}
        />
        <div className={s['arrow-up']}/>
      </div>

      {(startPositionEnable === 'draggable' || startPositionEnable === 'drag_finished') ? <div
        className={s.line}
        onMouseDown={(event) => {
          event.stopPropagation()
          setCoverEnable(true)
          captureResizeStart()
          setShowContextMenu(false)
        }}
        onMouseUp={(event) => {
          event.stopPropagation()
          setCoverEnable(false)
          releaseResizeStart()
        }}
        style={{
          cursor: 'w-resize',
          // pointerEvents: 'none',
          position: 'absolute',
          // top: -timeLineHeight,
          height: timeLineHeight,
          left: `${currentStartPosition}%`,
          backgroundColor: 'red',
          width: 1 / scale,
          zIndex: 2,
          overflow: 'visible'
          // transform: `scaleX(${1 / scale})`
        }}
      >
        <div style={{
          position: 'absolute',
          padding: 1,
          bottom: 1,
          left: 1.5,
        }}>

        </div>
      </div> : null
      }

      {
        currentStartPosition !== undefined &&
        currentStopPosition !== undefined ?
          <div
            className={s.removablePart}
            style={{
              width: `${Math.abs(currentStopPosition - currentStartPosition)}%`,
              height: timeLineHeight,
              left: `${Math.min(currentStartPosition, currentStopPosition)}%`,
            }}
            onMouseMove={handleBothMove}
            onMouseDown={(event) => {
              event.stopPropagation()
              setShowContextMenu(false)
              if (event.nativeEvent.button === 2) {
                return
              }
              const rect = timeLineRef.current.getBoundingClientRect();
              bothSetPosition.current = event.clientX - rect.left;
              // bothSetPosition.current = event.clientX;
              setCoverEnable(true)
              captureBothSizeChange()
            }}
            onMouseUp={(event) => {
              event.stopPropagation()
              if (event.nativeEvent.button === 2) {
                openContextMenu(event)
                return
              }

              setCoverEnable(false)
              releaseBothSizeChange()
              releaseResizeStart()
              releaseResizeFinish()
            }}
          >
            <div style={{
              width: showContextMenu ? contextMenuSize.width : 0,
              height: showContextMenu ? contextMenuSize.height : 0,
              position: 'absolute',
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              zIndex: 3,
              transform: `scaleX(${1 / scale}) translate(${contextMenuPosition.swapX ? '-100%' : 0}, ${contextMenuPosition.swapY ? '-100%' : 0})`,
              transition: showContextMenu ? 'width 0.15s linear, height 0.15s linear' : 'width 0s linear, height 0s linear',
              overflow: 'hidden',
              boxShadow: '4px 4px 4px 4px rgba(34, 60, 80, 0.2)',
            }}>
              <ContextMenu
                closeContextMenu={closeContextMenu}
                selectMode={selectMode}
              />
            </div>
            {changeTimeModal ?
              <ClickOutHandler onClickOut={closeChangeTimeModal}>
                <div
                  style={{
                    zIndex: 3,
                    position: 'absolute',
                    left: changeTimeModalPosition.x,
                    top: changeTimeModalPosition.y,
                    transform: `scaleX(${1 / scale})`
                  }}
                >
                  <ChangeTimeForm
                    startTime={startTime}
                    endTime={stopTime}
                    changeStartTime={(value) => {
                      if (value >= 0) {
                        const currentStartPositionNew = value * 100 / allTime
                        setCurrentStartPosition(currentStartPositionNew)
                      }

                    }}
                    changeEndTime={(value) => {
                      if (value <= allTime) {
                        const currentEndPositionNew = value * 100 / allTime
                        setCurrentStopPosition(currentEndPositionNew)
                      }
                    }}
                  />
                </div>
              </ClickOutHandler>
              : null}

            <div
              style={{
                display: 'flex',
                width: '100%',
                // padding: 1.5,
                justifyContent: 'space-between',
                flexWrap: 'wrap-reverse',
              }}>
              <div onClick={openChangeTimeModal} style={{
                transform: `scaleX(${1 / scale})`
              }}>
                <span style={{fontSize: 11, color: 'white'}}>{startTime}</span>
              </div>
              <div onClick={openChangeTimeModal} style={{
                transform: `scaleX(${1 / scale})`,
                marginLeft: 'auto'
              }}>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  color: 'white'
                }}>{stopTime}</span>
              </div>
            </div>
          </div>
          : null
      }

      {(startPositionEnable === 'draggable' || startPositionEnable === 'drag_finished') ? <div
        onMouseDown={(event) => {
          event.stopPropagation()
          setCoverEnable(true)
          captureResizeFinish()
          setShowContextMenu(false)
        }}
        onMouseUp={(event) => {
          event.stopPropagation()
          setCoverEnable(false)
          releaseResizeFinish()
        }}

        className={s.line}
        style={{
          height: timeLineHeight,
          left: `${currentStopPosition}%`,
          // transform: `scaleX(${1 / scale})`,
          // pointerEvents: 'none',
          position: 'absolute',
          backgroundColor: 'blue',
          width: 1 / scale,
          zIndex: 2,
          cursor: 'w-resize',
        }}
      >
        <div style={{
          position: 'absolute',
          padding: 1,
          bottom: 1,
          right: 1.5,
        }}>
        </div>
      </div> : null
      }
    </div>
  )
}


export default TimeLineComponent

const PortalExample = () =>
{
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)}/>,
        document.body
      )}
    </>
  );
}

function ModalContent(
{
  onClose
}
)
{
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}


