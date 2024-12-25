import {Draggable, DRAW_RECT_PARAMS, DrawingElement} from './CanvasTypes';

export class Cover extends DrawingElement<'COVER'> implements Draggable {
  isDragging = false

  constructor(params: DRAW_RECT_PARAMS) {
    super('COVER', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'rgba(0, 0, 0, 0.05)'
  }


  drawElement = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color} = this.drawOpt || {}

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'rgba(0, 0, 0, 0.05)'
    this.ctx.fillRect(xPosition, yPosition, width, height)

    this.ctx.fill()
  }


  setDragging = (dragging: boolean) => {
    this.isDragging = dragging
  }

}
