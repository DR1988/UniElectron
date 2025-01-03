import moment from 'moment';

export type TIME_INTERVALS = 'day' | 'hour' | 'minutes' | 'seconds'

export type TIME_INTERVAL = {
  value: number,
  sec: number,
  largest: boolean
  getStringValue: (value: number) => string
}

export type TIME_LINE = Record<TIME_INTERVALS, TIME_INTERVAL> & { largest: TIME_INTERVALS }
export type TIME_VALUES = Record<TIME_INTERVALS, number>

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
        let _hours = Math.floor(value / 60)
        const _minutes = Math.floor(value % 60)
        const _minutesPart = value - _minutes
        const minutesConverted = _minutes / 10 >= 1 ? _minutes.toString() : `0${_minutes}`

        if (_hours) {
          return `${_hours}:${minutesConverted}:${_minutesPart === 0 ? '00' : _minutesPart * 60}`
        }
        return `${minutesConverted}:${_minutesPart === 0 ? '00' : _minutesPart * 60}`

      },
    },
    seconds: {
      value: seconds,
      sec: seconds,
      largest: minutes <= 0,
      getStringValue: (value) => {
        return `${value}`
      },
    },
    largest
  }
}


export const getIntervalsFromSeconds = (_seconds: number) => {
  const day = Math.floor(_seconds / (24 * 3600));

  if (day > 0) {
    return `${day > 9 ? day : `0${day}`}:${moment.utc(_seconds * 1000).format('HH:mm')}`
  }

  _seconds = _seconds % (24 * 3600);

  const hour = Math.floor(_seconds / 3600);

  if (hour > 0) {
    return moment.utc(_seconds * 1000).format('HH:mm:ss')
  }
  _seconds %= 3600;
  const minutes = Math.floor(_seconds / 60);


  if (minutes > 0) {
    return moment.utc(_seconds * 1000).format('mm:ss')
  }
  _seconds %= 60;

  return moment.utc(_seconds * 1000).format('mm:ss')
}

export const getTime = (time: number) => {
  const result = convertSecToDay(time)

  const {value: dayValue} = result['day']
  const {value: hourValue} = result['hour']
  const {value: minuteValue} = result['minutes']
  const {value: secondValue} = result['seconds']
  const _secondValue = secondValue / 10 >= 1 ? secondValue : `0${secondValue}`
  const _minuteValue = minuteValue / 10 >= 1 ? minuteValue : `0${minuteValue}`
  const _hourValue = hourValue / 10 >= 1 ? hourValue : `0${hourValue}`

  if (dayValue) {
    return `${dayValue}:${_hourValue}:${_minuteValue}:${_secondValue}`
  } else if (_hourValue) {
    return `${_hourValue}:${_minuteValue}:${_secondValue}`
  } else if (minuteValue) {
    return `${_minuteValue}:${_secondValue}`
  }
  return `${_secondValue}`
}

export const getDaysFromSeconds = (_seconds: number): TIME_VALUES => {
  const day = Math.floor(_seconds / (24 * 3600));

  _seconds = _seconds % (24 * 3600);

  const hour = Math.floor(_seconds / 3600);

  _seconds %= 3600;
  const minutes = Math.floor(_seconds / 60);

  _seconds %= 60;
  const seconds = _seconds;

  return {
    day,
    hour,
    minutes,
    seconds
  }
}

export type TIME_RECORD = {
  value: number
  interval: TIME_INTERVALS
  maxValue: number
}

export const getTimeIntervalsFromSeconds = (_seconds: number):  TIME_RECORD[] => {
  const result: TIME_RECORD[]  = []

  const day = Math.floor(_seconds / (24 * 3600));

  if (day) {
    result.push({value: day, interval: 'day', maxValue: Number.MAX_VALUE})
  }

  _seconds = _seconds % (24 * 3600);

  const hour = Math.floor(_seconds / 3600);

  if (hour) {
    result.push({value: hour, interval: 'hour', maxValue: 23})
  }


  _seconds %= 3600;
  const minutes = Math.floor(_seconds / 60);

  if (minutes) {
    result.push({value: minutes, interval: 'minutes', maxValue: 59})
  }

  _seconds %= 60;
  const seconds = _seconds;

  if (seconds) {
    result.push({value: seconds, interval: 'seconds', maxValue: 59})
  }

  return result
}
