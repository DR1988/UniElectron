import {Change} from '../../MainFormInterfaces';

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
