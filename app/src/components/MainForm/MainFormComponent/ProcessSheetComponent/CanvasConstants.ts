export const DPR =  1// window.devicePixelRatio || 1

export const STEP = 1
export const MIN_SCALE_FACTOR = 15
export const MAX_VISIBLE_WINDOW_SECONDS = 20 * 60 // при максимальном зуме во временное окно помещается не больше 20 минут

// для протоколов длиннее часа коэффициент пересчитывается так, чтобы видимое окно на макс. зуме было <= 20 минут
export const getMaxScaleFactor = (allTime: number) =>
  Math.max(MIN_SCALE_FACTOR, Math.ceil(allTime / MAX_VISIBLE_WINDOW_SECONDS))

// чем больше протокол, тем крупнее шаг зума: от минимального до максимального масштаба ~15 щелчков колеса
export const getZoomStep = (allTime: number) =>
  Math.max(STEP, Math.round(getMaxScaleFactor(allTime) / MIN_SCALE_FACTOR))
export const AUTO_PAN_MARGIN = 30 // px from the canvas edge that triggers auto-panning while dragging
export const AUTO_PAN_STEP = 15 // px of view shift per mousemove event during auto-panning
export const RECT_HEIGHT = 30
export const MIN_CANVAS_WIDTH = 600

//canvas height
export const LEGEND_HEIGHT = 91
export const LINE_HEIGHT = 30
export const LINE_GAP = 5
export const TIME_LINE_HEIGHT = 25
