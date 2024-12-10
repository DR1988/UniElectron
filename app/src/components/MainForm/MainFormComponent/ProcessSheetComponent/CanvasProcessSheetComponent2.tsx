import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Props} from './ProcessSheetComponent';
import {ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, Point, TEXT_DRAW_OPT} from './CanvasTypes';
import {
  LEGEND_HEIGHT,
  LINE_GAP,
  LINE_HEIGHT,
  MAX_SCALE_FACTOR,
  RECT_HEIGHT,
  STEP,
  TIME_LINE_HEIGHT
} from './CanvasConstants';
import {
  ChangeElement,
  Cover,
  DrawingElement,
  ELEMENT_TYPES,
  Line, SideCover, TimeLine
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
    allTime
  }
) => {
  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + TIME_LINE_HEIGHT + LEGEND_HEIGHT


  const screenSpaceRef = useRef<CanvasRenderingContext2D | null>(null)

  const selectedElementRef = useRef<DrawingElement<ELEMENT_TYPES> | null>(null)
  const mouseWheelCoordinateRef = useRef(0)
  const elements = useRef<DrawingElement<ELEMENT_TYPES>[]>([])

  const moving = useRef(false)
  const offsetXRef = useRef(0)
  const scaleRef = useRef(1)

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

  useLayoutEffect(() => {
    const containerRect = container?.getBoundingClientRect()
    if (screenSpaceRef.current && containerRect) {
      screenSpaceRef.current.canvas.width = containerRect.width;
      screenSpaceRef.current.canvas.height = canvasHeight;
      // screenSpaceRef.current.canvas.style.width = `${containerRect.width}px`;
      // screenSpaceRef.current.canvas.style.height = `${canvasHeight}px`;

    }
  }, [container])


  useElements(container, screenSpaceRef.current, lineFormer, allTime, elements.current)

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
      }

      if (element instanceof TimeLine) {
        screenSpaceRef.current.save()
        screenSpaceRef.current.translate(-offsetXRef.current * scaleRef.current, 0)
        screenSpaceRef.current.scale(scaleRef.current, 1)
        element.drawElement(scaleRef.current)
        screenSpaceRef.current.restore()

      }
    })


  }, [container, lineFormer])

  useLayoutEffect(() => {
    draw()
  }, [screenSpaceRef.current, container])

  const onPanMove = (event: React.MouseEvent) => {
    if (moving.current) {
      const newOffset = offsetXRef.current - (event.movementX) / scaleRef.current
      const scaledOffset = screenSpaceRef.current.canvas.width - screenSpaceRef.current.canvas.width / scaleRef.current

      if (newOffset > scaledOffset || newOffset < 0) {
        return
      }

      offsetXRef.current = newOffset

      draw()
    }
  }

  const onCoverMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof Cover && selectedElementRef.current.isDragging) {
      const {width} = selectedElementRef.current.sizeOpt

      const newOffsetX = offsetXRef.current + event.movementX


      offsetXRef.current = Math.min(Math.max(0, newOffsetX), width - width / scaleRef.current)

      // can be optimized - check for change coordinate
      draw()
    }
  }

  const getSelectedElement = (point: Point): DrawingElement<ELEMENT_TYPES> | undefined => {
    const selectedElement = elements.current.find((element, index) => {
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

    })

    // if (selectedElement) {
    //   selectedElementRef.current = selectedElement
    // }

    // if (selectedElement) {
    //   if (selectedElement.type === 'COVER') {
    //     selectedElementRef.current?.returnDefaultColor()
    //     selectedElementRef.current = selectedElement
    //     selectedElementRef.current.drawOpt.color = 'rgba(0, 0, 0, 0.1)'
    //   } else {
    //     selectedElementRef.current?.returnDefaultColor()
    //     selectedElementRef.current = selectedElement
    //     selectedElementRef.current.drawOpt.color = 'red'
    //   }
    //
    //   draw()
    // }

    return selectedElement
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    moving.current = event.nativeEvent.offsetY < canvasHeight - LEGEND_HEIGHT;

    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    if (selectedElement instanceof ChangeElement) {
      selectedElementRef.current?.returnDefaultColor()
      selectedElementRef.current = selectedElement
      selectedElementRef.current.drawOpt.color = 'red'
      draw()
    } else if (selectedElement instanceof Cover) {
      selectedElementRef.current?.returnDefaultColor()
      selectedElementRef.current = selectedElement
      selectedElementRef.current.drawOpt.color = 'rgba(0, 0, 0, 0.1)'
      draw()
    }

    if (selectedElement instanceof Cover) {
      selectedElement.setDragging(true)
    }

  }

  const handleMouseMove = (event: React.MouseEvent) => {
    onPanMove(event)

    onCoverMove(event)
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    moving.current = false

    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement instanceof Cover) {
      selectedElement.setDragging(false)
    } else if (selectedElementRef.current instanceof Cover) {
      selectedElementRef.current.setDragging(false)
    }

    if (selectedElement !== selectedElementRef.current) {
      selectedElementRef.current.returnDefaultColor()
      draw()
    }

  }

  const scaleOnScreenSpace = (event: React.WheelEvent) => {
    const {worldX: worldXBeforeZoom, worldWidthX: worldWidthXBeforeZoom} = screenToWorld(event.nativeEvent.offsetX, 0)
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

    draw()
  }

  const changeScale = (event: React.WheelEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})


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
  }

  return <div><Canvas
    screenSpaceRef={screenSpaceRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleLeave}
    changeScale={changeScale}
    // draw={draw}
  />
    <span style={{display: 'block'}}>zoom: {1}</span>
    <span style={{display: 'block'}}>mouseWheelCoordinateRef.current: {mouseWheelCoordinateRef.current}</span>
  </div>
}
