import {DRAW_RECT_PARAMS, DrawingElement} from './CanvasTypes';
import {RECT_HEIGHT} from '../CanvasConstants';
import {getTime} from '../../../../../utils';
import throttle from 'lodash/throttle';

const log = throttle(console.log, 500)
const log2 = throttle(console.log, 500)
const log3 = throttle(console.log, 500)

export class TimeLine extends DrawingElement<'TIME_LINE'> {
  MAX_INTERVALS = 10

  constructor(params: DRAW_RECT_PARAMS, private allTime: number) {
    super('TIME_LINE', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable)

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'red'
  }

  drawElement = (zoom: number = 1) => {
    const {xPosition, yPosition, width, height} = this.sizeOpt

    if (this.allTime > 0) {

      this.ctx.save()

      this.ctx.scale(1 / zoom, 1)
      this.ctx.beginPath();
      this.ctx.moveTo(xPosition * zoom, yPosition + (height || RECT_HEIGHT));
      this.ctx.lineTo((xPosition + width + 1) * zoom, yPosition + (height || RECT_HEIGHT));
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.fillStyle = 'black';
      this.ctx.font = "bold 12px Arial, Helvetica, sans-serif"

      for (let i = 0; i <= this.MAX_INTERVALS * zoom; i++) {
        const text = getTime(this.allTime / this.MAX_INTERVALS * (i) / zoom)
        const xPosStart = i === 0 ? width / this.MAX_INTERVALS * i + 1 : width / this.MAX_INTERVALS * i
        this.ctx.strokeStyle = 'black';

        this.ctx.beginPath();
        this.ctx.moveTo(xPosStart, yPosition + (height || RECT_HEIGHT) / 2);
        this.ctx.lineTo(xPosStart, yPosition + (height || RECT_HEIGHT));
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        for (let j = 1; j < 5; j++) {
          if (i < this.MAX_INTERVALS * zoom) {
            const xSmallPosStart = xPosStart + width / 5 / this.MAX_INTERVALS * j //* (i + 1)
            this.ctx.beginPath();

            this.ctx.strokeStyle = 'rgba(128, 128, 128, 1)';
            this.ctx.moveTo(xSmallPosStart, yPosition + 2 * (height || RECT_HEIGHT) / 3);
            this.ctx.lineTo(xSmallPosStart, yPosition + (height || RECT_HEIGHT) - 1);
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
          }
        }


        if (i === 0) {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = "start";
          this.ctx.fillText('00:00', xPosStart - 1, yPosition + (height || RECT_HEIGHT) / 2 - 2);
        } else if (i === this.MAX_INTERVALS * zoom) {
          this.ctx.textAlign = "end";
          this.ctx.fillStyle = 'black';
          this.ctx.strokeStyle = "black";
          this.ctx.beginPath();
          this.ctx.moveTo(width * zoom - 2, yPosition + (height || RECT_HEIGHT) / 2);
          this.ctx.lineTo(width * zoom - 2, yPosition + (height || RECT_HEIGHT));
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
          this.ctx.fillText(text, width * zoom - 1, yPosition + (height || RECT_HEIGHT) / 2 - 2);
        } else {
          this.ctx.fillStyle = 'black';
          this.ctx.textAlign = "center";
          this.ctx.fillText(text, xPosStart, yPosition + (height || RECT_HEIGHT) / 2 - 2);
        }

      }

      this.ctx.restore()

    }

  }
}
