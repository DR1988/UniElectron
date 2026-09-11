import React, {CSSProperties, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {TemporaryFileLoaded, TemporaryProtocolButtonPosition, ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, DrawingElement, ELEMENT_TYPES, Point, TEXT_DRAW_OPT} from './CanvasElements/CanvasTypes';
import {
  AUTO_PAN_MARGIN,
  AUTO_PAN_STEP,
  DPR,
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
import { ThemeContext } from '../../../Main/Context';

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
  captureProtocol: (protocol: "" | TemporaryProtocolButtonPosition) => void
  capturedProtocol: TemporaryProtocolButtonPosition | ''
  setProtocol: (name: TemporaryProtocolButtonPosition) => void
  screenSpaceWidth: number
  setScreenSpaceRefWidth: (value: number) => void
  onScaleChange?: (scale: number) => void
  // reports whether the dragged captured protocol fits at the current cursor position
  onCaptureFitChange?: (fits: boolean) => void
  // applies a captured protocol inserted into the free gap of the current sheet
  insertCapturedProtocol?: (lineFormer: Array<ValveLineType>) => void
  // the dragged preview element - its actual position defines the insertion point
  capturedProtocolElement?: React.MutableRefObject<HTMLDivElement | null>
  // tells the parent that the insert-time modal opened/closed (keeps the preview alive while open)
  onInsertModalToggle?: (open: boolean) => void
}


const log = throttle(console.log, 500)
const log2 = throttle(console.log, 500)
const log3 = throttle(console.log, 500)

// splits a total duration in seconds into hours / minutes / seconds strings
const decomposeToHMS = (totalSeconds: number) => ({
  hours: String(Math.floor(totalSeconds / 3600)),
  minutes: String(Math.floor((totalSeconds % 3600) / 60)),
  seconds: String(totalSeconds % 60),
})

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
    changeTime,
    captureProtocol,
    capturedProtocol,
    setProtocol,
    screenSpaceWidth,
    setScreenSpaceRefWidth,
    onScaleChange,
    onCaptureFitChange,
    insertCapturedProtocol,
    capturedProtocolElement,
    onInsertModalToggle,
  }
) => {

  const {theme} = useContext(ThemeContext)

  const useAnimationFrame = true

  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + TIME_LINE_HEIGHT + LEGEND_HEIGHT

  const [screenSpaceRef, setScreenSpaceRef] = useState<CanvasRenderingContext2D | null>(null)
  // const [screenSpaceWidth, setScreenSpaceRefWidth] = useState(0)


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
  const returnAnimationFrameRef = useRef<number | null>(null)
  const returnAnimatingElementRef = useRef<ChangeElement | null>(null)
  const changeTimeRef = useRef<HTMLDivElement | null>(null)
  const showCoordTimeRef = useRef<HTMLDivElement | null>(null) // удали - просто для отладки
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
    //https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
    const fixFont = false
    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if(screenSpaceRef && containerRect) {
          for (const entry of entries) {
            const containerWidth = entry.contentBoxSize[0].inlineSize
            velocityRef.current = containerWidth / allTime /// 1000 // per ms
            let width = 0
            if (process.env.NODE_ENV === 'development') {
              width = Math.max(MIN_CANVAS_WIDTH, containerWidth);
            } else {
              const maxWidth = window.screen.width - 420 - 95 // 400 - width of the left side with text area and 20 is a margin and 95 - left side with adding and valves names
              width = Math.max(MIN_CANVAS_WIDTH, maxWidth);
            }

            if (fixFont) {

              // Get the size of the canvas in CSS pixels.
              // Give the canvas pixel dimensions of their CSS
              // size * the device pixel ratio.
              screenSpaceRef.canvas.width = width * DPR;
              screenSpaceRef.canvas.height = canvasHeight * DPR;
              screenSpaceRef.canvas.style.width = width + "px";
              screenSpaceRef.canvas.style.height = canvasHeight + "px";
              // var ctx = screenSpaceRef.canvas.getContext('2d');
              // Scale all drawing operations by the dpr, so you
              // don't have to worry about the difference.
              screenSpaceRef.scale(DPR, DPR);
            } else {
              screenSpaceRef.canvas.width = width
              screenSpaceRef.canvas.height = canvasHeight;
            }

            setScreenSpaceRefWidth(width)

          }
        }
      });
    });
    resizeObserver.observe(container)


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
      if (fixFont) {
        // Get the size of the canvas in CSS pixels.
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        screenSpaceRef.canvas.width = width * DPR;
        screenSpaceRef.canvas.height = canvasHeight * DPR;
        screenSpaceRef.canvas.style.width = width + "px";
        screenSpaceRef.canvas.style.height = canvasHeight + "px";
        // var ctx = screenSpaceRef.canvas.getContext('2d');
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        screenSpaceRef.scale(DPR, DPR);
      } else {
        screenSpaceRef.canvas.width = width
        screenSpaceRef.canvas.height = canvasHeight;
      }

      setScreenSpaceRefWidth(width)

    }

    return () => resizeObserver.disconnect()
  }, [container, canvasHeight, screenSpaceRef, allTime])

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
        element.drawElement(scaleRef.current, theme)
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

        element.drawElement(scaleRef.current, theme)
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
  }, [screenSpaceRef, lineFormer, isMovement, theme])

  useEffect(() => {
    if (!useAnimationFrame) {
      draw()
    }
  }, [screenSpaceRef, container, elements.current])

  // pan - moving the sheet itself
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

  // move cover inside legend under the main sheet
  const onCoverMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof Cover && selectedElementRef.current.isDragging && container) {
      const {sizeOpt: {width}, deltaX} = selectedElementRef.current
      const containerRect = container.getBoundingClientRect()
      const xPositon = event.clientX - containerRect.left; //x position within the element.

      const newOffsetX = xPositon - deltaX; //offsetXRef.current + event.movementX
      offsetXRef.current = Math.max(0, Math.min(newOffsetX, width - width / scaleRef.current))

      // can be optimized - check for change coordinate
      if (!useAnimationFrame) {
        draw()
      }
    }
  }

  // making a time selection to make some changes
  const onTimeLineMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof TimeLine) {
      if (processSelection.current && !processSelection.current.widthSetIsComplete) {
        const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

        const width = worldX - processSelection.current.sizeOpt.xPosition
        if (width > 1) {
          processSelection.current.setWidth(width)
          processSelection.current.setVaryingWidth(width)
          // processSelection.current.setStartPoint(processSelection.current.sizeOpt.xPosition)
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

    // a new interaction must not fight with an in-progress return animation
    cancelReturnAnimation()

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
        processSelection.current.resetToDefault();
        setChosenValveTime(selectedElement.Data.lineId, +selectedElement.Data.changeElement.changeId)
        selectedElementRef.current = selectedElement
        const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)
        const {worldX: initialXposiitonWorldX} =screenToWorld(selectedElementRef.current.initialXPosition, 0)
        const deltaX = worldX - initialXposiitonWorldX
        selectedElement.setDeltaX(deltaX)
        selectedElement.setOrder(2)
        
        elements.current.sort((a, b) => {
          if (a instanceof ChangeElement && b instanceof ChangeElement) {
            return a.order - b.order
          }
        })

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
          processSelection.current.setOriginStartPoint(worldX)
        }

        selectedElementRef.current = selectedElement

      }

      if (selectedElement instanceof Cover && !isMovement) {
        selectedElement.setDragging(true)
        const containerRect = container.getBoundingClientRect()
        const xPositon = event.clientX - containerRect.left; //x position within the element.
        selectedElement.setDeltaX(xPositon - offsetXRef.current)
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
      // grab offset in world units: keeps the move calculation correct while auto-panning
      selectedElement.setDeltaX(worldX - xPosition)
    }

  }

  // moving time selection move
  const onProcessSelectionMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof ProcessSelection && selectedElementRef.current.isMoving) {

      const element = selectedElementRef.current
      const canvasWidth = screenSpaceRef.canvas.width
      const xPosition = event.nativeEvent.offsetX

      // auto-pan when the mouse is close to a canvas edge so the selection can be dragged
      // all the way to the sheet border even when zoomed in (no-op at scale 1: maxOffset is 0)
      const maxOffset = canvasWidth - canvasWidth / scaleRef.current
      if (xPosition > canvasWidth - AUTO_PAN_MARGIN) {
        offsetXRef.current = Math.min(maxOffset, offsetXRef.current + AUTO_PAN_STEP / scaleRef.current)
      } else if (xPosition < AUTO_PAN_MARGIN) {
        offsetXRef.current = Math.max(0, offsetXRef.current - AUTO_PAN_STEP / scaleRef.current)
      }

      const {worldX} = screenToWorld(xPosition, 0)
      const targetX = worldX - element.deltaX

      // clamp to the sheet bounds: the selection sticks to the border instead of stopping short
      const rightBorder = canvasWidth - element.sizeOpt.width
      element.setStartPoint(Math.max(0, Math.min(rightBorder, targetX)))
    }
  }

  const onProcessSelectionBorder = (event: React.MouseEvent) => {
    if (processSelection.current) {

      const {width, xPosition} = processSelection.current.sizeOpt
      const {originStartPoint, varyingWidth} = processSelection.current
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, varyingWidth)

      const containerRect = container.getBoundingClientRect()
      const xMousePosition = event.clientX - containerRect.left;

      if (processSelection.current.changingLeftBorder || processSelection.current.changingRightBorder) {

        if (processSelection.current.changingLeftBorder) {
          const offset = originStartPoint -  worldX
          const newWidth = varyingWidth + offset
          if (newWidth > 5 && worldX < xPosition + width - 5 && xMousePosition >= 0) {
            processSelection.current.setStartPoint(worldX)
            processSelection.current.setWidth(newWidth)
          }
        }

        if (processSelection.current.changingRightBorder) {
          const newWidth = worldX - originStartPoint

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

  // ===== captured protocol drag & drop: fit check and insertion into the free gap =====

  const captureFitsRef = useRef(true)

  // sheet time of the preview's LEFT EDGE: the preview is centered on the cursor, so reading
  // its actual rendered position (not the mouse) keeps the check in sync with what is visible
  const getDropTime = (): number | null => {
    const ghost = capturedProtocolElement?.current
    if (!ghost) {
      return null
    }
    const ghostRect = ghost.getBoundingClientRect()
    const canvasRect = screenSpaceRef.canvas.getBoundingClientRect()
    const leftEdgeScreenX = ghostRect.left - canvasRect.left
    const {worldX} = screenToWorld(leftEdgeScreenX, 0)
    // whole seconds only - times are integers everywhere else in the sheet
    return Math.max(0, Math.min(allTime, Math.round(worldX * allTime / screenSpaceRef.canvas.width)))
  }

  // the free space on one line from time T until the next change; -1 if T falls inside a change
  const getFreeSpaceFrom = (line: ValveLineType, time: number): number => {
    let nextStart = allTime
    for (const ch of line.changes) {
      if (ch.startTime < time && ch.endTime > time) {
        return -1
      }
      if (ch.startTime >= time && ch.startTime < nextStart) {
        nextStart = ch.startTime
      }
    }
    return nextStart - time
  }

  const getProtocolDataBySlot = (slot: TemporaryProtocolButtonPosition) => {
    const data = JSON.parse(window.localStorage.getItem(slot)) as TemporaryFileLoaded | null
    return data ? data.protocol : null
  }

  const getCapturedProtocolData = () => {
    if (!capturedProtocol) {
      return null
    }
    return getProtocolDataBySlot(capturedProtocol)
  }

  // the protocol occupies [T, T + capturedAllTime] and fits if that range is free on every line
  const isCapturedProtocolFits = (time: number, capturedAllTime: number): boolean => {
    for (const line of lineFormer) {
      if (getFreeSpaceFrom(line, time) < capturedAllTime) {
        return false
      }
    }
    return true
  }

  // splices the captured protocol's changes into the gap at time T on each matching line;
  // the gap is guaranteed to be large enough, so nothing shifts and allTime stays unchanged
  const insertCapturedProtocolAt = (time: number, slot: TemporaryProtocolButtonPosition) => {
    const captured = getProtocolDataBySlot(slot)
    if (!captured || !insertCapturedProtocol) {
      return
    }

    const newLineFormer = lineFormer.map(line => {
      const capturedLine = captured.lineFormer.find(cl => cl.shortName === line.shortName)
      if (!capturedLine || !capturedLine.changes.length) {
        return line
      }

      let maxId = 0
      for (const ch of line.changes) {
        if (typeof ch.changeId === 'number' && ch.changeId > maxId) {
          maxId = ch.changeId
        }
      }

      // shift the captured timeline so it starts at T and give the changes fresh unique ids
      const inserted = capturedLine.changes.map((ch, i) => ({
        ...ch,
        startTime: ch.startTime + time,
        endTime: ch.endTime + time,
        changeId: maxId + i + 1
      }))

      return {...line, changes: [...line.changes, ...inserted].sort((a, b) => a.startTime - b.startTime)}
    })

    insertCapturedProtocol(newLineFormer)
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

    // move cover inside legend under the main sheet
    onCoverMove(event)

    // making a time selection to make some changes
    onTimeLineMove(event)

    // moving time selection move
    onProcessSelectionMove(event)

    onChangeElementHover(event)

    onTimeElementsHover(event)

    onMoveChangeElement(event)
    // onTimShow(event) // для отладки

    // while dragging a captured protocol, report whether it fits at the current position
    // (skipped while the insert-time modal is open - the preview is pinned to its time)
    if (capturedProtocol && onCaptureFitChange && !pendingInsert) {
      const captured = getCapturedProtocolData()
      const time = getDropTime()
      if (captured && time !== null) {
        const fits = isCapturedProtocolFits(time, captured.allTime)
        if (fits !== captureFitsRef.current) {
          captureFitsRef.current = fits
          onCaptureFitChange(fits)
        }
      }
    }
  }

  // moving time selection move
  const onMoveChangeElement = (event: React.MouseEvent) => {

    if (selectedElementRef.current instanceof ChangeElement ) {
      const currentElement = selectedElementRef.current

      currentElement.setIsMoving(true)
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)
      const {deltaX, sizeOpt: {width: currentElementWidth}} = currentElement
      let newOffsetX = worldX - deltaX;

      // clamp the NEW position to the canvas bounds: with a fast mouse the target
      // can jump past the border in one frame, so checking the old position is not enough
      const rightBorder = screenSpaceRef.canvas.width - currentElementWidth
      if (newOffsetX < 0) {
        newOffsetX = 0
        currentElement.setOverBound('left')
      } else if (newOffsetX > rightBorder) {
        newOffsetX = rightBorder
        currentElement.setOverBound('right')
      } else {
        currentElement.setOverBound(null)
      }

      for (const element of elements.current) {
        if (element === currentElement) continue
        if (element instanceof ChangeElement && currentElement.isMoving) {
          const {yPosition, xPosition, width} = element.sizeOpt
          if (yPosition === currentElement.sizeOpt.yPosition) {
            if (
                xPosition < newOffsetX && xPosition + width > newOffsetX ||
                xPosition > newOffsetX  && xPosition < newOffsetX + currentElementWidth
            ) {
              currentElement.setColor('red')
              currentElement.setIsCollide(true)
              break
            } else {
              currentElement.setDefaultColor()
              currentElement.setIsCollide(false)
            }
          }
        }
      }
      currentElement.setStartPoint(newOffsetX)
    }
  }


  const onTimShow = (event: React.MouseEvent) => {
      setTimeShowPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY + 10})
  }

  // smoothly returns a collided element to its last valid position
  const animateReturnToInitialPosition = (element: ChangeElement) => {
    const fromX = element.sizeOpt.xPosition
    const toX = element.initialXPosition
    if (fromX === toX) {
      return
    }

    const duration = 250
    const animationStart = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - animationStart) / duration)
      const easedProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      element.setStartPoint(fromX + (toX - fromX) * easedProgress)

      if (progress < 1) {
        returnAnimationFrameRef.current = requestAnimationFrame(step)
      } else {
        element.setStartPoint(toX)
        returnAnimationFrameRef.current = null
        returnAnimatingElementRef.current = null
      }
    }

    cancelReturnAnimation()
    returnAnimatingElementRef.current = element
    returnAnimationFrameRef.current = requestAnimationFrame(step)
  }

  const cancelReturnAnimation = () => {
    if (returnAnimationFrameRef.current !== null) {
      cancelAnimationFrame(returnAnimationFrameRef.current)
      returnAnimationFrameRef.current = null
    }
    // do not leave the element frozen in an intermediate position
    if (returnAnimatingElementRef.current) {
      returnAnimatingElementRef.current.setStartPoint(returnAnimatingElementRef.current.initialXPosition)
      returnAnimatingElementRef.current = null
    }
  }

  useEffect(() => () => cancelReturnAnimation(), [])


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
      const {worldX} = screenToWorld(event.nativeEvent.offsetX, 0)

      if (selectedElementRef.current instanceof ProcessSelection) {

        selectedElementRef.current.setIsMoving(false)
        selectedElementRef.current.setChangingLeftBorder(false)
        selectedElementRef.current.setChangingRightBorder(false)
        processSelection.current.setOriginStartPoint(processSelection.current.sizeOpt.xPosition )
        processSelection.current.setVaryingWidth(processSelection.current.sizeOpt.width )

      } else if (selectedElement instanceof ProcessSelection) {

        selectedElement.setIsMoving(false)
        selectedElement.setChangingLeftBorder(false)
        selectedElement.setChangingRightBorder(false)
      }

    } 

    // dropping the captured protocol: if it fits, open a modal to fine-tune the insertion time
    if (capturedProtocol) {
      const captured = getCapturedProtocolData()
      const time = getDropTime()
      if (captured && time !== null && isCapturedProtocolFits(time, captured.allTime)) {
        setInsertTimeInputs(decomposeToHMS(time))
        setInsertModalPosition({x: event.nativeEvent.offsetX + 5, y: event.nativeEvent.offsetY + 10})
        setPendingInsert({slot: capturedProtocol})
        // keep the preview visible while the modal is open (before containerForm clears the capture)
        onInsertModalToggle?.(true)
      }
    }
    console.log('selectedElementRef.current',selectedElementRef.current)
    if (selectedElementRef.current instanceof ChangeElement) {
      if (!selectedElementRef.current.isMoving) {
        showModal()
        if (!useAnimationFrame) {
          draw()
        }
      } else {
        const isCollide = selectedElementRef.current.getIsCollide()
        selectedElementRef.current.setOrder(1)
        selectedElementRef.current.setIsMoving(false)
        screenSpaceRef.canvas.style.cursor = 'default'
        selectedElementRef.current.setDefaultColor()
        if (!isCollide) {
          selectedElementRef.current.setInitialXPosition(selectedElementRef.current.sizeOpt.xPosition)
          const canvasWidth = screenSpaceRef.canvas.width
          const startTime = Math.max(0, Math.min(allTime, Math.round(selectedElementRef.current.sizeOpt.xPosition *  allTime / canvasWidth * DPR)))
          const endTime = Math.max(startTime, Math.min(allTime, Math.round((selectedElementRef.current.sizeOpt.xPosition + selectedElementRef.current.sizeOpt.width) *  allTime / canvasWidth * DPR)))

          changeTime(startTime, endTime)
        } else {
          selectedElementRef.current.setInitialXPosition(selectedElementRef.current.initialXPosition)
          animateReturnToInitialPosition(selectedElementRef.current)
        }
        selectedElementRef.current = null

      }
    }

    if (!selectedElement) {
      selectedElementRef.current = null
    }
  }

  const handleDoubleClick = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement === undefined) {
      processSelection.current?.resetToDefault()
    }

    if (selectedElement instanceof TimeLine) {
      processSelection.current?.resetToDefault()
    }
  }

  const handleClick = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

console.log('offsetXRef.current * scaleRef.current + event.nativeEvent.offsetX', offsetXRef.current * scaleRef.current + event.nativeEvent.offsetX)
    const isClickedOnTime = processSelection.current.clickedOnTime({
      x: offsetXRef.current * scaleRef.current + event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    })

    if (selectedElement instanceof ChangeElement) {
      processSelection.current?.resetToDefault()
    }

    if (isClickedOnTime) {
      setStartTime(processSelection.current.startTime)
      setEndTime(processSelection.current.endTime)
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
    if (onScaleChange) {
      onScaleChange(scale)
    }

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
      processSelection.current.setOriginStartPoint(processSelection.current.sizeOpt.xPosition)

      processSelection.current.setIsMoving(false)
      processSelection.current.setChangingLeftBorder(false)
      processSelection.current.setChangingRightBorder(false)
      processSelection.current.setWidthSetIsComplete(true)
    }

    if (selectedElementRef.current instanceof ChangeElement) {
      selectedElementRef.current.setIsMoving(false)
      const isCollide = selectedElementRef.current.getIsCollide()
      
       if (selectedElementRef.current.overBound && !isCollide) {
          if (selectedElementRef.current.overBound === 'left') {
            selectedElementRef.current.setInitialXPosition(0)
            const endTime = Math.round(selectedElementRef.current.sizeOpt.width *  allTime / screenSpaceRef.canvas.width * DPR)
            changeTime(0, endTime)
          } else {
            const xposition = screenSpaceRef.canvas.width - selectedElementRef.current.sizeOpt.width
            selectedElementRef.current.setInitialXPosition(xposition)
            const startTime = Math.abs(Math.round(xposition *  allTime / screenSpaceRef.canvas.width * DPR))
            changeTime(startTime, allTime)
          }
         
          selectedElementRef.current.setOverBound(null)
        } else if (!isCollide) {
          selectedElementRef.current.setInitialXPosition(selectedElementRef.current.sizeOpt.xPosition)
          const canvasWidth = screenSpaceRef.canvas.width
          const startTime = Math.max(0, Math.min(allTime, Math.round(selectedElementRef.current.sizeOpt.xPosition *  allTime / canvasWidth * DPR)))
          const endTime = Math.max(startTime, Math.min(allTime, Math.round((selectedElementRef.current.sizeOpt.xPosition + selectedElementRef.current.sizeOpt.width) *  allTime / canvasWidth * DPR)))
          changeTime(startTime, endTime)
        } else {
          selectedElementRef.current.setDefaultColor()
          selectedElementRef.current.setInitialXPosition(selectedElementRef.current.initialXPosition)
          animateReturnToInitialPosition(selectedElementRef.current)
        }
      selectedElementRef.current = null
    }

  }

  const [changeTimeModal, setChangeTimeModal] = useState(false)
  const [changeTimeVisibility, setChangeTimeVisibility] = useState<CSSProperties['visibility']>('hidden')
  const [changeTimeModalPosition, setChangeTimeModalPosition] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0,
  })

  const [changeTimeShowPosition, setTimeShowPosition] = useState<{ x: number, y: number }>({ // удали - просто для отладки
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

  // ===== insert-protocol modal: fine-tune the drop time before merging =====

  const [pendingInsert, setPendingInsert] = useState<{slot: TemporaryProtocolButtonPosition} | null>(null)
  const [insertTimeInputs, setInsertTimeInputs] = useState({hours: '0', minutes: '0', seconds: '0'})
  const [insertModalPosition, setInsertModalPosition] = useState<{x: number, y: number}>({x: 0, y: 0})

  const handleInsertFieldChange = (field: 'hours' | 'minutes' | 'seconds') => (e: React.FormEvent<HTMLInputElement>) => {
    // minutes/seconds: empty falls back to 0, a leading zero is dropped on input ("05" -> "5")
    const rawValue = (field === 'minutes' || field === 'seconds')
      ? String(+e.currentTarget.value)
      : e.currentTarget.value

    // minutes/seconds cannot exceed 59: reject the keystroke entirely
    if (field === 'minutes' || field === 'seconds') {
      if (!/^\d{1,2}$/.test(rawValue) || +rawValue > 59) {
        return
      }
    }

    setInsertTimeInputs({...insertTimeInputs, [field]: rawValue})
  }

  const getInsertTime = (): number | null => {
    const {hours, minutes, seconds} = insertTimeInputs
    if (/^\d+$/.test(hours) && /^\d+$/.test(minutes) && /^\d+$/.test(seconds)) {
      return +hours * 3600 + +minutes * 60 + +seconds
    }
    return null
  }

  const pendingInsertFits = (): boolean => {
    if (!pendingInsert) {
      return false
    }
    const captured = getProtocolDataBySlot(pendingInsert.slot)
    const time = getInsertTime()
    return !!captured && time !== null && isCapturedProtocolFits(time, captured.allTime)
  }

  const confirmInsert = () => {
    if (!pendingInsert || !pendingInsertFits()) {
      return
    }
    insertCapturedProtocolAt(getInsertTime() as number, pendingInsert.slot)
    setPendingInsert(null)
    onInsertModalToggle?.(false)
  }

  const cancelInsert = () => {
    setPendingInsert(null)
    onInsertModalToggle?.(false)
  }

  // while the modal is open, pin the preview to the time chosen in it (left edge at that time)
  useEffect(() => {
    if (!pendingInsert) {
      return
    }
    const ghost = capturedProtocolElement?.current
    const time = getInsertTime()
    if (!ghost || time === null) {
      return
    }

    const worldX = time * screenSpaceRef.canvas.width / allTime
    const {screenX} = worldToScreen(worldX, 0)
    // shift the ghost by the delta to its target viewport X - works for any containing block
    const oldLeft = parseFloat(ghost.style.left) || 0
    const canvasRect = screenSpaceRef.canvas.getBoundingClientRect()
    const delta = canvasRect.left + screenX - ghost.getBoundingClientRect().left
    ghost.style.left = `${oldLeft + delta}px`

    // reflect the fit at the chosen time in the preview color
    const captured = getProtocolDataBySlot(pendingInsert.slot)
    if (captured && onCaptureFitChange) {
      const fits = isCapturedProtocolFits(time, captured.allTime)
      if (fits !== captureFitsRef.current) {
        captureFitsRef.current = fits
        onCaptureFitChange(fits)
      }
    }
  }, [pendingInsert, insertTimeInputs])

  return <div style={{position: 'relative'}}>
    <Canvas
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
                const newXPosition = value / allTime * screenSpaceRef.canvas.width / DPR
                const xPositionDelta = xPosition - newXPosition
                const newWidth = width + xPositionDelta
                setStartTime(value)
                processSelection.current.setStartPoint(newXPosition)
                processSelection.current.setWidth(newWidth)
                processSelection.current.setVaryingWidth(newWidth)

              }
            }}

            changeEndTime={(value) => {
              if (value >= 0) {
                const {width, xPosition} = processSelection.current.sizeOpt
                const newXPosition = value / allTime * screenSpaceRef.canvas.width / DPR
                console.log('newXPositionnewXPositionnewXPosition', )
                const newWidth = newXPosition - xPosition
                setEndTime(value)
                processSelection.current.setWidth(newWidth)
                processSelection.current.setVaryingWidth(newWidth)
              }
            }}
          />
        </div>
      </ClickOutHandler>
      : null}

    {pendingInsert ?
      <ClickOutHandler onClickOut={cancelInsert}>
        <div
          style={{
            zIndex: 4,
            position: 'absolute',
            left: insertModalPosition.x,
            top: insertModalPosition.y,
            boxShadow: '4px 4px 4px 4px rgba(34, 60, 80, 0.2)',
            backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <span style={{marginBottom: 8}}>Insert protocol at time:</span>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
            <input
              type='number'
              value={insertTimeInputs.hours}
              onChange={handleInsertFieldChange('hours')}
              style={{width: 50, marginRight: 4}}
            /> h
            <input
              type='number'
              value={insertTimeInputs.minutes}
              onChange={handleInsertFieldChange('minutes')}
              style={{width: 50, margin: '0 4px'}}
            /> m
            <input
              type='number'
              value={insertTimeInputs.seconds}
              onChange={handleInsertFieldChange('seconds')}
              style={{width: 50, marginLeft: 4}}
            /> s
          </div>
          {!pendingInsertFits() && (
            <span style={{color: 'red', marginBottom: 8}}>The protocol does not fit at this time</span>
          )}
          <div style={{display: 'flex', gap: 8}}>
            <button onClick={confirmInsert} disabled={!pendingInsertFits()}>OK</button>
            <button onClick={cancelInsert}>Cancel</button>
          </div>
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

{/* ДЛЯ ОТЛАДКИ */}
    {/* <div
      ref={showCoordTimeRef}
      style={{
        // visibility: changeTimeVisibility,
        zIndex: 3,
        position: 'absolute',
        color:'white',
        left: changeTimeShowPosition.x,
        top: changeTimeShowPosition.y,
        boxShadow: '4px 4px 4px 4px rgba(34, 60, 80, 0.2)',
      }}
        >
      <div>Time: {(screenSpaceRef ? changeTimeShowPosition.x * allTime / screenSpaceRef.canvas.width * DPR : 0).toFixed(1)}</div>
      <div>Xcoord: { changeTimeShowPosition.x}</div>

      <div>Time: {(screenSpaceRef ? screenToWorld(changeTimeShowPosition.x, 0).worldX* allTime / screenSpaceRef.canvas.width * DPR : 0).toFixed(1)}</div>
      <div>coordOWrldx: {screenToWorld(changeTimeShowPosition.x, 0).worldX.toFixed(2)}</div>
    </div> */}

    <button onClick={() => tryStart()}>Start Test</button>
    <button onClick={() => tryStop()}>Stop Test</button>
  </div>
}
