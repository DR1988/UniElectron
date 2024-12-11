// const draw = useCallback((canvas: HTMLCanvasElement) => {
//   if (!contextRef.current || !container || !canvas) {
//     return
//   }
//
//
//   const containerRect = container?.getBoundingClientRect()
//
//
//   // containerWidthRef.current = containerRect.width
//
//   const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length
//
//   if (!containerMeasureRef.current && containerMeasureRef.current !== containerRect.width) {
//     canvas.width = containerRect.width;
//     canvas.height = canvasHeight;
//     canvas.style.width = `${containerRect.width}px`;
//     canvas.style.height = `${canvasHeight}px`;
//
//     containerMeasureRef.current = containerRect.width;
//   }
//
//
//   // canvas.width = containerRect.width;
//   // canvas.height = canvasHeight;
//   // canvas.style.width = `${containerRect.width}px`;
//   // canvas.style.height = `${canvasHeight}px`;
//
//
//
//   // console.log('currentTransformedCursor.current ', currentTransformedCursor.current.x)
//   // context.save()
//   contextRef.current.translate(currentTransformedCursor.current.x, 0)
//   // contextRef.current.scale(zoomRef.current, 1)
//   contextRef.current.scale(zoom, 1)
//   contextRef.current.translate(-currentTransformedCursor.current.x, 0)
//   console.log('contextRef.current.getTransform()', contextRef.current.getTransform())
//   if (contextRef.current.getTransform().a === 1) {
//     console.log('contextRef.current.getTransform()', contextRef.current.getTransform())
//
//   }
//   const contextZoom = contextRef.current.getTransform().a
//
//   contextRef.current.save();
//   contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
//   contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
//
//   lineFormer?.forEach((lf, index) => {
//     drawRect(containerRect.width, contextRef.current, 5 * (index + 1) + 30 * index)
//     // lf.changes.forEach(change => {
//     //   const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
//     //   const duration = endTime - startTime
//     //   const width = containerRect.width * duration / allTime
//     //   const xPosition = containerRect.width * startTime / allTime
//     // })
//
//   })
//   contextRef.current.restore();
//
//
//   lineFormer?.forEach((lf, index) => {
//     lf.changes.forEach(change => {
//       const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
//       const duration = endTime - startTime
//       const width = containerRect.width * duration / allTime
//       const xPosition = containerRect.width * startTime / allTime
//       drawRectChange(width, contextRef.current, 5 * (index + 1) + 30 * index, xPosition, contextZoom)
//       contextRef.current.save()
//       contextRef.current.translate(xPosition, 0)
//       contextRef.current.scale(1 / contextZoom, 1)
//       drawText(value || duration, contextRef.current, width * contextZoom, 0, 5 * (index + 1) + 30 * index) // making text to ignore the scaling
//       contextRef.current.restore()
//     })
//   })
//   // contextRef.current.drawImage(image, 0, 0, 300, 300);
//
//
// }, [container, lineFormer, zoom])





import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Props} from './ProcessSheetComponent';
import {ValveLineType} from '../../MainFormInterfaces';
import {RemoveSpaceOption} from '../../../CommonTypes';
import {Canvas} from '../../../Canvas/Canvas';
import {DRAW_RECT, TEXT_DRAW_OPT} from './CanvasTypes';
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


  const containerWidthRef = useRef(0)
  const zoomRef = useRef(1)
  const mouseWheelCoordinateRef = useRef(0)
  const mouseWheelCoordinateRefChn = useRef(false)
  const currentTransformedCursor = useRef<DOMPoint>({x: 0, y: 0, w: 0, z: 0})
  const containerMeasureRef = useRef(0)

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
      const cover =  new Cover({
          ctx: contextRef.current,
          sizeOpt: {
            width: containerRect.width,
            xPosition: contextRef.current.canvas.width,
            yPosition: canvasHeight - LEGEND_HEIGHT + 2,
            height: LEGEND_HEIGHT
          },
          drawOpt: {
            shouldSkipSizing: true
          }
        }
      )

      elements.current.push(cover)


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
              shouldSkipSizing: true
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
                text: value || duration
              }
            }),
            new ChangeElement({
              ctx: contextRef.current,
              sizeOpt: {
                width: width,
                xPosition: xPosition,
                yPosition:  canvasHeight - LEGEND_HEIGHT + 2 * (index + 1) + 5 * index,
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


    }

  }, [container])


  // centring
  const draw = useCallback(() => {
    if (!contextRef.current || !container) {
      return
    }


    const containerRect = container?.getBoundingClientRect()

    zoomRef.current = zoom


    // canvas.width = containerRect.width;
    // canvas.height = canvasHeight;
    // canvas.style.width = `${containerRect.width}px`;
    // canvas.style.height = `${canvasHeight}px`;


    const scaledWidth = contextRef.current.canvas.width * zoom
    const scalesOffsetX = (scaledWidth - contextRef.current.canvas.width) / 2


    contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)


    // lineFormer?.forEach((lf, index) => {
    //   drawRect(contextRef.current, {width: containerRect.width, yPosition: 5 * (index + 1) + 30 * index, xPosition: 0})
    // })
    //
    //
    // contextRef.current.save()
    // contextRef.current.translate(-scalesOffsetX, 0)
    // contextRef.current.scale(zoom, 1)
    //
    //
    //
    // lineFormer?.forEach((lf, index) => {
    //   lf.changes.forEach(change => {
    //     const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
    //     const duration = endTime - startTime
    //     const width = containerRect.width * duration / allTime
    //     const xPosition = containerRect.width * startTime / allTime
    //     // drawRectChange(width, contextRef.current, 5 * (index + 1) + 30 * index, xPosition, zoom)
    //     drawRectChange(contextRef.current, {width, xPosition, yPosition: 5 * (index + 1) + 30 * index}, {
    //       zoom,
    //       text: value || duration
    //     })
    //   })
    // })
    //
    // contextRef.current.restore()


    // lineFormer?.forEach((lf, index) => {
    //   drawRect(contextRef.current, {
    //     width: containerRect.width,
    //     yPosition: canvasHeight - LEGEND_HEIGHT + 2 * (index + 1) + 5 * index,
    //     xPosition: 0
    //   }, {height: 5})
    // })
    //
    // lineFormer?.forEach((lf, index) => {
    //   lf.changes.forEach(change => {
    //     const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
    //     const duration = endTime - startTime
    //     const width = containerRect.width * duration / allTime
    //     const xPosition = containerRect.width * startTime / allTime
    //     drawRectChange(contextRef.current, {
    //       width,
    //       yPosition: canvasHeight - LEGEND_HEIGHT + 2 * (index + 1) + 5 * index,
    //       xPosition
    //     }, {
    //       height: 5,
    //     })
    //   })
    // })

    // console.log('contextRef.current.canvas.width ', contextRef.current.canvas.width)
    // drawCover(
    //   contextRef.current,
    //   {
    //     width: contextRef.current.canvas.width / zoom,
    //     yPosition: canvasHeight - LEGEND_HEIGHT + 2,
    //     xPosition: contextRef.current.canvas.width * ((zoom - 1) / zoom / 2)
    //   },
    //   {height: LEGEND_HEIGHT}
    // )

    elements.current.forEach(element => {

      if (element.shouldSkipSizing) {
        element.drawElement(zoom)
        return
      }

      contextRef.current.save()
      contextRef.current.translate(-scalesOffsetX, 0)
      contextRef.current.scale(zoom, 1)

      element.drawElement(zoom)

      contextRef.current.restore()
    })

  }, [container, lineFormer, zoom])

  useLayoutEffect(() => {
    console.log('DRAW')
    draw()
  }, [zoom, contextRef.current, container])

  const getTransformedPoint = (x: number, y: number) => {
    const originalPoint = new DOMPoint(x, y);

    return contextRef.current?.getTransform().invertSelf().transformPoint(originalPoint);
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    currentTransformedCursor.current = getTransformedPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

  }


  const changeScale = (event: React.WheelEvent) => {
    const zoomScale = event.deltaY < 0 ? 2 : 0.5;

    zoomRef.current = zoomScale
    const dir = Math.sign(-event.deltaY)
    setZoom(pz => Math.max(1, Math.min(MAX_SCALE_FACTOR, pz + dir * STEP)))

    // event.preventDefault();
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    // console.log('event.nativeEvent.offsetX', event.nativeEvent.offsetX)
    // const originalPoint = new DOMPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    // console.log('originalPoint', originalPoint)
    // console.log('getTransformedPoint', contextRef.current.getTransform())
    // console.log('invertSelf', contextRef.current.getTransform().invertSelf().transformPoint(originalPoint))
  }

  return <div><Canvas contextRef={contextRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
  changeScale={changeScale}
  // draw={draw}
  />
  <span style={{display: 'block'}}>zoom: {zoom}</span>
  <span style={{display: 'block'}}>mouseWheelCoordinateRef.current: {mouseWheelCoordinateRef.current}</span>
  </div>
}

