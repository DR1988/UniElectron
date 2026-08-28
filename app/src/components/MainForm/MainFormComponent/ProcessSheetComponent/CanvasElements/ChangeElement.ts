import { ChangeElementData, DRAW_RECT_PARAMS, DrawingElement, TEXT_DRAW_OPT } from './CanvasTypes';
import { RECT_HEIGHT } from '../CanvasConstants';

export class ChangeElement extends DrawingElement<'CHANGE_ELEMENT'> {
  isMoving: boolean
  isCollide: boolean
  overBound: 'right' | 'left' | null
  deltaX = 0
  originStartPoint = 0

  constructor(params: DRAW_RECT_PARAMS, private data: ChangeElementData) {
    super('CHANGE_ELEMENT', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const { ctx, sizeOpt, drawOpt } = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt
    this.isMoving = false
    this.isCollide = false
    this.overBound = null

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'rgba(171, 193, 197, 1)'
  }

  setStartPoint = (startPoint: number) => {
    this.sizeOpt.xPosition = startPoint
  }

  setIsMoving = (value: boolean) => {
    this.isMoving = value
  }

  setInitialXPosition = (posion: number) => {
    this.initialXPosition = posion
  }


  /* для того чтобы начать двигать элемент вслед за движением мышки 
     надо 
     1) в обработчике onMouseDown зафиксировать дельту от нажатия на текущую 
     позицию мышки и левого края элемента  
     2) в обработчик onMouseMove от текущего положения мышки отнять дельту - 
        это и будет смещение относительно начально положения 
     3) в обработчике onMouseUp зафиксировать новое начальное положение левого края,
        иначе при следующей попытке двигать элементы отчет будет вестись от предыдущего
        начально положения  
  */
  setDeltaX = (deltaX: number) => {
    this.deltaX = deltaX
  }

  setOverBound = (value: 'right' | 'left' | null) => {
    this.overBound = value
  }

  drawElement = (zoom: number = 1) => {
    const { xPosition, yPosition, width, height, crossingValueEndWidth, crossingValueStartWidth } = this.sizeOpt
    const { color, text } = this.drawOpt || {}

    if (crossingValueEndWidth || crossingValueStartWidth) {
      // log('crossingValueStartWidth', crossingValueEndWidth, crossingValueStartWidth)
      // log2('this.data', this.data)

      if (crossingValueStartWidth > 0) {
        // this.getCrossingSpace(xPosition, yPosition, crossingValueStartWidth, height)
        this.ctx.beginPath()
        // this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.ctx.fillRect(xPosition, yPosition, width, height || RECT_HEIGHT)
        this.ctx.fill()

      } else if (crossingValueEndWidth < 0) {
        // if (this.data.lineId === 3) {
        //   log('datadata', this.data)
        // }

        // this.getCrossingSpace(xPosition, yPosition, crossingValueEndWidth, height)
        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        // this.ctx.fillStyle = 'red'

        // this.ctx.fillStyle = 'red'
        this.ctx.fillRect(xPosition, yPosition, width, height || RECT_HEIGHT)
        this.ctx.fill()
      }
    } else {
      // if (this.data.lineId === 3) {
      //   log2('ssssss', this.data)
      //   log3('-----------------')
      // }
      this.ctx.beginPath()
      this.ctx.fillStyle = color || 'rgba(171, 193, 197, 1)'
      this.ctx.fillRect(xPosition, yPosition, width, height || RECT_HEIGHT)
      this.ctx.fill()
    }


    // if (this.data.lineId === 3 && this.data.changeElement.duration < 0) {
    //   log2('texttexttext', text)
    //   log3('-----------------', this.data.changeElement)
    // }
    if (text !== undefined) {
      this.ctx.save()
      this.ctx.scale(1 / zoom, 1)
      drawText(this.ctx, text, { rectWidth: width * zoom, rectX: xPosition * zoom, rectY: yPosition })
      this.ctx.restore()
    }
  }

  setColor = (color: string) => {
    this.drawOpt.color = color
  }

  setIsCollide = (value: boolean) => {
    this.isCollide = value
  }

  getIsCollide = () => {
    return this.isCollide
  }

  setDefaultColor = () => {
    this.drawOpt.color = this.defaultColor
  }

  public get Data(): ChangeElementData {
    return this.data
  }

}

export const drawText = (ctx: CanvasRenderingContext2D, text: string | number, textDraw: TEXT_DRAW_OPT) => {
  const { rectWidth, rectX, rectY, color = '#000000' } = textDraw

  let textToShow = text.toString()

  ctx.beginPath()
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = color;
  ctx.font = "bold 17px Arial, Helvetica, sans-serif"
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textIsBig = ctx.measureText(textToShow).width > rectWidth
  if (textIsBig) {
    ctx.textAlign = "start";
    ctx.save()
    ctx.beginPath()
    ctx.rect(rectX, rectY, rectWidth, RECT_HEIGHT)
    ctx.clip()
    ctx.fillText(textToShow, rectX, rectY + (RECT_HEIGHT / 2));
    ctx.restore()
  } else {
    ctx.fillText(textToShow, rectX + (rectWidth / 2), rectY + (RECT_HEIGHT / 2));
  }
}

