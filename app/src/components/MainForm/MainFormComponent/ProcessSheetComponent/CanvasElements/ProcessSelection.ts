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
  private buttonPadding = 5
  private timePositionPadding = 5
  private timeMargin = 10
  public elementsPosition: {
    startTimeText: {
      xPosition: number,
      yPosition: number,
      width: number,
      height: number
    },
    endTimeText: {
      xPosition: number,
      yPosition: number,
      width: number,
      height: number
    },
  } = {
    startTimeText: {xPosition: 0, yPosition: 0, width: 0, height: 0},
    endTimeText: {xPosition: 0, yPosition: 0, width: 0, height: 0}
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

      this.ctx.fillStyle = 'black';

      this.ctx.font = `bold ${this.timeTextFontSize}px Arial, Helvetica, sans-serif`
      this.ctx.textAlign = "start";
      this.ctx.scale(1 / zoom, 1)

      const textLeft = Math.round(this.sizeOpt.xPosition / this.ctx.canvas.width * this.allTime)
      const textRight = Math.round((this.sizeOpt.xPosition + this.sizeOpt.width) / this.ctx.canvas.width * this.allTime)

      const startTime = getTime(textLeft)
      const endTime = getTime(textRight)

      this.startTimeTextWidth = this.ctx.measureText(startTime).width
      this.endTimeTextWidth = this.ctx.measureText(endTime).width

      const startTimeTextXPosition = Math.min(this.ctx.canvas.width * zoom - this.startTimeTextWidth - this.timePositionPadding - this.timeTextOffsetX - this.endTimeTextWidth - this.timeMargin, Math.max(0, xPosition * zoom - this.startTimeTextWidth - this.timeTextOffsetX))
      const endTimeTextXPosition = Math.max(this.endTimeTextWidth + this.timePositionPadding + this.timeMargin, Math.min((this.ctx.canvas.width * zoom - this.endTimeTextWidth), (xPosition + width) * zoom + this.timeTextOffsetX))
      const startTimeTextYPosition = height + this.timeTextFontSize + this.timePositionPadding
      const endTimeTextYPosition = height + this.timeTextFontSize + this.timePositionPadding

      this.elementsPosition = {
        startTimeText: {
          xPosition: startTimeTextXPosition - this.buttonPadding,
          yPosition: startTimeTextYPosition - this.timeTextFontSize,
          width: this.startTimeTextWidth + 2 * this.buttonPadding,
          height: this.timeTextFontSize + this.buttonPadding
        },
        endTimeText: {
          xPosition: endTimeTextXPosition - this.buttonPadding,
          yPosition: endTimeTextYPosition - this.timeTextFontSize,
          width: this.endTimeTextWidth + 2 * this.buttonPadding,
          height: this.timeTextFontSize + this.buttonPadding
        }
      }


      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgba(171, 193, 197, 1)' //color || 'rgba(0, 0, 0, 0.4)'
      this.ctx.fillRect(this.elementsPosition.startTimeText.xPosition, this.elementsPosition.startTimeText.yPosition, this.elementsPosition.startTimeText.width, this.elementsPosition.startTimeText.height)
      this.ctx.fillRect(this.elementsPosition.endTimeText.xPosition, this.elementsPosition.endTimeText.yPosition, this.elementsPosition.endTimeText.width, this.elementsPosition.endTimeText.height)
      this.ctx.fill()

      this.ctx.fillStyle = 'black';
      this.ctx.fillText(startTime, startTimeTextXPosition, startTimeTextYPosition)
      this.ctx.fillText(endTime, endTimeTextXPosition, endTimeTextYPosition)

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
      && point.x < startTimeText.xPosition + startTimeText.width
      && point.y > startTimeText.yPosition
      && point.y < startTimeText.yPosition + startTimeText.height) || (point.x > endTimeText.xPosition
      && point.x < endTimeText.xPosition + endTimeText.width
      && point.y > endTimeText.yPosition
      && point.y < endTimeText.yPosition + startTimeText.height
    )
  }

}
