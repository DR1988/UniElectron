import React, {forwardRef, FunctionComponent, useCallback, useEffect, useRef, useState} from 'react';
import * as events from 'events';

export type  CanvasProp = {
  // draw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  draw: (canvas: HTMLCanvasElement) => void
  changeScale: (event: React.WheelEvent) => void
  onMouseMove: (event: React.MouseEvent) => void
  onMouseUp: (event: React.MouseEvent) => void
  onMouseDown: (event: React.MouseEvent) => void
  onMouseLeave: (event: React.MouseEvent) => void
  screenSpaceRef: React.MutableRefObject<CanvasRenderingContext2D>
}


// export const Canvas = forwardRef< CanvasRenderingContext2D, CanvasProp>((props, ref) => {
export const Canvas: FunctionComponent<CanvasProp> = (props) => {
  const {draw, changeScale, onMouseMove, onMouseDown, onMouseLeave, screenSpaceRef, onMouseUp, ...rest} = props

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef.current

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!screenSpaceRef.current) {

      screenSpaceRef.current = context
    }
    let animationId

    const renderer = () => {
      draw(canvas)

      animationId = window.requestAnimationFrame(renderer)
    }

    renderer()

    return () => {
      window.cancelAnimationFrame(animationId)
    }
    // draw(context, canvas)
    // draw(canvas)
  }, [draw])

  return <canvas
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
    onWheel={changeScale}
    onMouseLeave={onMouseLeave}
    ref={canvasRef} {...rest}></canvas>
}
