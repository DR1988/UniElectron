import {DRAW_RECT_PARAMS, DrawingElement} from './CanvasTypes';

export class SideCover extends DrawingElement<'SIDE_COVER'> {
  constructor(params: DRAW_RECT_PARAMS, public name: 'sideCoverLeft' | 'sideCoverRight') {
    super('SIDE_COVER', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'rgba(0, 0, 0, 0.3)'
  }


  drawElement = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color} = this.drawOpt || {}

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'rgba(0, 0, 0, 0.3)'
    this.ctx.fillRect(xPosition, yPosition, width, height)

    this.ctx.fill()
  }


}
