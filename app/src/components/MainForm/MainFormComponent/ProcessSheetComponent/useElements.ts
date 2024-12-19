import {useMemo} from 'react';
import {
  ChangeElement,
  Cover,
  Line, ProcessSelection,
  SideCover,
  TimeLine,
  TimeView
} from './CanvasElements';
import {LEGEND_HEIGHT, LINE_GAP, LINE_HEIGHT, RECT_HEIGHT, TIME_LINE_HEIGHT} from './CanvasConstants';
import {ValveLineType} from '../../MainFormInterfaces';

export const useElements = (
  containerWidth: number,
  screenSpace: CanvasRenderingContext2D,
  lineFormer: Array<ValveLineType>,
  allTime: number,
) => {

  const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length + TIME_LINE_HEIGHT + LEGEND_HEIGHT
  return useMemo(() => {
    const elementsArray = []
    const result: { elementsArray: any[], processSelectionElement: ProcessSelection | null } = {
      elementsArray,
      processSelectionElement: null
    }

    // const containerRect = container?.getBoundingClientRect()
    if (screenSpace && containerWidth) {
      lineFormer.forEach((lf, index) => {
        elementsArray.push(new Line({
            ctx: screenSpace,
            sizeOpt: {
              width: containerWidth,
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
            ctx: screenSpace,
            sizeOpt: {
              width: containerWidth,
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
          const width = containerWidth * duration / allTime
          const xPosition = containerWidth * startTime / allTime

          elementsArray.push(new ChangeElement({
              ctx: screenSpace,
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
              ctx: screenSpace,
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


      const sideCoverLeft = new SideCover({
          ctx: screenSpace,
          sizeOpt: {
            width: containerWidth,
            xPosition: 0,
            yPosition: canvasHeight - LEGEND_HEIGHT + 2,
            height: LEGEND_HEIGHT
          },

        },
        'sideCoverLeft'
      )

      const sideCoverRight = new SideCover({
          ctx: screenSpace,
          sizeOpt: {
            width: containerWidth,
            xPosition: 0,
            yPosition: canvasHeight - LEGEND_HEIGHT + 2,
            height: LEGEND_HEIGHT
          },
        },
        'sideCoverRight'
      )

      const cover = new Cover({
          ctx: screenSpace,
          sizeOpt: {
            width: containerWidth,
            xPosition: 0,
            yPosition: canvasHeight - LEGEND_HEIGHT + 2,
            height: LEGEND_HEIGHT
          },
          drawOpt: {
            selectable: true
          }
        }
      )

      elementsArray.push(sideCoverLeft, cover, sideCoverRight)

      const timeLine = new TimeLine({
        ctx: screenSpace,
        sizeOpt: {
          width: containerWidth,
          xPosition: 0,
          yPosition: canvasHeight - LEGEND_HEIGHT - TIME_LINE_HEIGHT,
          height: TIME_LINE_HEIGHT
        },
        drawOpt: {
          selectable: true
        }
        // }, 4763)
      }, allTime)

      elementsArray.push(timeLine)


      const timeView = new TimeView({
        ctx: screenSpace,
        sizeOpt: {
          width: 20,
          xPosition: 0,
          yPosition: canvasHeight - LEGEND_HEIGHT,
          height: RECT_HEIGHT / 2
        },
        drawOpt: {
          color: 'blue',
          selectable: true
        }
        // }, 4763
      }, allTime)

      elementsArray.push(timeView)


      const processSelection = ProcessSelection.getInstance({
        ctx: screenSpace,
        sizeOpt: {
          width: 0,
          xPosition: -10,
          yPosition: 5, //canvasHeight - LEGEND_HEIGHT,
          height: canvasHeight - LEGEND_HEIGHT - 5
        },
        drawOpt: {
          selectable: true,
          color: 'rgba(0, 0, 0, 0.2)'
        }
      })

      result.processSelectionElement = processSelection
      elementsArray.push(processSelection)

    }

    result.elementsArray = elementsArray

    return result

  }, [containerWidth, screenSpace, lineFormer, allTime])

}
