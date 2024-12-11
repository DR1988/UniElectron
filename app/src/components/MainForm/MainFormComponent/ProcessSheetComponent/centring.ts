// centring
// const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
//   if (!context || !container || !canvas) {
//     return
//   }
//
//   const containerRect = container?.getBoundingClientRect()
//
//   containerWidthRef.current = containerRect.width
//   zoomRef.current = zoom
//
//   const canvasHeight = (LINE_HEIGHT + LINE_GAP) * lineFormer.length
//
//   canvas.width = containerRect.width;
//   canvas.height = canvasHeight;
//   canvas.style.width = `${containerRect.width}px`;
//   canvas.style.height = `${canvasHeight}px`;
//
//
//
//   const scaledWidth = canvas.width * zoom
//   const scalesOffsetX = (scaledWidth - canvas.width)/2
//
//   console.log('scalesOffsetX', scalesOffsetX)
//
//   context.clearRect(0,0,canvas.width, canvas.height)
//   context.save()
//   context.translate(-scalesOffsetX,0)
//   context.scale(zoom,1)
//
//   lineFormer?.forEach((lf, index) => {
//     drawRect(containerRect.width, context, 5 * (index + 1) + 30 * index)
//   })
//
//   lineFormer?.forEach((lf, index) => {
//     lf.changes.forEach(change => {
//       const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
//       const duration = endTime - startTime
//       const width = containerRect.width * duration / allTime
//       const xPosition = containerRect.width * startTime / allTime
//       drawRectChange(width, context, 5 * (index + 1) + 30 * index, xPosition, value || duration)
//     })
//   })
//   context.restore()
//
//   context.save()
//
//   context.translate(-scalesOffsetX,0)
//   lineFormer?.forEach((lf, index) => {
//     lf.changes.forEach(change => {
//       const {startTime, endTime, value, crossingValueEnd, crossingValueStart} = change
//       const duration = endTime - startTime
//       const width = containerRect.width * duration / allTime
//       const xPosition = containerRect.width * startTime / allTime
//       drawText(value || duration, context, width * zoom, (xPosition* zoom) , 5 * (index + 1) + 30 * index) // making text to ignore the scaling
//     })
//   })
//   context.restore()
//
// }, [container, lineFormer, zoom, mouseWheelCoordinate])
