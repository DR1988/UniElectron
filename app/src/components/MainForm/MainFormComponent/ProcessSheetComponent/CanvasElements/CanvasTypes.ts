import {Change} from '../../../MainFormInterfaces';

export type SIZE_OPT = {
  xPosition: number, yPosition: number, width: number, height: number,
  crossingValueStartWidth?: number,
  crossingValueEndWidth?: number
}
export type DRAW_RECT_OPT = {
  color?: string,
  height?: number,
  zoom?: number,
  text?: number | string,
  shouldSkipSizing?: boolean
  selectable?: boolean
}

export class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export type GetIsSelected = (point: Point) => boolean

export type DRAW_RECT_PARAMS = {
  ctx: CanvasRenderingContext2D, sizeOpt: SIZE_OPT, drawOpt?: DRAW_RECT_OPT
}

export type DRAW_RECT = (ctx: CanvasRenderingContext2D, sizeOpt: SIZE_OPT, drawOpt?: DRAW_RECT_OPT) => ({
  xPosition: number,
  yPosition: number,
  width: number,
  height: number
})

export type TEXT_DRAW_OPT = {
  rectWidth: number,
  rectX: number,
  rectY: number,
  color?: string
}

export type ChangeElementData = { lineId: number, changeElement: Change }

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
