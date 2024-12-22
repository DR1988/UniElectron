import {ChangeElementData, DRAW_RECT_OPT, DRAW_RECT_PARAMS, Point, SIZE_OPT, TEXT_DRAW_OPT} from './CanvasTypes';
import {RECT_HEIGHT} from './CanvasConstants';
import {getIntervalsFromSeconds, getTime} from '../../../../utils';
import throttle from 'lodash/throttle';
import React from 'react';
import {RemoveSpaceOption} from '../../../CommonTypes';

export type PositionSize = {
  xPosition,
  yPosition,
  width,
  height,
}

const log = throttle(console.log, 500)
const log2 = throttle(console.log, 500)
const log3 = throttle(console.log, 500)


export type ELEMENT_TYPES =
  'COVER'
  | 'LINE'
  | 'CHANGE_ELEMENT'
  | 'SIDE_COVER'
  | 'TIME_LINE'
  | 'TIME_VIEW'
  | 'PROCESS_SELECTION'
  | 'CONTEXT_MENU'
  | 'HOVER_LINE'

export abstract class DrawingElement<Type extends ELEMENT_TYPES> {
  ctx: CanvasRenderingContext2D
  public sizeOpt: SIZE_OPT
  public drawOpt: DRAW_RECT_OPT
  public type: Type
  public shouldSkipSizing: boolean
  public selectable: boolean
  public initialWidth: number
  public initialXPosition: number
  public defaultColor: string
  public order: number

  protected constructor(type: Type, shouldSkipSizing: boolean, selectable: boolean) {
    this.type = type
    this.shouldSkipSizing = shouldSkipSizing
    this.selectable = selectable
    this.order = 1
  }

  abstract drawElement(): void

  setWidth = (width: number) => {
    this.sizeOpt.width = width
  }

  returnDefaultColor = () => {
    if (this.drawOpt) {
      this.drawOpt.color = this.defaultColor
    }
  }

  setOrder = (order: number) => {
    this.order = order
  }

}

export interface Draggable {
  isDragging: boolean
}

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

export class Line extends DrawingElement<'LINE'> {
  constructor(params: DRAW_RECT_PARAMS) {
    super('LINE', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
  }


  drawElement = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color} = this.drawOpt || {}

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'rgba(0, 0, 0, 0.2)'
    this.ctx.fillRect(xPosition, yPosition, width, height)

    this.ctx.fill()
  }

}

export class ChangeElement extends DrawingElement<'CHANGE_ELEMENT'> {
  constructor(params: DRAW_RECT_PARAMS, private data: ChangeElementData) {
    super('CHANGE_ELEMENT', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt

    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'rgba(171, 193, 197, 1)'
  }


  drawElement = (zoom: number = 1) => {
    const {xPosition, yPosition, width, height, crossingValueEndWidth, crossingValueStartWidth} = this.sizeOpt
    const {color, text} = this.drawOpt || {}

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
      drawText(this.ctx, text, {rectWidth: width * zoom, rectX: xPosition * zoom, rectY: yPosition})
      this.ctx.restore()
    }
  }

  public get Data(): ChangeElementData {
    return this.data
  }

  private getCrossingSpace = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const stripeWidth = 6
    const slice = width / stripeWidth

    const startClr = 'red'
    const stopClr = 'blue'
    // log('slice', slice)
    // this.ctx.save()
    this.ctx.beginPath()
    const gr = this.ctx.createLinearGradient(x, y, width, width);
    for (let index = 0; index <= slice; index++) {
      // console.log(index)
      if (index === 0 || index === slice) {
        // console.log('index', index, startClr)
        gr.addColorStop(1 / slice * index, startClr);
      } else {
        if (index % 2 === 0) {
          // log('stopClr', stopClr)
          // console.log('index', index, stopClr)
          gr.addColorStop(1 / slice * index, stopClr);
          // console.log('index', index, startClr)
          gr.addColorStop(1 / slice * index, startClr);
        } else {
          // console.log('index', index, startClr)
          gr.addColorStop(1 / slice * index, startClr);
          // console.log('index', index, stopClr)
          gr.addColorStop(1 / slice * index, stopClr);
        }
      }

    }

    this.ctx.fillStyle = gr;
    this.ctx.fillRect(x, y, width, height);
  }
}

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
    //just ten frames for a time line
    // if (this.allTime > 0) {
    //   const elements = []
    //   const interval = this.allTime / this.MAX_INTERVALS
    //   const result = convertSecToDay(interval)
    //   const largestInterval = result['largest']
    //   const {value, sec, getStringValue, largest} = result[largestInterval]
    //   const commonSize = sec / this.allTime * 100
    //   const lastSize = largestInterval !== 'seconds' ? result.seconds.sec / this.allTime * 100 * this.MAX_INTERVALS : 0 // секунд может быть ноль - надо вроверять и стаивить другой интервал - например самый большрй интервал будет часы, а самый маленький - минуты
    //
    //
    //   this.ctx.save()
    //
    //   this.ctx.scale(1 / zoom, 1)
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(xPosition* zoom, yPosition + (height || RECT_HEIGHT));
    //   this.ctx.lineTo((xPosition + width)*zoom, yPosition + (height || RECT_HEIGHT));
    //   this.ctx.lineWidth = 3;
    //   this.ctx.stroke();
    //
    //   this.ctx.lineWidth = 3;
    //   this.ctx.fillStyle = 'black';
    //   this.ctx.font = "bold 13px Arial, Helvetica, sans-serif"
    //
    //   for (let i = 0; i < this.MAX_INTERVALS; i++) {
    //     const text = getStringValue(value * (i))
    //     const xPosStart = i === 0 ? width*zoom / this.MAX_INTERVALS * i + 1 : width*zoom / this.MAX_INTERVALS * i
    //
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(xPosStart, yPosition + (height || RECT_HEIGHT) / 2);
    //     this.ctx.lineTo(xPosStart, yPosition + (height || RECT_HEIGHT));
    //     this.ctx.lineWidth = 2;
    //     this.ctx.stroke();
    //
    //     if (i === 0) {
    //       this.ctx.fillStyle = 'red';
    //       this.ctx.textAlign = "start";
    //       this.ctx.fillText('00:00', xPosStart  - 1, yPosition + (height || RECT_HEIGHT) / 2 - 1);
    //     } else {
    //       this.ctx.fillStyle = 'black';
    //       this.ctx.textAlign = "center";
    //       this.ctx.fillText(text, xPosStart, yPosition + (height || RECT_HEIGHT) / 2 - 1);
    //     }
    //
    //   }
    //   const text = getStringValue(value * (this.MAX_INTERVALS))
    //
    //   console.log('------------')
    //   console.log('width*zoom-2', width*zoom)
    //   this.ctx.textAlign = "end";
    //   this.ctx.fillStyle = 'red';
    //   this.ctx.strokeStyle = "red";
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(width*zoom-2 , yPosition + (height || RECT_HEIGHT) / 2);
    //   this.ctx.lineTo(width*zoom-2 , yPosition + (height || RECT_HEIGHT));
    //   this.ctx.lineWidth = 2;
    //   this.ctx.stroke();
    //   this.ctx.fillText(text, width*zoom - 2, yPosition + (height || RECT_HEIGHT) / 2 - 1);
    //
    //   this.ctx.restore()
    //
    // }

    if (this.allTime > 0) {

      this.ctx.save()

      this.ctx.scale(1 / zoom, 1)
      this.ctx.beginPath();
      this.ctx.moveTo(xPosition * zoom, yPosition + (height || RECT_HEIGHT));
      this.ctx.lineTo((xPosition + width) * zoom, yPosition + (height || RECT_HEIGHT));
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.fillStyle = 'black';
      this.ctx.font = "bold 12px Arial, Helvetica, sans-serif"

      for (let i = 0; i <= this.MAX_INTERVALS * zoom; i++) {
        const text = getIntervalsFromSeconds(this.allTime / this.MAX_INTERVALS * (i) / zoom)
        const xPosStart = i === 0 ? width / this.MAX_INTERVALS * i + 1 : width / this.MAX_INTERVALS * i
        this.ctx.strokeStyle = 'black';

        this.ctx.beginPath();
        this.ctx.moveTo(xPosStart, yPosition + (height || RECT_HEIGHT) / 2);
        this.ctx.lineTo(xPosStart, yPosition + (height || RECT_HEIGHT));
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        for (let j = 1; j < 5; j++) {
          const xSmallPosStart = xPosStart + width / 5 / this.MAX_INTERVALS * j //* (i + 1)
          this.ctx.beginPath();

          this.ctx.strokeStyle = 'rgba(128, 128, 128, 1)';
          this.ctx.moveTo(xSmallPosStart, yPosition + 2 * (height || RECT_HEIGHT) / 3);
          this.ctx.lineTo(xSmallPosStart, yPosition + (height || RECT_HEIGHT) - 1);
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
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

export class ProcessSelection extends DrawingElement<'PROCESS_SELECTION'> {
  widthSetIsComplete: boolean
  isMoving: boolean
  changingLeftBorder: boolean
  changingRightBorder: boolean
  private static instance: ProcessSelection

  private focusColor = 'rgba(0, 0, 0, 0.3)'
  private timeTextOffsetX = 3

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
    this.ctx.fillRect(xPosition, yPosition, (width ? 3 : 0) / zoom, height)
    this.ctx.fill()

    if (width) {
      this.ctx.save()

      if (this.drawOpt.color === this.defaultColor) {
        this.ctx.fillStyle = 'black';
        // this.ctx.fillStyle = 'blue';
      } else {
        this.ctx.fillStyle = 'white';
        // this.ctx.fillStyle = 'blue';
      }
      this.ctx.font = "bold 12px Arial, Helvetica, sans-serif"
      this.ctx.textAlign = "start";
      this.ctx.scale(1 / zoom, 1)

      const textLeft = Math.round(this.sizeOpt.xPosition / this.ctx.canvas.width * this.allTime)
      const textRight = Math.round((this.sizeOpt.xPosition + this.sizeOpt.width) / this.ctx.canvas.width * this.allTime)

      const startTime = getTime(textLeft)
      const endTime = getTime(textRight)

      const startTimeTextWidth = this.ctx.measureText(startTime).width
      const endTimeTextWidth = this.ctx.measureText(endTime).width

      let endTimeTextOffsetY = 0
      if (startTimeTextWidth + endTimeTextWidth >= width - 2 * this.timeTextOffsetX - 5) {
        endTimeTextOffsetY = 1
      }

      this.ctx.fillText(startTime, xPosition * zoom + this.timeTextOffsetX, height)
      this.ctx.fillText(endTime, (xPosition + width) * zoom - endTimeTextWidth - this.timeTextOffsetX, height - endTimeTextOffsetY * 14)
      this.ctx.restore()
    }


    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)' //color || 'rgba(0, 0, 0, 0.4)'
    this.ctx.fillRect(xPosition + width - 3 / zoom, yPosition, (width ? 3 : 0) / zoom, height)
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

}

export class ContextMenu extends DrawingElement<'CONTEXT_MENU'> {
  private shouldDraw: boolean = false

  private radioSize = 15
  private radioInitOffset = 20
  private radioVerticalOffset = 25
  private leftMargin = 10
  private bottomMargin = 10
  private buttonTextMargin = 5
  private buttonHeight = 20
  private buttonFontSize = 16
  private radioSelected: RemoveSpaceOption | undefined
  private cancelText = 'Cancel'
  private okText = 'OK'

  constructor(params: DRAW_RECT_PARAMS, private allTime: number) {
    super('CONTEXT_MENU', !!params.drawOpt?.shouldSkipSizing, !!params.drawOpt?.selectable);

    const {ctx, sizeOpt, drawOpt} = params
    this.ctx = ctx
    this.sizeOpt = sizeOpt
    this.drawOpt = drawOpt
    this.initialWidth = sizeOpt.width
    this.initialXPosition = sizeOpt.xPosition
    this.defaultColor = this.drawOpt?.color || 'red'
    this.order = 3
  }

  drawElement(zoom: number = 1) {

    if (this.shouldDraw) {
      this.drawSheet()
      this.drawRadioButtons()
      this.drawButtons()
    }

  }

  private drawSheet = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color, text} = this.drawOpt || {}

    let signX = 0
    let signY = 0
    if (xPosition + width < this.ctx.canvas.width) {
    } else {
      signX = 1
    }
    if (yPosition + height < this.ctx.canvas.height) {
    } else {
      signY = 1
    }

    const mirrorOffsetX = -signX * width
    const mirrorOffsetY = -signY * height

    this.ctx.save()
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 10;
    this.ctx.shadowOffsetY = 10;

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'red'

    this.ctx.fillRect(xPosition + mirrorOffsetX, yPosition + mirrorOffsetY, width, height)
    this.ctx.fill()
    this.ctx.restore()
  }

  private drawRadioButtons = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    let sign = 0
    let signY = 0
    if (xPosition + width < this.ctx.canvas.width) {
    } else {
      sign = 1
    }
    if (yPosition + height < this.ctx.canvas.height) {
    } else {
      signY = 1
    }

    const mirrorOffsetX = -sign * width
    const mirrorOffsetY = -signY * height

    this.ctx.fillStyle = 'black';
    this.ctx.font = "bold 15px Arial, Helvetica, sans-serif"
    this.ctx.textBaseline = "bottom";

    this.ctx.beginPath()
    this.ctx.rect(xPosition + 10 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset, this.radioSize, this.radioSize);
    this.ctx.fillText('Remove all', (xPosition + 35) + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'remove_all') {
      this.ctx.beginPath()
      this.ctx.rect(xPosition + 12 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + 2, this.radioSize - 4, this.radioSize - 4);
      this.ctx.fill()
    }

    this.ctx.beginPath()
    this.ctx.rect(xPosition + 10 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + this.radioVerticalOffset, this.radioSize, this.radioSize);
    this.ctx.fillText('Remove changes', (xPosition + 35) + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + this.radioVerticalOffset + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'remove_changes') {
      this.ctx.beginPath()
      this.ctx.rect(xPosition + 12 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + this.radioVerticalOffset + 2, this.radioSize - 4, this.radioSize - 4);
      this.ctx.fill()
    }

    this.ctx.beginPath()
    this.ctx.rect(xPosition + 10 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + 2 * this.radioVerticalOffset, this.radioSize, this.radioSize);
    this.ctx.fillText('Insert space', (xPosition + 35) + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + 2 * this.radioVerticalOffset + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'insert_space') {
      this.ctx.beginPath()
      this.ctx.rect(xPosition + 12 + mirrorOffsetX, yPosition + mirrorOffsetY + this.radioInitOffset + 2 * this.radioVerticalOffset + 2, this.radioSize - 4, this.radioSize - 4);
      this.ctx.fill()
    }
  }

  private drawButtons = () => {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    let sign = 0
    let signY = 0
    if (xPosition + width < this.ctx.canvas.width) {
    } else {
      sign = 1
    }
    if (yPosition + height < this.ctx.canvas.height) {
    } else {
      signY = 1
    }

    const mirrorOffsetX = -sign * width
    const mirrorOffsetY = -signY * height

    this.ctx.save()
    this.ctx.fillStyle = 'white';
    this.ctx.font = `bolder ${this.buttonFontSize}px Arial, Helvetica, sans-serif`
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";

    const cancelTextWidth = this.ctx.measureText(this.cancelText).width
    const okTextWidth = this.ctx.measureText(this.okText).width

    this.ctx.beginPath()
    this.ctx.rect(xPosition + mirrorOffsetX + this.leftMargin, yPosition + mirrorOffsetY + height - this.buttonHeight - this.bottomMargin, cancelTextWidth + this.leftMargin, this.buttonHeight);
    this.ctx.stroke()
    this.ctx.fill();

    this.ctx.save()
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(this.cancelText, (xPosition + mirrorOffsetX + this.leftMargin + this.buttonTextMargin + cancelTextWidth / 2), yPosition + mirrorOffsetY + height - this.bottomMargin - this.buttonFontSize)
    this.ctx.restore()

    this.ctx.save()
    this.ctx.beginPath()
    if (!this.okIsActive) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      // this.ctx.strokeStyle = 'grey';
    }
    this.ctx.rect(xPosition + mirrorOffsetX + width - 2 * this.leftMargin - okTextWidth, yPosition + mirrorOffsetY + height - this.buttonHeight - this.bottomMargin, okTextWidth + this.leftMargin, this.buttonHeight);
    this.ctx.stroke()
    this.ctx.fill();
    this.ctx.restore()

    this.ctx.save()
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(this.okText, (xPosition + mirrorOffsetX + width - 2 * this.leftMargin + this.buttonTextMargin - okTextWidth / 2), yPosition + mirrorOffsetY + height - this.bottomMargin - this.buttonFontSize)
    this.ctx.restore()

    this.ctx.restore()
  }

  setStartPoint = (startPoint: { x: number, y: number }) => {
    this.sizeOpt.xPosition = startPoint.x
    this.sizeOpt.yPosition = startPoint.y
  }

  setShouldDraw = (shouldDraw: boolean) => {
    this.shouldDraw = shouldDraw
    if (!shouldDraw) {
      this.radioSelected = undefined
    }
  }

  public get isShouldDraw(): boolean {
    return this.shouldDraw
  }

  public isClickOnElement(point: Point): boolean {
    const {xPosition, yPosition, width, height} = this.sizeOpt

    return this.shouldDraw && (
      point.x > xPosition
      && (point.x < xPosition + width)
      && point.y > yPosition
      && (point.y < yPosition + height)
    )
  }

  public clickedRadioElement(point: Point) {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    if (this.shouldDraw) {
      if (
        point.x > xPosition + this.leftMargin
        && (point.x < xPosition + width - this.leftMargin)
        && point.y > yPosition + this.radioInitOffset
        && (point.y < yPosition + this.radioInitOffset + this.radioSize)
      ) {
        this.radioSelected = 'remove_all'
      } else if (
        point.x > xPosition + this.leftMargin
        && (point.x < xPosition + width - this.leftMargin)
        && point.y > yPosition + this.radioInitOffset + this.radioVerticalOffset
        && (point.y < yPosition + this.radioInitOffset + +this.radioVerticalOffset + this.radioSize)
      ) {
        this.radioSelected = 'remove_changes'
      } else if (
        point.x > xPosition + this.leftMargin
        && (point.x < xPosition + width - this.leftMargin)
        && point.y > yPosition + this.radioInitOffset + 2 * this.radioVerticalOffset
        && (point.y < yPosition + this.radioInitOffset + 2 * this.radioVerticalOffset + this.radioSize)
      ) {
        this.radioSelected = 'insert_space'
      }
    }
  }

  public clickedCancel(point: Point) {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    if (this.shouldDraw) {
      const cancelTextWidth = this.ctx.measureText(this.cancelText).width

      if (
        point.x > xPosition + this.leftMargin
        && (point.x < xPosition + cancelTextWidth + this.leftMargin)
        && point.y > yPosition + height - this.buttonHeight - this.bottomMargin
        && (point.y < yPosition + height - this.bottomMargin)
      ) {
        this.setShouldDraw(false)
      }

    }
  }

  public clickedOk(point: Point): RemoveSpaceOption | undefined {
    const {xPosition, yPosition, width, height} = this.sizeOpt
    if (this.shouldDraw && this.okIsActive) {
      const okTextWidth = this.ctx.measureText(this.okText).width

      if (
        point.x > xPosition + width - 2 * this.leftMargin - okTextWidth
        && (point.x < xPosition + width - this.leftMargin - okTextWidth + okTextWidth)
        && point.y > yPosition + height - this.buttonHeight - this.bottomMargin
        && (point.y < yPosition + height - this.bottomMargin)
      ) {
        console.log('OK')
        return this.radioSelected
      }

    }
  }

  private get okIsActive(): boolean {
    return !!this.radioSelected
  }

  public get radioSelectedElement(): RemoveSpaceOption | undefined {
    return this.radioSelected
  }
}

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

export const drawText = (ctx: CanvasRenderingContext2D, text: string | number, textDraw: TEXT_DRAW_OPT) => {
  const {rectWidth, rectX, rectY, color = '#000000'} = textDraw

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



