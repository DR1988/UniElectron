import {DRAW_RECT_PARAMS, DrawingElement} from './CanvasTypes';

export class HoverLine extends DrawingElement<'HOVER_LINE'> {

  constructor(params: DRAW_RECT_PARAMS, private shouldShow = false) {
    super('HOVER_LINE', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt
    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'red'
  }

  drawElement(zoom: number = 1) {
    const {xPosition, yPosition, width, height} = this.sizeOpt

    if (this.shouldShow) {
      this.ctx.save()
      this.ctx.scale(1 / zoom, 1)
      this.ctx.fillStyle = this.drawOpt.color
      this.ctx.beginPath();
      this.ctx.fillRect(xPosition * zoom, yPosition, 2, height)
      this.ctx.fillRect((xPosition + width) * zoom - 2, yPosition, 2, height)
      this.ctx.fill()

      this.ctx.restore()
    }
  }

  public setStart = (startPosition: number) => {
    this.sizeOpt.xPosition = startPosition
  }

  public setWidth = (width: number) => {
    this.sizeOpt.width = width
  }

  public setShouldShow = (_shouldShow: boolean) => {
    this.shouldShow = _shouldShow
  }

}
