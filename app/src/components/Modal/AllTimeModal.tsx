import React, {useRef, useState} from 'react'

import s from './styles/ValuesModal.css'

interface AllTimeInputs {
  hours: string
  minutes: string
  seconds: string
}

interface Props {
  allTimeInputs: AllTimeInputs
  changeAllTime: (value: number) => boolean
  allTimeError: string
  closeModal: () => void
}

const toTotalSeconds = ({hours, minutes, seconds}: AllTimeInputs) =>
  +hours * 3600 + +minutes * 60 + +seconds

export const AllTimeModal = ({allTimeInputs, changeAllTime, allTimeError, closeModal}: Props) => {
  const [inputs, setInputs] = useState<AllTimeInputs>(allTimeInputs)
  // value at the moment the modal was opened - "Отмена" restores it
  const initialTotalRef = useRef(toTotalSeconds(allTimeInputs))

  const handleFieldChange = (field: keyof AllTimeInputs) => (e: React.FormEvent<HTMLInputElement>) => {
    // minutes/seconds: empty falls back to 0, a leading zero is dropped on input ("05" -> "5")
    const rawValue = field === 'hours' ? e.currentTarget.value : String(+e.currentTarget.value)

    // hours cannot be negative: only digits are allowed (reject "-", "+", etc.)
    if (field === 'hours') {
      if (!/^\d*$/.test(rawValue)) {
        return
      }
    }

    // minutes/seconds cannot exceed 59: reject the keystroke entirely (controlled input keeps its previous value)
    if (field !== 'hours') {
      if (!/^\d{1,2}$/.test(rawValue) || +rawValue > 59) {
        return
      }
    }

    const next = {...inputs, [field]: rawValue}
    setInputs(next)

    // apply immediately once all three fields are valid: hours - any non-negative integer, minutes/seconds - 0..59
    if (/^\d+$/.test(next.hours) && /^\d+$/.test(next.minutes) && /^\d+$/.test(next.seconds)) {
      changeAllTime(toTotalSeconds(next))
    }
  }

  // revert the form to the value captured on open, then close
  const cancel = () => {
    setInputs(allTimeInputs)
    changeAllTime(initialTotalRef.current)
    closeModal()
  }

  const inputStyle = {width: 80, padding: '5px 10px'}

  return (
    <div
      className={s.root}
      onKeyDown={(e) => {
        // Enter keeps the applied value, Escape behaves like "Отмена"
        if (e.key === 'Enter') {
          e.stopPropagation()
          closeModal()
        }
        if (e.key === 'Escape') {
          e.stopPropagation()
          cancel()
        }
      }}
    >
      <div className={s.content}>
        <header><h3>Set All Time</h3></header>
        <main>
          <div className={s.inputs} style={{display: 'flex', alignItems: 'center', minHeight: 42, justifyContent: 'space-between'}}>
            <div>
              <label htmlFor="all-time-hours">Hours</label>
              <br />
              <input
                id="all-time-hours"
                type="number"
                min={0}
                value={inputs.hours}
                onChange={handleFieldChange('hours')}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="all-time-minutes">Minutes</label>
              <br />
            <input
              id="all-time-minutes"
              type="number"
              min={0}
              max={59}
              value={inputs.minutes}
              onChange={handleFieldChange('minutes')}
              style={inputStyle}
            />
            </div>

            <div>
              <label htmlFor="all-time-seconds">Seconds</label>
              <br />
              <input
                id="all-time-seconds"
                type="number"
                min={0}
                max={59}
                value={inputs.seconds}
                onChange={handleFieldChange('seconds')}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{maxWidth: 350, paddingLeft: 10}}>
            {allTimeError ? <span style={{color: 'red'}}>{allTimeError}</span> : null}
          </div>

          <section className={s.buttons}>
            <button onClick={closeModal}>Apply</button>
            <button onClick={cancel}>Cancel</button>
          </section>
        </main>
      </div>
    </div>
  )
}
