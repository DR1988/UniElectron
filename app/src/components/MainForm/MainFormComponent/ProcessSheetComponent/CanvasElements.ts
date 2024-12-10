import {DRAW_RECT, DRAW_RECT_OPT, DRAW_RECT_PARAMS, Point, SIZE_OPT, TEXT_DRAW_OPT} from './CanvasTypes';
import {RECT_HEIGHT} from './CanvasConstants';
import React, {useMemo} from 'react';
import {convertSecToDay, getIntervalsFromSeconds} from '../../../../utils';
import throttle from 'lodash/throttle';
import moment from 'moment'

export type PositionSize = {
  xPosition,
  yPosition,
  width,
  height,
}

const log = throttle(console.log, 500)
const log2 = throttle(console.log, 500)
const log3 = throttle(console.log, 500)


export type ELEMENT_TYPES = 'COVER' | 'LINE' | 'CHANGE_ELEMENT' | 'SIDE_COVER' | 'TIME_LINE'

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

  protected constructor(type: Type, shouldSkipSizing: boolean, selectable: boolean) {
    this.type = type
    this.shouldSkipSizing = shouldSkipSizing
    this.selectable = selectable
  }

  abstract drawElement(): void


  returnDefaultColor = () => {
    this.drawOpt.color = this.defaultColor
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
  constructor(params: DRAW_RECT_PARAMS) {
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
    const {xPosition, yPosition, width, height} = this.sizeOpt
    const {color, text} = this.drawOpt || {}

    this.ctx.beginPath()
    this.ctx.fillStyle = color || 'rgba(171, 193, 197, 1)'


    this.ctx.fillRect(xPosition, yPosition, width, height || RECT_HEIGHT)
    this.ctx.fill()

    if (text !== undefined) {
      this.ctx.save()
      this.ctx.scale(1 / zoom, 1)
      drawText(this.ctx, text, {rectWidth: width * zoom, rectX: xPosition * zoom, rectY: yPosition})
      this.ctx.restore()
    }
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



