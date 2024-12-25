import {DRAW_RECT_PARAMS, DrawingElement} from './CanvasTypes';

export class TimeView extends DrawingElement<'TIME_VIEW'> {
  constructor(params: DRAW_RECT_PARAMS, private allTime: number) {
    super('TIME_VIEW', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

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
    this.ctx.save()

    this.ctx.scale(1 / zoom, 1)

    this.ctx.beginPath();
    this.ctx.fillStyle = this.drawOpt.color

    // const xInitialOffset = -7.3* ( width / 2) *zoom
    const xInitialOffset = (width / 2) * zoom


    this.ctx.moveTo((xPosition + width) / 2 * zoom - xInitialOffset - width / 2, yPosition);
    this.ctx.lineTo((xPosition + width) / 2 * zoom - xInitialOffset + width / 2, yPosition);
    this.ctx.lineTo((xPosition + width) / 2 * zoom - xInitialOffset, yPosition - height);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo((xPosition + width) / 2 * zoom - xInitialOffset, yPosition - height + 1);
    this.ctx.lineTo((xPosition + width) / 2 * zoom - xInitialOffset, 5);
    this.ctx.strokeStyle = this.drawOpt.color

    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.restore()

    // this.ctx.lineTo((xPosition + width)/2, 0);
    // this.ctx.
  }
}
