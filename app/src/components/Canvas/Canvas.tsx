import React, {forwardRef, FunctionComponent, useCallback, useEffect, useRef, useState} from 'react';
import * as events from 'events';

export type  CanvasProp = {
  // draw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  draw: (canvas: HTMLCanvasElement) => void
  changeScale: (event: React.WheelEvent) => void
  onMouseMove: (event: React.MouseEvent) => void
  onMouseUp: (event: React.MouseEvent) => void
  onMouseDown: (event: React.MouseEvent) => void
  onDoubleClick: (event: React.MouseEvent) => void
  onMouseLeave: (event: React.MouseEvent) => void
  screenSpaceRef: React.MutableRefObject<CanvasRenderingContext2D>
  useAnimationFrame: boolean
}

const requestAnimationFramePoly = () => {
  let lastTime = 0;

  return {
    requestAnimationFrameInternal: function (callback) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    },
    cancelAnimationFrameInternal: function (id) {
      clearTimeout(id);
    }
  };
}

// export const Canvas = forwardRef< CanvasRenderingContext2D, CanvasProp>((props, ref) => {
export const Canvas: FunctionComponent<CanvasProp> = (props) => {
  const {
    draw,
    changeScale,
    onMouseMove,
    onMouseDown,
    onMouseLeave,
    screenSpaceRef,
    onMouseUp,
    useAnimationFrame,
    onDoubleClick,
    ...rest
  } = props

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef.current
  const rafPRef = useRef(requestAnimationFramePoly())

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!screenSpaceRef.current) {

      screenSpaceRef.current = context
    }
    let animationId

    const renderer = () => {
      draw(canvas)

      if (useAnimationFrame) {
        animationId = rafPRef.current.requestAnimationFrameInternal(renderer)
        // animationId = window.requestAnimationFrame(renderer)
      }
    }

    if (useAnimationFrame) {
      renderer()
    }

    return () => {
      // window.cancelAnimationFrame(animationId)
      rafPRef.current.cancelAnimationFrameInternal(animationId)
    }
    // draw(context, canvas)
    // draw(canvas)
  }, [draw])

  return <canvas
    // style={{width:'100%', maxWidth: 600}}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
    onWheel={changeScale}
    onMouseLeave={onMouseLeave}
    onDoubleClick={onDoubleClick}
    ref={canvasRef} {...rest}></canvas>
}
