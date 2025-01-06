import React, {CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Props} from './ProcessSheetComponent';
import {ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, DrawingElement, ELEMENT_TYPES, Point, TEXT_DRAW_OPT} from './CanvasElements/CanvasTypes';
import {
  LEGEND_HEIGHT,
  LINE_GAP,
  LINE_HEIGHT,
  MAX_SCALE_FACTOR, MIN_CANVAS_WIDTH,
  RECT_HEIGHT,
  STEP,
  TIME_LINE_HEIGHT
} from './CanvasConstants';

import throttle from 'lodash/throttle';
import {useElements} from './useElements';
import {ChangeTimeForm} from './TimeLineComponent/ChangeTimeForm';
import ClickOutHandler from 'react-onclickout'
import {
  ProcessSelection,
  ContextMenu,
  HoverLine,
  ChangeElement,
  TimeLine,
  TimeView,
  SideCover,
  Cover,
  Line
} from './CanvasElements';
import {Options} from './Options/Options';

export type Props = {
  distance: number,
  time: number,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  lineFormer: Array<ValveLineType>,
  changeTime: (startTime: number, endTime: number) => void
  addNewValveTime: (chosenLine: ValveLineType) => void,
  removeSelectedTimeElements: (startTime: number, endTime: number, mode: RemoveSpaceOption) => void
  container: HTMLDivElement | null
}


const log = throttle(console.log, 500)
const log2 = throttle(console.log, 500)
const log3 = throttle(console.log, 500)

export const CanvasProcessSheetComponent2: React.FC<Props> = (
  {
    container,
    lineFormer,
    allTime,
    time,
    distance,
    showModal,
    setChosenValveTime,
    removeSelectedTimeElements,
  }
) => {

  const useAnimationFrame = true

  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + TIME_LINE_HEIGHT + LEGEND_HEIGHT

  const [screenSpaceRef, setScreenSpaceRef] = useState<CanvasRenderingContext2D | null>(null)
  const [screenSpaceWidth, setScreenSpaceRefWidth] = useState(0)


  const selectedElementRef = useRef<DrawingElement<ELEMENT_TYPES> | null>(null)
  const mouseWheelCoordinateRef = useRef(0)
  const elements = useRef<DrawingElement<ELEMENT_TYPES>[]>([])
  const elementsSorted = useRef<DrawingElement<ELEMENT_TYPES>[]>([])

  const moving = useRef(false)
  const offsetXRef = useRef(0)
  const scaleRef = useRef(1)
  const velocityRef = useRef(0)
  const timeLineOffsetRef = useRef(0)
  const startRef = useRef(false)
  const startTimeRef = useRef<Date | null>(null)
  const processSelection = useRef<ProcessSelection | null>(null)
  const contextMenu = useRef<ContextMenu | null>(null)
  const hoverLine = useRef<HoverLine | null>(null)
  const changeTimeRef = useRef<HTMLDivElement | null>(null)
  const timeLineOffset = useRef<number>(100)

  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [isOptionsOpen, toggleOptions] = useState(false)
  const [isMovement, setMovement] = useState(false)

  const tryStart = () => {
    startRef.current = true
    startTimeRef.current = new Date();
  }

  const tryStop = () => {
    startRef.current = false
    timeLineOffsetRef.current = 0
  }

  const worldToScreen = (worldX: number, width: number): {
    screenX: number
    screenWidthX: number
  } => {
    return {
      screenX: (worldX - offsetXRef.current) * scaleRef.current,
      screenWidthX: width * scaleRef.current
    }
  }

  const screenToWorld = (screenX: number, width: number): {
    worldX: number
    worldWidthX: number
  } => {
    return {
      worldX: screenX / scaleRef.current + offsetXRef.current,
      worldWidthX: width / scaleRef.current
    }
  }

  useEffect(() => {
    const containerRect = container?.getBoundingClientRect()

    if (screenSpaceRef && containerRect) {
      velocityRef.current = containerRect.width / allTime /// 1000 // per ms
      let width = 0
      if (process.env.NODE_ENV === 'development') {
        width = Math.max(MIN_CANVAS_WIDTH, containerRect.width);
      } else {
        const maxWidth = window.screen.width - 420 - 95 // 400 - width of the left side with text area and 20 is a margin and 95 - left side with adding and valves names
        width = Math.max(MIN_CANVAS_WIDTH, maxWidth);
      }
      setScreenSpaceRefWidth(width)
      screenSpaceRef.canvas.width = width
      screenSpaceRef.canvas.height = canvasHeight;

    }
  }, [container, canvasHeight, screenSpaceRef])

  useEffect(() => {
    if (processSelection.current?.sizeOpt?.xPosition) {
      const startTime = Math.round(processSelection.current.sizeOpt.xPosition / screenSpaceRef.canvas.width * allTime)
      const endTime = Math.round((processSelection.current.sizeOpt.xPosition + processSelection.current.sizeOpt.width) / screenSpaceRef.canvas.width * allTime)

      setStartTime(startTime)
      setEndTime(endTime)
    }

  }, [allTime, processSelection.current?.sizeOpt?.xPosition, processSelection.current?.sizeOpt?.width])


  const {
    elementsArray,
    processSelectionElement,
    contextMenuElement,
    hoverLineElement
  } = useElements(screenSpaceWidth, screenSpaceRef, lineFormer, allTime)

  elements.current = elementsArray
  processSelection.current = processSelectionElement
  contextMenu.current = contextMenuElement
  hoverLine.current = hoverLineElement
  const draw = useCallback(() => {
    if (!screenSpaceRef) {
      return
    }

    screenSpaceRef.clearRect(0, 0, screenSpaceRef.canvas.width, screenSpaceRef.canvas.height)

    elements.current.forEach(element => {

      if (element.shouldSkipSizing) {
        element.drawElement()
        return
      }

      if (element instanceof SideCover && element.name === 'sideCoverLeft') {
        screenSpaceRef.save()
        screenSpaceRef.translate(-screenSpaceRef.canvas.width + offsetXRef.current, 0)
        // screenSpaceRef.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.restore()
        return
      }

      if (element instanceof SideCover && element.name === 'sideCoverRight') {
        screenSpaceRef.save()
        screenSpaceRef.translate(screenSpaceRef.canvas.width / scaleRef.current + offsetXRef.current, 0)
        // screenSpaceRef.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.restore()
        return
      }

      if (element.type === 'COVER') {
        screenSpaceRef.save()
        screenSpaceRef.translate(offsetXRef.current, 0)
        screenSpaceRef.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.restore()

        return
      }

      if (element instanceof ChangeElement) {
        screenSpaceRef.save()
        screenSpaceRef.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)

        element.drawElement(scaleRef.current)

        screenSpaceRef.restore()
        return
      }

      if (element instanceof TimeLine) {
        screenSpaceRef.save()
        screenSpaceRef.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.restore()
        return
      }


      if (element instanceof TimeView) {
        screenSpaceRef.save()

        if (startRef.current) {
          if (screenSpaceRef.canvas.width >= timeLineOffsetRef.current) {
            const timeSpent = new Date().getTime() - startTimeRef.current.getTime()
            startTimeRef.current = new Date()
            timeLineOffsetRef.current += velocityRef.current * timeSpent / 1000
            const offset = timeLineOffset.current / scaleRef.current

            const isLarger = screenSpaceRef.canvas.width * (1 - 1 / scaleRef.current) > timeLineOffsetRef.current - offset
            if (isMovement && (timeLineOffsetRef.current > offset && isLarger || offsetXRef.current > timeLineOffsetRef.current)) {
              offsetXRef.current = Math.max(0, timeLineOffsetRef.current - offset)
            }
          }
        }

        screenSpaceRef.translate((-offsetXRef.current + timeLineOffsetRef.current) * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)

        element.drawElement(scaleRef.current)
        screenSpaceRef.restore()

        return
      }


      if (element instanceof ProcessSelection) {
        screenSpaceRef.save()
        screenSpaceRef.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.restore()
        return

      }

      if (element instanceof ContextMenu) {
        screenSpaceRef.save()
        screenSpaceRef.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.restore()
        return

      }

      if (element instanceof HoverLine) {
        screenSpaceRef.save()
        screenSpaceRef.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.restore()

        return
      }

    })


  }, [screenSpaceRef, lineFormer, isMovement])

  useEffect(() => {
    if (!useAnimationFrame) {
      draw()
    }
  }, [screenSpaceRef, container, elements.current])

  const onPanMove = (event: React.MouseEvent) => {
    if (moving.current) {
      const newOffset = offsetXRef.current - (event.movementX) / scaleRef.current
      const scaledOffset = screenSpaceRef.canvas.width - screenSpaceRef.canvas.width / scaleRef.current

      if (newOffset > scaledOffset || newOffset < 0) {
        return
      }

      offsetXRef.current = newOffset

      if (!useAnimationFrame) {
        draw()
      }
    }
  }

  const onCoverMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof Cover && selectedElementRef.current.isDragging) {
      const {width} = selectedElementRef.current.sizeOpt

      const newOffsetX = offsetXRef.current + event.movementX


      offsetXRef.current = Math.min(Math.max(0, newOffsetX), width - width / scaleRef.current)

      // can be optimized - check for change coordinate
      if (!useAnimationFrame) {
        draw()
      }
    }
  }

  const onTimeLineMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof TimeLine) {
      if (processSelection.current && !processSelection.current.widthSetIsComplete) {
        const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

        const width = worldX - processSelection.current.sizeOpt.xPosition
        if (width > 1) {
          processSelection.current.setWidth(width)
        }

      }

      if (!useAnimationFrame) {
        draw()
      }
    }
  }

  const getSelectedElement = (point: Point): DrawingElement<ELEMENT_TYPES> | undefined => {

    // elementsSorted.current = elements.current.slice().sort((a, b) => a.order - b.order)

    const selectedElements = elements.current.filter((element, index) => {
      const {sizeOpt: {yPosition, xPosition, width, height}, drawOpt} = element
      const {worldX} = screenToWorld(point.x, 0)

      if (element.type === 'CHANGE_ELEMENT') {

        return point.y >= yPosition && point.y <= yPosition + height &&
          worldX >= xPosition && worldX <= xPosition + width
          && element.selectable
      }

      if (element.type === 'COVER') {
        return point.y >= yPosition && point.y <= yPosition + height &&
          point.x >= xPosition + offsetXRef.current && point.x <= xPosition + offsetXRef.current + width / scaleRef.current
          && element.selectable
      }

      if (element instanceof TimeLine) {
        return point.y >= yPosition && point.y <= yPosition + height && element.selectable
      }

      if (element instanceof ProcessSelection) {
        return point.y >= yPosition && point.y <= yPosition + height &&
          worldX >= xPosition && worldX <= xPosition + width && element.selectable
      }

      if (element instanceof ContextMenu) {
        return element.isClickOnElement(point)
        // point.y >= yPosition && point.y <= yPosition + height &&
        //   worldX >= xPosition && worldX <= xPosition + width && element.selectable
      }

    }).sort((a, b) => b.order - a.order)

    return selectedElements[0]
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const rightClick = event.nativeEvent.button === 2
    // if (event.nativeEvent.button === 2) {
    //   return
    // }

    const clickOnContextMenu = contextMenu.current.isClickOnElement({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    })
    contextMenu.current.clickedRadioElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    contextMenu.current.clickedCancel({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    const clickedRadio = contextMenu.current.clickedOk({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (clickedRadio) {
      const startTime = Math.round(processSelection.current.sizeOpt.xPosition / screenSpaceRef.canvas.width * allTime)
      const endTime = Math.round((processSelection.current.sizeOpt.xPosition + processSelection.current.sizeOpt.width) / screenSpaceRef.canvas.width * allTime)

      removeSelectedTimeElements(startTime, endTime, clickedRadio)
      contextMenu.current.setShouldDraw(false)
    }

    if (clickOnContextMenu) {
      return
    } else {
      contextMenu.current.setShouldDraw(false)
    }

    moving.current = !rightClick && event.nativeEvent.offsetY < canvasHeight - LEGEND_HEIGHT;

    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    selectedElementRef.current?.returnDefaultColor()
    // const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

    if (!rightClick) {
      if (selectedElement instanceof ChangeElement) {
        selectedElementRef.current = selectedElement
        showModal()
        setChosenValveTime(selectedElement.Data.lineId, +selectedElement.Data.changeElement.changeId)
        if (!useAnimationFrame) {
          draw()
        }
      } else if (selectedElement instanceof Cover) {
        selectedElementRef.current?.returnDefaultColor()
        selectedElementRef.current = selectedElement
        selectedElementRef.current.drawOpt.color = 'rgba(0, 0, 0, 0.1)'
        if (!useAnimationFrame) {
          draw()
        }
      }

      if (selectedElement instanceof TimeLine) {

        if (processSelection.current.sizeOpt.width === 0) {

          const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)
          processSelection.current.setStartPoint(worldX)
        }

        selectedElementRef.current = selectedElement

      }

      if (selectedElement instanceof Cover && !isMovement) {
        selectedElement.setDragging(true)
      }
    }

    if (selectedElement instanceof ProcessSelection) {
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)


      const {width, xPosition} = selectedElement.sizeOpt
      if (!rightClick && worldX >= xPosition && worldX <= xPosition + 3 / scaleRef.current) {
        selectedElement.setChangingLeftBorder(true)
        selectedElement.setFocusColor()
        // screenSpaceRef.canvas.style.cursor = 'e-resize'
      } else if (!rightClick && worldX >= xPosition + width - 3 / scaleRef.current && worldX <= xPosition + width) {
        selectedElement.setChangingRightBorder(true)
        selectedElement.setFocusColor()
        // screenSpaceRef.canvas.style.cursor = 'e-resize'
      } else {
        selectedElement.setFocusColor()

        if (rightClick) {
          contextMenu.current.setStartPoint({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
          contextMenu.current.setShouldDraw(true)
        } else {
          selectedElement.setIsMoving(true)
        }

      }

      selectedElementRef.current = selectedElement

    }

  }

  const onProcessSelectionMove = (event: React.MouseEvent) => {
    // log('selectedElementRef', selectedElementRef.current, selectedElementRef.current.isMoving)
    if (selectedElementRef.current instanceof ProcessSelection && selectedElementRef.current.isMoving) {
      const newOffset = selectedElementRef.current.sizeOpt.xPosition + (event.movementX) / scaleRef.current
      const rightBorder = screenSpaceRef.canvas.width - selectedElementRef.current.sizeOpt.width //- selectedElementRef.current.sizeOpt.width * scaleRef.current

      if (newOffset > rightBorder || newOffset < 0) {
        return
      }
      selectedElementRef.current.setStartPoint(newOffset)
    }
  }

  const onProcessSelectionBorder = (event: React.MouseEvent) => {
    if (processSelection.current) {
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

      const {width, xPosition} = processSelection.current.sizeOpt

      if (processSelection.current.changingLeftBorder || processSelection.current.changingRightBorder) {
        if (processSelection.current.changingLeftBorder) {
          const offset = event.movementX / scaleRef.current
          const newOffset = xPosition + offset

          const newWidth = width - offset


          if (newWidth > 5 && worldX < xPosition + width - 5 && newOffset >= 0) {
            processSelection.current.setStartPoint(newOffset)
            processSelection.current.setWidth(newWidth)
          }

        }
        if (processSelection.current.changingRightBorder) {
          const offset = event.movementX / scaleRef.current
          const newWidth = width + offset

          if (newWidth > 5 && worldX > xPosition + 5) {
            processSelection.current.setWidth(newWidth)
          }
        }

      } else {
        if (worldX >= xPosition && worldX <= xPosition + 3 / scaleRef.current && event.nativeEvent.offsetY <= canvasHeight - LEGEND_HEIGHT + 2) {
          screenSpaceRef.canvas.style.cursor = 'e-resize'
        } else if (worldX >= xPosition + width - 3 / scaleRef.current && worldX <= xPosition + width && event.nativeEvent.offsetY <= canvasHeight - LEGEND_HEIGHT + 2) {
          screenSpaceRef.canvas.style.cursor = 'e-resize'
        } else {
          screenSpaceRef.canvas.style.cursor = 'auto'
        }
      }

    }
  }

  const onChangeElementHover = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    if (selectedElement instanceof ChangeElement) {
      hoverLine.current.setStart(selectedElement.initialXPosition)
      hoverLine.current.setWidth(selectedElement.initialWidth)
      hoverLine.current.setShouldShow(true)
      screenSpaceRef.canvas.style.cursor = 'pointer'
    } else {
      hoverLine.current.setShouldShow(false)
    }
  }

  const onTimeElementsHover = (event: React.MouseEvent) => {
    const hoveredOnTime = processSelection.current.clickedOnTime({
      x: offsetXRef.current * scaleRef.current + event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    })

    if (hoveredOnTime) {
      screenSpaceRef.canvas.style.cursor = 'pointer'
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    // if (selectedElementRef.current) {
    //   log('selectedElementRef.current', selectedElementRef.current)
    // }
    // const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    if (!selectedElementRef.current) {
      onPanMove(event)
    }

    // debounce or throttle
    onProcessSelectionBorder(event)

    onCoverMove(event)

    onTimeLineMove(event)

    onProcessSelectionMove(event)

    onChangeElementHover(event)

    onTimeElementsHover(event)
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    moving.current = false

    if (event.nativeEvent.button === 2) {
      return
    }

    let selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement instanceof Cover) {
      selectedElement.setDragging(false)
    } else if (selectedElementRef.current instanceof Cover) {
      selectedElementRef.current.setDragging(false)
    }

    if (selectedElementRef.current && selectedElement !== selectedElementRef.current) {
      selectedElementRef.current?.returnDefaultColor()
      if (!useAnimationFrame) {
        draw()
      }
    }

    if (selectedElementRef.current instanceof TimeLine) {
      const processSelectionElement = processSelection.current
      if (processSelectionElement && !processSelectionElement.widthSetIsComplete && processSelectionElement.sizeOpt.width !== 0) {
        processSelectionElement.setWidthSetIsComplete(true)
      }

      selectedElementRef.current = null
    }

    if (selectedElement instanceof ProcessSelection || selectedElementRef.current instanceof ProcessSelection) {
      if (selectedElementRef.current instanceof ProcessSelection) {
        selectedElementRef.current.setIsMoving(false)
        selectedElementRef.current.setChangingLeftBorder(false)
        selectedElementRef.current.setChangingRightBorder(false)
      } else if (selectedElement instanceof ProcessSelection) {
        selectedElement.setIsMoving(false)
        selectedElement.setChangingLeftBorder(false)
        selectedElement.setChangingRightBorder(false)
      }

    }

    if (!selectedElement) {
      selectedElementRef.current = null
    }
  }

  const handleDoubleClick = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement instanceof TimeLine) {
      processSelection.current?.resetToDefault()
    }
  }

  const handleClick = (event: React.MouseEvent) => {

    const isClickedOnTime = processSelection.current.clickedOnTime({
      x: offsetXRef.current * scaleRef.current + event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    })
    if (isClickedOnTime) {
      setChangeTimeModalPosition({x: event.nativeEvent.offsetX + 5, y: event.nativeEvent.offsetY + 10})
      setChangeTimeModal(true)
    }
  }

  const scaleOnScreenSpace = (event: React.WheelEvent) => {
    const {worldX: worldXBeforeZoom} = screenToWorld(event.nativeEvent.offsetX, 0)
    const dir = Math.sign(-event.deltaY)

    const scale = Math.max(1, Math.min(MAX_SCALE_FACTOR, scaleRef.current + dir * STEP))

    if (scaleRef.current === scale) {
      return
    }

    scaleRef.current = scale

    const {worldX: worldXAfterZoom} = screenToWorld(event.nativeEvent.offsetX, 0)
    const newOffset = (offsetXRef.current + worldXBeforeZoom - worldXAfterZoom)
    const scaledOffset = screenSpaceRef.canvas.width - screenSpaceRef.canvas.width / scaleRef.current


    if (newOffset > scaledOffset) {
      offsetXRef.current = scaledOffset // right border
    } else if (newOffset < 0) { // left border
      offsetXRef.current = 0
    } else {
      offsetXRef.current = newOffset
    }
    if (!useAnimationFrame) {
      draw()
    }
  }

  const changeScale = (event: React.WheelEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    contextMenu.current.setShouldDraw(false)

    if (event.nativeEvent.offsetY > canvasHeight - LEGEND_HEIGHT && !(selectedElement instanceof Cover)) {

      return
    }

    if (selectedElement instanceof Cover && selectedElement.isDragging) {

      return
    }

    scaleOnScreenSpace(event)
  }

  const handleLeave = () => {
    moving.current = false

    if (selectedElementRef.current instanceof Cover) {
      selectedElementRef.current.setDragging(false)
    }

    if (selectedElementRef.current instanceof ProcessSelection || selectedElementRef.current instanceof TimeLine) {
      processSelection.current.setIsMoving(false)
      processSelection.current.setChangingLeftBorder(false)
      processSelection.current.setChangingRightBorder(false)
      processSelection.current.setWidthSetIsComplete(true)
    }
  }

  const [changeTimeModal, setChangeTimeModal] = useState(false)
  const [changeTimeVisibility, setChangeTimeVisibility] = useState<CSSProperties['visibility']>('hidden')
  const [changeTimeModalPosition, setChangeTimeModalPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0,
  })

  const closeChangeTimeModal = useCallback(() => {
    setChangeTimeModal(false)
  }, [])

  useEffect(() => {
    if (changeTimeRef.current) {
      const canvasRect = screenSpaceRef.canvas.getBoundingClientRect()
      const changeTimeRect = changeTimeRef.current.getBoundingClientRect()
      if (canvasRect && changeTimeRect) {
        if (changeTimeRect.right < canvasRect.right) {
          setChangeTimeVisibility('visible')
        } else {
          setChangeTimeModalPosition({x: canvasRect.right - changeTimeRect.width - 20, y: changeTimeModalPosition.y})
          setChangeTimeVisibility('visible')
        }
      }
    }
  }, [changeTimeModal])

  return <div style={{position: 'relative'}}><Canvas
    screenSpaceRef={screenSpaceRef}
    setScreenSpaceRef={setScreenSpaceRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onClick={handleClick}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleLeave}
    changeScale={changeScale}
    onDoubleClick={handleDoubleClick}
    draw={draw}
    useAnimationFrame={useAnimationFrame}
  />
    {changeTimeModal ?
      <ClickOutHandler onClickOut={closeChangeTimeModal}>
        <div
          ref={changeTimeRef}
          style={{
            visibility: changeTimeVisibility,
            zIndex: 3,
            position: 'absolute',
            left: changeTimeModalPosition.x,
            top: changeTimeModalPosition.y,
            boxShadow: '4px 4px 4px 4px rgba(34, 60, 80, 0.2)',
          }}
        >
          <ChangeTimeForm
            allTime={allTime}
            startTime={startTime}
            endTime={endTime}
            changeStartTime={(value) => {
              if (value >= 0) {
                const {width, xPosition} = processSelection.current.sizeOpt
                const newXPosition = value / allTime * screenSpaceRef.canvas.width
                const xPositionDelta = xPosition - newXPosition
                const newWidth = width + xPositionDelta
                setStartTime(value)
                processSelection.current.setStartPoint(newXPosition)
                processSelection.current.setWidth(newWidth)

              }
            }}

            changeEndTime={(value) => {
              if (value >= 0) {
                const {width, xPosition} = processSelection.current.sizeOpt
                const newXPosition = value / allTime * screenSpaceRef.canvas.width
                const newWidth = newXPosition - xPosition
                setEndTime(value)
                processSelection.current.setWidth(newWidth)
              }
            }}
          />
        </div>
      </ClickOutHandler>
      : null}
    <ClickOutHandler onClickOut={() => toggleOptions(false)}>
      <Options
        toggleOptions={toggleOptions}
        setMovement={setMovement}
        isOptionsOpen={isOptionsOpen}
        isMovement={isMovement}
      />
    </ClickOutHandler>
    <button onClick={() => tryStart()}>Start Test</button>
    <button onClick={() => tryStop()}>Stop Test</button>
  </div>
}
