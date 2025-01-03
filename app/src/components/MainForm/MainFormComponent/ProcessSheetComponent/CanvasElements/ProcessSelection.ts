import {DRAW_RECT_PARAMS, Point, DrawingElement} from './CanvasTypes';
import {getTime} from '../../../../../utils';
import {RECT_HEIGHT} from '../CanvasConstants';

export class ProcessSelection extends DrawingElement<'PROCESS_SELECTION'> {
  widthSetIsComplete: boolean
  isMoving: boolean
  changingLeftBorder: boolean
  changingRightBorder: boolean

  private focusColor = 'rgba(0, 0, 0, 0.3)'
  private timeTextOffsetX = 3
  private timeTextFontSize = 12
  private borderWidth = 3
  public elementsPosition: {
    startTimeText: {
      xPosition: number,
      yPosition: number
    },
    endTimeText: {
      xPosition: number,
      yPosition: number
    },
  } = {
    startTimeText: {xPosition: 0, yPosition: 0},
    endTimeText: {xPosition: 0, yPosition: 0}
  }

  private startTimeTextWidth: number = 0
  private endTimeTextWidth: number = 0

  constructor(params: DRAW_RECT_PARAMS, private allTime: number) {
    super('PROCESS_SELECTION', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt
    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'red'
    this.order = 2
    this.widthSetIsComplete = false
    this.isMoving = false
    this.changingLeftBorder = false
    this.changingRightBorder = false
  }

  drawElement = (zoom: number = 1) => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color} = this.drawOpt || {}

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'rgba(0, 0, 0, 0.2)'
    this.ctx.fillRect(xPosition, yPosition, width, height)
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)' //color || 'rgba(0, 0, 0, 0.4)'
    this.ctx.fillRect(xPosition, yPosition, (width ? this.borderWidth : 0) / zoom, height)
    this.ctx.fill()

    if (width) {
      this.ctx.save()

      // if (this.drawOpt.color === this.defaultColor) {
      this.ctx.fillStyle = 'black';
      // this.ctx.fillStyle = 'blue';
      // } else {
      //   this.ctx.fillStyle = 'white';
      //   this.ctx.fillStyle = 'blue';
      // }
      this.ctx.font = `bold ${this.timeTextFontSize}px Arial, Helvetica, sans-serif`
      this.ctx.textAlign = "start";
      this.ctx.scale(1 / zoom, 1)

      const textLeft = Math.round(this.sizeOpt.xPosition / this.ctx.canvas.width * this.allTime)
      const textRight = Math.round((this.sizeOpt.xPosition + this.sizeOpt.width) / this.ctx.canvas.width * this.allTime)

      const startTime = getTime(textLeft)
      const endTime = getTime(textRight)

      this.startTimeTextWidth = this.ctx.measureText(startTime).width
      this.endTimeTextWidth = this.ctx.measureText(endTime).width

      let endTimeTextOffsetY = 0
      if (this.startTimeTextWidth + this.endTimeTextWidth >= width * zoom - 2 * this.timeTextOffsetX - 5) {
        endTimeTextOffsetY = 1
      }

      const startTextIsBig = this.startTimeTextWidth > width * zoom - 2 * this.borderWidth
      const endTextIsBig = this.endTimeTextWidth > width * zoom - 2 * this.borderWidth

      const startTimeTextXPosition = Math.min(this.ctx.canvas.width * zoom - this.startTimeTextWidth - 5 - this.timeTextOffsetX- this.endTimeTextWidth, Math.max(0, xPosition * zoom - this.startTimeTextWidth - this.timeTextOffsetX))
      const endTimeTextXPosition = Math.max(this.endTimeTextWidth + 5, Math.min((this.ctx.canvas.width * zoom - this.endTimeTextWidth), (xPosition + width) * zoom + this.timeTextOffsetX))
      // const endTimeTextXPosition = Math.max(this.startTimeTextWidth + this.endTimeTextWidth, (xPosition + width) * zoom - this.endTimeTextWidth - this.timeTextOffsetX)
      const startTimeTextYPosition = height + this.timeTextFontSize + 5
      const endTimeTextYPosition = height + this.timeTextFontSize + 5 //- endTimeTextOffsetY * (this.timeTextFontSize + 2)

      this.elementsPosition = {
        startTimeText: {xPosition: startTimeTextXPosition, yPosition: startTimeTextYPosition},
        endTimeText: {xPosition: endTimeTextXPosition, yPosition: endTimeTextYPosition}
      }

      // if (startTextIsBig) {
      //   this.ctx.save()
      //   this.ctx.beginPath()
      //   this.ctx.rect(xPosition, startTimeTextYPosition - endTimeTextOffsetY * (this.timeTextFontSize + 2), width, RECT_HEIGHT)
      //   this.ctx.clip()
      //   this.ctx.fillText(startTime, startTimeTextXPosition, startTimeTextYPosition);
      //   this.ctx.restore()
      // } else {
      // this.ctx.beginPath()
      // this.ctx.rect(startTimeTextXPosition, height, width, RECT_HEIGHT)
      // this.ctx.fill()
      this.ctx.fillText(startTime, startTimeTextXPosition, startTimeTextYPosition)
      // }

      // if (endTextIsBig) {
      //   this.ctx.save()
      //   this.ctx.beginPath()
      //   this.ctx.rect(xPosition, height - 2 * endTimeTextOffsetY * (this.timeTextFontSize + 2), width, RECT_HEIGHT)
      //   this.ctx.clip()
      //   this.ctx.fillText(endTime, endTimeTextXPosition, endTimeTextYPosition)
      //   this.ctx.restore()
      // } else {
      this.ctx.fillText(endTime, endTimeTextXPosition, endTimeTextYPosition)
      // }
      this.ctx.restore()
    }


    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)' //color || 'rgba(0, 0, 0, 0.4)'
    this.ctx.fillRect(xPosition + width - this.borderWidth / zoom, yPosition, (width ? this.borderWidth : 0) / zoom, height)
    this.ctx.fill()

  }

  setStartPoint = (startPoint: number) => {
    this.sizeOpt.xPosition = startPoint
  }

  setWidth = (width: number) => {
    this.sizeOpt.width = width
  }

  setWidthSetIsComplete = (value: boolean) => {
    this.widthSetIsComplete = value
  }

  setIsMoving = (value: boolean) => {
    this.isMoving = value
  }

  setChangingLeftBorder = (value: boolean) => {
    this.changingLeftBorder = value
  }

  setChangingRightBorder = (value: boolean) => {
    this.changingRightBorder = value
  }

  resetToDefault = () => {
    if (this.drawOpt) {
      this.drawOpt.color = this.defaultColor
    }

    this.sizeOpt.width = this.initialWidth
    this.sizeOpt.xPosition = this.initialXPosition
    this.isMoving = false
    this.widthSetIsComplete = false
    this.changingLeftBorder = false
    this.changingRightBorder = false
  }

  setFocusColor = () => {
    this.drawOpt.color = this.focusColor
  }

  clickedOnTime = (point: Point) => {
    const {startTimeText, endTimeText} = this.elementsPosition

    return (point.x > startTimeText.xPosition
      && point.x < startTimeText.xPosition + this.startTimeTextWidth
      && point.y > startTimeText.yPosition - this.timeTextFontSize
      && point.y < startTimeText.yPosition) || (point.x > endTimeText.xPosition
      && point.x < endTimeText.xPosition + this.startTimeTextWidth
      && point.y > endTimeText.yPosition - this.timeTextFontSize
      && point.y < endTimeText.yPosition
    )
  }

}
