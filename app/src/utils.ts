export type TIME_INTERVALS = 'day' | 'hour' | 'minutes' | 'seconds'

export type TIME_INTERVAL = {
  value: number,
  sec: number,
  largest: boolean
  getStringValue: (value: number) => string
}

export type TIME_LINE = Record<TIME_INTERVALS, TIME_INTERVAL> & { largest: TIME_INTERVALS }

export const convertSecToDay = (_seconds: number): TIME_LINE => {
  const day = Math.floor(_seconds / (24 * 3600));

  _seconds = _seconds % (24 * 3600);

  const hour = Math.floor(_seconds / 3600);

  _seconds %= 3600;
  const minutes = Math.floor(_seconds / 60);

  _seconds %= 60;
  const seconds = _seconds;

  let largest: TIME_INTERVALS = 'seconds'

  if (minutes > 0) {
    largest = 'minutes'
  }
  if (hour > 0) {
    largest = 'hour'
  }
  if (day > 0) {
    largest = 'day'
  }

  return {
    day: {
      value: day,
      sec: day * 24 * 3600,
      largest: day > 0,
      getStringValue: (value) => {
        return `${value} day`
      },
    },
    hour: {
      value: hour,
      sec: hour * 3600,
      largest: hour > 0 && day <= 0,
      getStringValue: (value) => {
        return `${value}:00:00`
      },

    },
    minutes: {
      value: minutes,
      sec: minutes * 60,
      largest: minutes > 0 && hour <= 0,
      getStringValue: (value) => {
        if (value >= 60) {
          let _hours = Math.floor(value / 60)
          const _minutes = Math.floor(value % 60)
          const minutesConverted = _minutes / 10 > 1 ? _minutes.toString() : `0${_minutes}`
          return `${_hours}:${minutesConverted}:00`
        }
        return `${value}:00`
      },
    },
    seconds: {
      value: seconds,
      sec: seconds,
      largest: minutes <= 0,
      getStirngValue: (value) => {
        return `${value}`
      },
    },
    largest
  }
}
