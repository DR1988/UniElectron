import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Props} from './ProcessSheetComponent';
import {ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, Point, TEXT_DRAW_OPT} from './CanvasTypes';
import {LEGEND_HEIGHT, LINE_GAP, LINE_HEIGHT, MAX_SCALE_FACTOR, RECT_HEIGHT, STEP} from './CanvasConstants';
import {
  ChangeElement,
  Cover,
  DrawingElement,
  ELEMENT_TYPES,
  Line
} from './CanvasElements';

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

export const CanvasProcessSheetComponent: React.FC<Props> = (
  {
    container,
    lineFormer,
    allTime
  }
) => {
  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + LEGEND_HEIGHT


  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const scalesOffsetXRef = useRef<number>(0)
  const zoomRef = useRef<number>(1)
  const userOffsetRef = useRef<number>(0)


  const selectedElementRef = useRef<DrawingElement<ELEMENT_TYPES> | null>(null)
  const mouseWheelCoordinateRef = useRef(0)
  const currentTransformedCursor = useRef<DOMPoint>({x: 0, y: 0, w: 0, z: 0})

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState(0)

  const elements = useRef<DrawingElement<ELEMENT_TYPES>[]>([])

  useLayoutEffect(() => {
    const containerRect = container?.getBoundingClientRect()
    if (contextRef.current && containerRect) {
      contextRef.current.canvas.width = containerRect.width;
      contextRef.current.canvas.height = canvasHeight;
      contextRef.current.canvas.style.width = `${containerRect.width}px`;
      contextRef.current.canvas.style.height = `${canvasHeight}px`;
    }
  }, [container])

  useLayoutEffect(() => {
    const containerRect = container?.getBoundingClientRect()
    if (contextRef.current && containerRect) {

      lineFormer.forEach((lf, index) => {
        elements.current.push(new Line({
            ctx: contextRef.current,
            sizeOpt: {
              width: containerRect.width,
              xPosition: 0,
              yPosition: 5 * (index + 1) + 30 * index,
              height: RECT_HEIGHT
            },
            drawOpt: {
              color: `rgba(209, 216, 209, 0.5)`,
              shouldSkipSizing: true,
            },

          }),
          new Line({
            ctx: contextRef.current,
            sizeOpt: {
              width: containerRect.width,
              xPosition: 0,
              yPosition: canvasHeight - LEGEND_HEIGHT + 2 * (index + 1) + 5 * index,
              height: 5
            },
            drawOpt: {
              color: `rgba(209, 216, 209, 0.5)`,
              shouldSkipSizing: true
            }
          }))
      })

      lineFormer.forEach((lf, index) => {
        lf.changes.forEach(change => {
          const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
          const duration = endTime - startTime
          const width = containerRect.width * duration / allTime
          const xPosition = containerRect.width * startTime / allTime

          elements.current.push(new ChangeElement({
              ctx: contextRef.current,
              sizeOpt: {
                width: width,
                xPosition: xPosition,
                yPosition: 5 * (index + 1) + 30 * index,
                height: RECT_HEIGHT
              },
              drawOpt: {
                color: 'rgba(171, 193, 197, 1)',
                text: value || duration,
                selectable: true
              }
            }),
            new ChangeElement({
              ctx: contextRef.current,
              sizeOpt: {
                width: width,
                xPosition: xPosition,
                yPosition: canvasHeight - LEGEND_HEIGHT + 2 * (index + 1) + 5 * index,
                height: 5
              },
              drawOpt: {
                color: 'rgba(171, 193, 197, 1)',
                shouldSkipSizing: true
              },
            })
          )
        })
      })


      const cover = new Cover({
          ctx: contextRef.current,
          sizeOpt: {
            width: containerRect.width,
            xPosition: 0,
            yPosition: canvasHeight - LEGEND_HEIGHT + 2,
            height: LEGEND_HEIGHT
          },
          drawOpt: {
            // shouldSkipSizing: true,
            selectable: true
          }
        }
      )

      elements.current.push(cover)

    }

  }, [container])


  // centring
  const draw = useCallback(() => {
    if (!contextRef.current || !container) {
      return
    }
    // console.log('DRAW')

    const scaledWidth = contextRef.current.canvas.width * zoomRef.current
    // const scalesOffsetX = (scaledWidth - contextRef.current.canvas.width) / 2
    // console.log('DRAW userOffsetRef.current', userOffsetRef.current)
    scalesOffsetXRef.current = (scaledWidth - contextRef.current.canvas.width) / 2 + userOffsetRef.current

    contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)

    elements.current.forEach(element => {

      if (element.shouldSkipSizing) {
        element.drawElement(zoomRef.current)
        return
      }

      if (element.type === 'COVER') {

        contextRef.current.save()
        // const scaledPosition = contextRef.current.canvas.width * ((zoomRef.current - 1) / zoomRef.current / 2)
        // contextRef.current.translate(scaledPosition, 0)
        // contextRef.current.scale(1/zoomRef.current, 1)
        // console.log('-----')
        // console.log('contextRef.current.canvas.width', contextRef.current.canvas.width)
        // element.sizeOpt.width = contextRef.current.canvas.width / zoomRef.current
        // console.log('element.sizeOpt.width', element.sizeOpt.width)
        // console.log('contextRef.current.canvas.width * ((zoomRef.current - 1) / zoomRef.current / 2)', contextRef.current.canvas.width * ((zoomRef.current - 1) / zoomRef.current / 2))
        // console.log('SUM', element.sizeOpt.width + contextRef.current.canvas.width * ((zoomRef.current - 1) / zoomRef.current / 2))
        // console.log('element.sizeOpt.xPosition - scalesOffsetXRef.current', contextRef.current.canvas.width)
        // element.sizeOpt.xPosition = element.sizeOpt.width - element.sizeOpt.xPosition + contextRef.current.canvas.width

        // element.sizeOpt.xPosition =  contextRef.current.canvas.width * ((zoomRef.current - 1) / zoomRef.current / 2)
        element.drawElement(zoomRef.current)
        contextRef.current.restore()

        return
      }



      contextRef.current.save()
      contextRef.current.translate(-scalesOffsetXRef.current, 0)
      contextRef.current.scale(zoomRef.current, 1)
      element.drawElement(zoomRef.current)

      contextRef.current.restore()
    })

  }, [container, lineFormer])

  useLayoutEffect(() => {
    // console.log('DRAW')
    draw()
  }, [contextRef.current, container])

  const getTransformedPoint = (x: number, y: number) => {
    const originalPoint = new DOMPoint(x, y);

    return contextRef.current?.getTransform().invertSelf().transformPoint(originalPoint);
  }

  const prevREfx = useRef(0)
  const handleMouseMove = (event: React.MouseEvent) => {
    if (selectedElementRef.current instanceof Cover && selectedElementRef.current.isDragging) {
      const {xPosition, width, height, yPosition} = selectedElementRef.current.sizeOpt
      // console.log('movementX', event.movementX)

      selectedElementRef.current.sizeOpt.xPosition =
        Math.min(Math.max(0, selectedElementRef.current.sizeOpt.xPosition + event.movementX), contextRef.current.canvas.width - selectedElementRef.current.sizeOpt.width)


      // if (selectedElementRef.current.sizeOpt.xPosition < 25) {
      //
      //   console.log('xPosition', selectedElementRef.current.sizeOpt.xPosition)
      // }
      //
      // if (scalesOffsetXRef.current + event.movementX * zoomRef.current < 25) {
      //   console.log('userOffsetRef', scalesOffsetXRef.current + event.movementX * zoomRef.current)
      // }

      // console.log(selectedElementRef.current.sizeOpt.xPosition)
      if (scalesOffsetXRef.current + event.movementX * zoomRef.current > 0 &&
        scalesOffsetXRef.current + (event.movementX + width) * zoomRef.current < contextRef.current.canvas.width * zoomRef.current) {
        userOffsetRef.current += event.movementX * zoomRef.current
      }

      // if (selectedElementRef.current.sizeOpt.xPosition < 59 && zoomRef.current === 3) {
      //   console.log('userOffsetRef.current', userOffsetRef.current)
      //   console.log('selectedElementRef.current.sizeOpt.xPosition', selectedElementRef.current.sizeOpt.xPosition)
      // }
      //
      // if (selectedElementRef.current.sizeOpt.xPosition < 29 && zoomRef.current === 4) {
      //   console.log('userOffsetRef.current', userOffsetRef.current)
      //   console.log('selectedElementRef.current.sizeOpt.xPosition', selectedElementRef.current.sizeOpt.xPosition)
      // }
      //
      // if (selectedElementRef.current.sizeOpt.xPosition < 19 && zoomRef.current === 5) {
      //   console.log('userOffsetRef.current', userOffsetRef.current)
      //   console.log('selectedElementRef.current.sizeOpt.xPosition', selectedElementRef.current.sizeOpt.xPosition)
      // }


      // const diff = contextRef.current.canvas.width * (zoomRef.current - 1) / 2
      // userOffsetRef.current = selectedElementRef.current.sizeOpt.xPosition - width * (zoomRef.current - 1)/2

      draw()
    }
  }


  const changeScale = (event: React.WheelEvent) => {

    const dir = Math.sign(-event.deltaY)
    const zoomed = Math.max(1, Math.min(MAX_SCALE_FACTOR, zoomRef.current + dir * STEP))

    if (zoomRef.current === zoomed) {
      return
    }

    zoomRef.current = zoomed
    // setZoom(pz => Math.max(1, Math.min(MAX_SCALE_FACTOR, pz + dir * STEP)))
    console.log('zoomRef.current', zoomRef.current)

    elements.current.forEach(element => {
      if (element.type === 'COVER') {
        console.log('-----')

        const centralPoint = element.sizeOpt.xPosition + element.sizeOpt.width / 2
        element.sizeOpt.width = contextRef.current.canvas.width / zoomRef.current
        // console.log(' element.sizeOpt.width', element.sizeOpt.width)
        // console.log('zoomRef.current', zoomRef.current)
        // console.log('centralPoint - element.sizeOpt.width / 2', centralPoint - element.sizeOpt.width / 2)
        console.log('centralPoint - element.sizeOpt.width / 2', centralPoint - element.sizeOpt.width / 2)
        element.sizeOpt.xPosition = Math.min(Math.max(0, centralPoint - element.sizeOpt.width / 2), contextRef.current.canvas.width - element.sizeOpt.width)
        console.log('centralPoint', centralPoint)
        // console.log('element.sizeOpt.xPosition', element.sizeOpt.xPosition)
        console.log('userOffsetRef.current', userOffsetRef.current)
        console.log('element.sizeOpt.xPosition', element.sizeOpt.xPosition)
        userOffsetRef.current = userOffsetRef.current + (dir * userOffsetRef.current / ((zoomRef.current - 1) || 1))
        if (userOffsetRef.current === 0) {
          userOffsetRef.current = -element.sizeOpt.width / 2
        }
        // userOffsetRef.current = userOffsetRef.current  + (dir * userOffsetRef.current / ((zoomRef.current - 1) || 1))
        // userOffsetRef.current = userOffsetRef.current  + (dir * userOffsetRef.current / zoomRef.current)
        console.log('userOffsetRef.current AFTER', userOffsetRef.current)

        if (zoomRef.current === 3) {
          console.log('userOffsetRef.current', userOffsetRef.current)
          console.log(' element.sizeOpt.xPosition', element.sizeOpt.xPosition)
        }
        if (zoomRef.current === 4) {
          console.log('userOffsetRef.current', userOffsetRef.current)
          console.log(' element.sizeOpt.xPosition', element.sizeOpt.xPosition)
        }
        if (zoomRef.current === 5) {
          console.log('userOffsetRef.current', userOffsetRef.current)
          console.log(' element.sizeOpt.xPosition', element.sizeOpt.xPosition)
        }

        return
      }

    })

    draw()
    // event.preventDefault();
  }

  const getSelectedElement = (point: Point) => {
    const selectedElements = elements.current.filter((element, index) => {
      const {sizeOpt: {yPosition, xPosition, width, height}, drawOpt} = element

      if (element.type === 'CHANGE_ELEMENT') {
        // if (element.drawOpt.text?.toString() === '36') {
        //   console.log('point.x', point.x, xPosition * zoomRef.current)
        // }
        return point.y >= yPosition && point.y <= yPosition + height &&
          point.x + scalesOffsetXRef.current >= xPosition * zoomRef.current && point.x + scalesOffsetXRef.current <= (xPosition + width) * zoomRef.current
          && element.selectable
      }

      if (element.type === 'COVER') {
        return point.y >= yPosition && point.y <= yPosition + height &&
          point.x >= xPosition && point.x <= xPosition + width
          && element.selectable
      }

      return false
    })

    const selectedElement = selectedElements[0]

    if (selectedElement) {
      if (selectedElement.type === 'COVER') {
        selectedElementRef.current?.returnDefaultColor()
        selectedElementRef.current = selectedElement
        selectedElementRef.current.drawOpt.color = 'rgba(0, 0, 0, 0.4)'
      } else {
        selectedElementRef.current?.returnDefaultColor()
        selectedElementRef.current = selectedElement
        selectedElementRef.current.drawOpt.color = 'red'
      }

      draw()
    }

    return selectedElement
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement instanceof Cover) {
      selectedElement.setDragging(true)
    }

    // const originalPoint = new DOMPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    // console.log('originalPoint', originalPoint)
    // console.log('getTransformedPoint', contextRef.current.getTransform())
    // console.log('invertSelf', contextRef.current.getTransform().invertSelf().transformPoint(originalPoint))
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    const selectedElement = getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})

    if (selectedElement instanceof Cover) {
      selectedElement.setDragging(false)
    }
    if (selectedElement !== selectedElementRef.current) {
      selectedElementRef.current.returnDefaultColor()
      draw()
    }
    // selectedElementRef
    // console.log('event.nativeEvent.offsetX', event.nativeEvent.offsetX )
    // getSelectedElement({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
  }

  const handleLeave = () => {
    console.log('LEAVE')
    if (selectedElementRef.current instanceof Cover) {
      selectedElementRef.current.setDragging(false)
    }
  }

  return <div><Canvas
    screenSpaceRef={contextRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleLeave}
    changeScale={changeScale}
    draw={draw}
  />
    <span style={{display: 'block'}}>zoom: {zoomRef.current}</span>
    <span style={{display: 'block'}}>mouseWheelCoordinateRef.current: {mouseWheelCoordinateRef.current}</span>
  </div>
}
