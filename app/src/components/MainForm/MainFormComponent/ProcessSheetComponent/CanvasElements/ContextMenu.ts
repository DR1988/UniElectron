import {RemoveSpaceOption} from '../../../../CommonTypes';
import {DRAW_RECT_PARAMS, DrawingElement, Point} from './CanvasTypes';

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
