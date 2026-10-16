import React from 'react'

interface Props {
  allTimeInputs: {hours: string, minutes: string, seconds: string}
  onFieldChange: (field: 'hours' | 'minutes' | 'seconds') => (e: React.FormEvent<HTMLInputElement>) => void
  allTimeError: string
  closeModal: () => void
}

export const AllTimeModal = ({allTimeInputs, onFieldChange, allTimeError, closeModal}: Props) => {

  return (
    <div style={{backgroundColor: '#ffffff', color: '#000', padding: 10}}>
      <div style={{display: 'flex', alignItems: 'center', minHeight: 42}}>
        <label htmlFor="all-time-hours" style={{marginRight: 8}}>All time</label>
        <input
          id="all-time-hours"
          type="number"
          value={allTimeInputs.hours}
          onChange={onFieldChange('hours')}
          style={{width: 60, padding: '5px 10px'}}
        />
        <span style={{margin: '0 10px 0 5px'}}>h</span>
        <input
          id="all-time-minutes"
          type="number"
          value={allTimeInputs.minutes}
          onChange={onFieldChange('minutes')}
          style={{width: 60, padding: '5px 10px'}}
        />
        <span style={{margin: '0 10px 0 5px'}}>m</span>
        <input
          id="all-time-seconds"
          type="number"
          value={allTimeInputs.seconds}
          onChange={onFieldChange('seconds')}
          style={{width: 60, padding: '5px 10px'}}
        />
        <span style={{margin: '0 10px 0 5px'}}>s</span>
        {allTimeError ? <span style={{marginLeft: 10, color: 'red'}}>{allTimeError}</span> : null}
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  )
}
