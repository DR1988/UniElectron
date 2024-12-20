import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Props} from './ProcessSheetComponent';
import {ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, Point, TEXT_DRAW_OPT} from './CanvasTypes';
import {
  LEGEND_HEIGHT,
  LINE_GAP,
  LINE_HEIGHT,
  MAX_SCALE_FACTOR, MIN_CANVAS_WIDTH,
  RECT_HEIGHT,
  STEP,
  TIME_LINE_HEIGHT
} from './CanvasConstants';
import {
  ChangeElement, ContextMenu,
  Cover,
  DrawingElement,
  ELEMENT_TYPES,
  Line, ProcessSelection, SideCover, TimeLine, TimeView
} from './CanvasElements';
import throttle from 'lodash/throttle';
import {useElements} from './useElements';

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
    distance
  }
) => {
  const useAnimationFrame = true

  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + TIME_LINE_HEIGHT + LEGEND_HEIGHT


  const screenSpaceRef = useRef<CanvasRenderingContext2D | null>(null)

  const selectedElementRef = useRef<DrawingElement<ELEMENT_TYPES> | null>(null)
  const mouseWheelCoordinateRef = useRef(0)
  const elements = useRef<DrawingElement<ELEMENT_TYPES>[]>([])

  const moving = useRef(false)
  const offsetXRef = useRef(0)
  const scaleRef = useRef(1)
  const velocityRef = useRef(0)
  const timeLineOffsetRef = useRef(0)
  const startRef = useRef(false)
  const startTimeRef = useRef<Date | null>(null)
  const processSelection = useRef<ProcessSelection | null>(null)
  const contextMenu = useRef<ContextMenu | null>(null)

  // const [containerWidth, setContainerWidth] = useState(0)

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

    if (screenSpaceRef.current && containerRect) {
      velocityRef.current = containerRect.width / allTime /// 1000 // per ms
      if (process.env.NODE_ENV === 'development') {
        screenSpaceRef.current.canvas.width = Math.max(MIN_CANVAS_WIDTH, containerRect.width);
      } else {
        const maxWidth = window.screen.width - 420 - 95 // 400 - width of the left side with text area and 20 is a margin and 95 - left side with adding and valves names
        screenSpaceRef.current.canvas.width = Math.max(MIN_CANVAS_WIDTH, maxWidth);
      }
      screenSpaceRef.current.canvas.height = canvasHeight;
      // screenSpaceRef.current.canvas.style.width = `${containerRect.width}px`;
      // screenSpaceRef.current.canvas.style.height = `${canvasHeight}px`;

    }
  }, [container])


  const {
    elementsArray,
    processSelectionElement,
    contextMenuElement
  } = useElements(screenSpaceRef.current?.canvas?.width, screenSpaceRef.current, lineFormer, allTime)
  elements.current = elementsArray
  processSelection.current = processSelectionElement
  contextMenu.current = contextMenuElement

  const draw = useCallback(() => {
    if (!screenSpaceRef.current || !container) {
      return
    }

    screenSpaceRef.current.clearRect(0, 0, screenSpaceRef.current.canvas.width, screenSpaceRef.current.canvas.height)

    elements.current.forEach(element => {

      if (element.shouldSkipSizing) {
        element.drawElement()
        return
      }

      if (element instanceof SideCover && element.name === 'sideCoverLeft') {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-screenSpaceRef.current.canvas.width + offsetXRef.current, 0)
        // screenSpaceRef.current.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.current.restore()
        return
      }

      if (element instanceof SideCover && element.name === 'sideCoverRight') {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(screenSpaceRef.current.canvas.width / scaleRef.current + offsetXRef.current, 0)
        // screenSpaceRef.current.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.current.restore()
        return
      }

      if (element.type === 'COVER') {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(offsetXRef.current, 0)
        screenSpaceRef.current.scale(1 / scaleRef.current, 1)

        element.drawElement()
        screenSpaceRef.current.restore()

        return
      }

      if (element instanceof ChangeElement) {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)

        element.drawElement(scaleRef.current)

        screenSpaceRef.current.restore()
        return
      }

      if (element instanceof TimeLine) {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.current.restore()
        return
      }


      if (element instanceof TimeView) {
        screenSpaceRef.current.save()

        if (startRef.current) {
          if (screenSpaceRef.current.canvas.width >= timeLineOffsetRef.current) {
            const timeSpent = new Date().getTime() - startTimeRef.current.getTime()
            startTimeRef.current = new Date()
            timeLineOffsetRef.current += velocityRef.current * timeSpent / 1000
          }
        }

        screenSpaceRef.current.translate((-offsetXRef.current + timeLineOffsetRef.current) * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)

        element.drawElement(scaleRef.current)
        screenSpaceRef.current.restore()

        return
      }


      if (element instanceof ProcessSelection) {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.current.restore()
        return

      }

      if (element instanceof ContextMenu) {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.current.restore()
        return

      }

    })


  }, [container, lineFormer])

  useEffect(() => {
    if (!useAnimationFrame) {
      draw()
    }
  }, [screenSpaceRef.current, container, elements.current])

  const onPanMove = (event: React.MouseEvent) => {
    if (moving.current) {
      const newOffset = offsetXRef.current - (event.movementX) / scaleRef.current
      const scaledOffset = screenSpaceRef.current.canvas.width - screenSpaceRef.current.canvas.width / scaleRef.current

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
    // log('selectedElementRef', selectedElementRef.current)
    if (selectedElementRef.current instanceof TimeLine) {
      if (processSelection.current && !processSelection.current.widthSetIsComplete) {
        const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

        const width = worldX - processSelection.current.sizeOpt.xPosition
        processSelection.current.setWidth(width)
      }

      if (!useAnimationFrame) {
        draw()
      }
    }
  }

  const getSelectedElement = (point: Point): DrawingElement<ELEMENT_TYPES> | undefined => {

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

    }).sort((a, b) => b.order - a.order)

    return selectedElements[0]
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const rightClick = event.nativeEvent.button === 2
    // if (event.nativeEvent.button === 2) {
    //   return
    // }

    const clickOnContextMenu = contextMenu.current.isClickOnElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    contextMenu.current.clickedRadioElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    contextMenu.current.clickedCancel({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    const clickedRadio = contextMenu.current.clickedOk({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    console.log('clickedRadio', clickedRadio)
    // console.log('clickOnContextMenu', clickOnContextMenu)
    if (clickOnContextMenu) {
      // contextMenu.current.setStartPoint(0)
      // contextMenu.current.setShouldDraw(false)
      return
    } else {
      // contextMenu.current.setStartPoint(0)
      contextMenu.current.setShouldDraw(false)
    }

    moving.current = !rightClick && event.nativeEvent.offsetY < canvasHeight - LEGEND_HEIGHT;

    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    selectedElementRef.current?.returnDefaultColor()
    // const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

    if (!rightClick) {
      if (selectedElement instanceof ChangeElement) {
        selectedElementRef.current = selectedElement
        selectedElementRef.current.drawOpt.color = 'red'
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

      if (selectedElement instanceof Cover) {
        selectedElement.setDragging(true)
      }
    }

    if (selectedElement instanceof ProcessSelection) {
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)


      const {width, xPosition} = selectedElement.sizeOpt
      if (!rightClick && worldX >= xPosition && worldX <= xPosition + 3 / scaleRef.current) {
        selectedElement.setChangingLeftBorder(true)
        // screenSpaceRef.current.canvas.style.cursor = 'e-resize'
      } else if (!rightClick && worldX >= xPosition + width - 3 / scaleRef.current && worldX <= xPosition + width) {
        selectedElement.setChangingRightBorder(true)
        // screenSpaceRef.current.canvas.style.cursor = 'e-resize'
      } else {
        selectedElement.setFocusColor()

        if (rightClick) {
          contextMenu.current.setStartPoint({x:event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
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
      const rightBorder = screenSpaceRef.current.canvas.width - selectedElementRef.current.sizeOpt.width //- selectedElementRef.current.sizeOpt.width * scaleRef.current

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


          if (newWidth > 5 && worldX < xPosition + width - 5) {
            const startTime = Math.round(newOffset / screenSpaceRef.current.canvas.width * allTime)
            log('startTime', startTime)
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
        if (worldX >= xPosition && worldX <= xPosition + 3 / scaleRef.current) {
          screenSpaceRef.current.canvas.style.cursor = 'e-resize'
        } else if (worldX >= xPosition + width - 3 / scaleRef.current && worldX <= xPosition + width) {
          screenSpaceRef.current.canvas.style.cursor = 'e-resize'
        } else {
          screenSpaceRef.current.canvas.style.cursor = 'auto'
        }
      }

    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    // if (selectedElementRef.current) {
    //   log('selectedElementRef.current', selectedElementRef.current)
    // }
    if (!selectedElementRef.current) {
      onPanMove(event)
    }

    // debounce or throttle
    onProcessSelectionBorder(event)

    onCoverMove(event)

    onTimeLineMove(event)

    onProcessSelectionMove(event)
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
    const scaledOffset = screenSpaceRef.current.canvas.width - screenSpaceRef.current.canvas.width / scaleRef.current


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

    if (selectedElementRef.current instanceof ProcessSelection) {
      selectedElementRef.current.setIsMoving(false)
      selectedElementRef.current.setChangingLeftBorder(false)
      selectedElementRef.current.setChangingRightBorder(false)
    }
  }

  return <div><Canvas
    screenSpaceRef={screenSpaceRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleLeave}
    changeScale={changeScale}
    onDoubleClick={handleDoubleClick}
    draw={draw}
    useAnimationFrame={useAnimationFrame}
  />
    <span style={{display: 'block'}}>zoom: {1}</span>
    <span style={{display: 'block'}}>mouseWheelCoordinateRef.current: {mouseWheelCoordinateRef.current}</span>
    <button onClick={() => tryStart()}>Start Test</button>
    <button onClick={() => tryStop()}>Stop Test</button>
  </div>
}
