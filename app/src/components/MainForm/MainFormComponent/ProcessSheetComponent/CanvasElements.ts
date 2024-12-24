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
  private timeTextFontSize = 12
  private borderWidth = 3

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

      if (this.drawOpt.color === this.defaultColor) {
        this.ctx.fillStyle = 'black';
        // this.ctx.fillStyle = 'blue';
      } else {
        this.ctx.fillStyle = 'white';
        // this.ctx.fillStyle = 'blue';
      }
      this.ctx.font = `bold ${this.timeTextFontSize}px Arial, Helvetica, sans-serif`
      this.ctx.textAlign = "start";
      this.ctx.scale(1 / zoom, 1)

      const textLeft = Math.round(this.sizeOpt.xPosition / this.ctx.canvas.width * this.allTime)
      const textRight = Math.round((this.sizeOpt.xPosition + this.sizeOpt.width) / this.ctx.canvas.width * this.allTime)

      const startTime = getTime(textLeft)
      const endTime = getTime(textRight)

      const startTimeTextWidth = this.ctx.measureText(startTime).width
      const endTimeTextWidth = this.ctx.measureText(endTime).width

      let endTimeTextOffsetY = 0
      if (startTimeTextWidth + endTimeTextWidth >= width * zoom - 2 * this.timeTextOffsetX - 5) {
        endTimeTextOffsetY = 1
      }

      const startTextIsBig = this.ctx.measureText(startTime).width > width * zoom - 2 * this.borderWidth
      const endTextIsBig = this.ctx.measureText(endTime).width > width * zoom - 2 * this.borderWidth

      if (startTextIsBig) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.rect(xPosition, height - endTimeTextOffsetY * (this.timeTextFontSize + 2), width, RECT_HEIGHT)
        this.ctx.clip()
        this.ctx.fillText(startTime, xPosition * zoom + this.timeTextOffsetX, height);
        this.ctx.restore()
      } else {
        this.ctx.fillText(startTime, xPosition * zoom + this.timeTextOffsetX, height)
      }

      if (endTextIsBig) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.rect(xPosition, height - 2 * endTimeTextOffsetY * (this.timeTextFontSize + 2), width, RECT_HEIGHT)
        this.ctx.clip()
        this.ctx.fillText(endTime, (xPosition + width) * zoom - endTimeTextWidth - this.timeTextOffsetX, height - endTimeTextOffsetY * (this.timeTextFontSize + 2))
        this.ctx.restore()
      } else {
        this.ctx.fillText(endTime, (xPosition + width) * zoom - endTimeTextWidth - this.timeTextOffsetX, height - endTimeTextOffsetY * (this.timeTextFontSize + 2))
      }
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

}

export class ContextMenu extends DrawingElement<'CONTEXT_MENU'> {
  private shouldDraw: boolean = false

  private radioSize = 15
  private radioInitOffset = 20
  private radioVerticalOffset = 25
  private leftMargin = 10
  private leftInnerRadioButtonMargin = 2
  private fillInnerRadioButtonMargin = 4
  private leftTextRadioButtonMargin = 35
  private bottomMargin = 10
  private buttonTextMargin = 5
  private buttonHeight = 20
  private buttonFontSize = 16
  private radioSelected: RemoveSpaceOption | undefined
  private cancelText = 'Cancel'
  private cancelTextWidth: number = 0
  private okText = 'OK'
  private okTextWidth: number = 0

  public elementsPosition: {
    drawSheet: {
      xPosition: number,
      yPosition: number
    },
    drawRadioButtons: Record<RemoveSpaceOption, {
      xPosition: number,
      yPosition: number
    }>,
    drawButtons: Record<'Cancel' | 'OK', {
      xPosition: number,
      yPosition: number
    }>
  } = {
    drawSheet: {
      xPosition: 0,
      yPosition: 0
    },
    drawRadioButtons: {
      remove_all: {xPosition: 0, yPosition: 0},
      remove_changes: {xPosition: 0, yPosition: 0},
      insert_space: {xPosition: 0, yPosition: 0},
    },
    drawButtons: {
      Cancel: {xPosition: 0, yPosition: 0},
      OK: {xPosition: 0, yPosition: 0},
    }
  }

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

    this.elementsPosition.drawSheet.xPosition = xPosition + mirrorOffsetX
    this.elementsPosition.drawSheet.yPosition = yPosition + mirrorOffsetY

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

    this.ctx.save()

    this.ctx.fillStyle = 'black';
    this.ctx.font = "bold 15px Arial, Helvetica, sans-serif"
    this.ctx.textBaseline = "bottom";

    const xRadioPosition = xPosition + this.leftMargin + mirrorOffsetX
    const remove_allYPosition = yPosition + mirrorOffsetY + this.radioInitOffset
    const remove_changesYPosition = yPosition + mirrorOffsetY + this.radioInitOffset + this.radioVerticalOffset
    const insert_spaceYPosition = yPosition + mirrorOffsetY + this.radioInitOffset + 2 * this.radioVerticalOffset

    this.elementsPosition.drawRadioButtons.remove_all = {
      xPosition: xRadioPosition,
      yPosition: remove_allYPosition
    }

    this.elementsPosition.drawRadioButtons.remove_changes = {
      xPosition: xRadioPosition,
      yPosition: remove_changesYPosition
    }

    this.elementsPosition.drawRadioButtons.insert_space = {
      xPosition: xRadioPosition,
      yPosition: insert_spaceYPosition
    }

    this.ctx.beginPath()
    this.ctx.rect(xRadioPosition, remove_allYPosition, this.radioSize, this.radioSize);
    this.ctx.fillText('Remove all', (xPosition + this.leftTextRadioButtonMargin) + mirrorOffsetX, remove_allYPosition + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'remove_all') {
      this.ctx.beginPath()
      this.ctx.rect(xRadioPosition + this.leftInnerRadioButtonMargin, remove_allYPosition + this.leftInnerRadioButtonMargin, this.radioSize - this.fillInnerRadioButtonMargin, this.radioSize - this.fillInnerRadioButtonMargin);
      this.ctx.fill()
    }

    this.ctx.beginPath()
    this.ctx.rect(xRadioPosition, remove_changesYPosition, this.radioSize, this.radioSize);
    this.ctx.fillText('Remove changes', (xPosition + this.leftTextRadioButtonMargin) + mirrorOffsetX, remove_changesYPosition + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'remove_changes') {
      this.ctx.beginPath()
      this.ctx.rect(xRadioPosition + this.leftInnerRadioButtonMargin, remove_changesYPosition + this.leftInnerRadioButtonMargin, this.radioSize - this.fillInnerRadioButtonMargin, this.radioSize - this.fillInnerRadioButtonMargin);
      this.ctx.fill()
    }

    this.ctx.beginPath()
    this.ctx.rect(xRadioPosition, insert_spaceYPosition, this.radioSize, this.radioSize);
    this.ctx.fillText('Insert space', (xPosition + this.leftTextRadioButtonMargin) + mirrorOffsetX, insert_spaceYPosition + this.radioSize)
    this.ctx.stroke();

    if (this.radioSelected === 'insert_space') {
      this.ctx.beginPath()
      this.ctx.rect(xRadioPosition + this.leftInnerRadioButtonMargin, insert_spaceYPosition + this.leftInnerRadioButtonMargin, this.radioSize - 4, this.radioSize - 4);
      this.ctx.fill()
    }
    this.ctx.restore()
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

    this.cancelTextWidth = this.cancelTextWidth || this.ctx.measureText(this.cancelText).width
    this.okTextWidth = this.okTextWidth || this.ctx.measureText(this.okText).width

    const cancelButtonXPosition = xPosition + mirrorOffsetX + this.leftMargin
    const cancelButtonYPosition = yPosition + mirrorOffsetY + height - this.buttonHeight - this.bottomMargin

    this.elementsPosition.drawButtons.Cancel = {
      xPosition: cancelButtonXPosition,
      yPosition: cancelButtonYPosition
    }


    const okButtonXPosition = xPosition + mirrorOffsetX + width - 2 * this.leftMargin - this.okTextWidth
    const okButtonYPosition = yPosition + mirrorOffsetY + height - this.buttonHeight - this.bottomMargin

    this.elementsPosition.drawButtons.OK = {
      xPosition: okButtonXPosition,
      yPosition: okButtonYPosition
    }

    this.ctx.beginPath()
    this.ctx.rect(cancelButtonXPosition, cancelButtonYPosition, this.cancelTextWidth + this.leftMargin, this.buttonHeight);
    this.ctx.stroke()
    this.ctx.fill();

    this.ctx.save()
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(this.cancelText, (cancelButtonXPosition + this.buttonTextMargin + this.cancelTextWidth / 2), yPosition + mirrorOffsetY + height - this.bottomMargin - this.buttonFontSize)
    this.ctx.restore()

    this.ctx.save()
    this.ctx.beginPath()
    if (!this.okIsActive) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      // this.ctx.strokeStyle = 'grey';
    }
    this.ctx.rect(okButtonXPosition, okButtonYPosition, this.okTextWidth + this.leftMargin, this.buttonHeight);
    this.ctx.stroke()
    this.ctx.fill();
    this.ctx.restore()

    this.ctx.save()
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(this.okText, (xPosition + mirrorOffsetX + width - 2 * this.leftMargin + this.buttonTextMargin - this.okTextWidth / 2), yPosition + mirrorOffsetY + height - this.bottomMargin - this.buttonFontSize)
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
    const {width, height} = this.sizeOpt
    const {xPosition, yPosition} = this.elementsPosition.drawSheet

    return this.shouldDraw && (
      point.x > xPosition
      && (point.x < xPosition + width)
      && point.y > yPosition
      && (point.y < yPosition + height)
    )
  }

  public clickedRadioElement(point: Point) {
    const {remove_all, remove_changes, insert_space} = this.elementsPosition.drawRadioButtons
    const {width} = this.sizeOpt

    if (this.shouldDraw) {
      if (
        point.x > remove_all.xPosition
        && (point.x < remove_all.xPosition + width - this.leftMargin)
        && point.y > remove_all.yPosition
        && (point.y < remove_all.yPosition + this.radioSize)
      ) {
        this.radioSelected = 'remove_all'
      } else if (
        point.x > remove_changes.xPosition
        && (point.x < remove_changes.xPosition + width - this.leftMargin)
        && point.y > remove_changes.yPosition
        && (point.y < remove_changes.yPosition + this.radioSize)
      ) {
        this.radioSelected = 'remove_changes'
      } else if (
        point.x > insert_space.xPosition
        && (point.x < insert_space.xPosition + width - this.leftMargin)
        && point.y > insert_space.yPosition
        && (point.y < insert_space.yPosition + this.radioSize)
      ) {
        this.radioSelected = 'insert_space'
      }
    }
  }

  public clickedCancel(point: Point) {
    const {xPosition, yPosition} = this.elementsPosition.drawButtons.Cancel
    if (this.shouldDraw) {
      if (
        point.x > xPosition
        && (point.x < xPosition + this.cancelTextWidth + this.leftMargin)
        && point.y > yPosition
        && (point.y < yPosition + this.buttonHeight)
      ) {
        this.setShouldDraw(false)
      }

    }
  }

  public clickedOk(point: Point): RemoveSpaceOption | undefined {
    const {xPosition, yPosition} = this.elementsPosition.drawButtons.OK

    if (this.shouldDraw && this.okIsActive) {

      if (
        point.x > xPosition
        && (point.x < xPosition + this.okTextWidth + this.leftMargin)
        && point.y > yPosition
        && (point.y < yPosition + this.buttonHeight)
      ) {
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



