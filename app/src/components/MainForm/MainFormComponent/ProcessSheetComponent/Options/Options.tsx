import React, {useCallback} from 'react';
import styles from './Options.css'

type Props = {
  toggleOptions: (value: boolean) => void
  setMovement: (value: boolean) => void
  isOptionsOpen: boolean
  isMovement: boolean
}

export const Options: React.FC<Props> = (
  {
    toggleOptions,
    setMovement,
    isOptionsOpen,
    isMovement,
  }) => {


  const _toggleOptions = useCallback(() => {
    toggleOptions(!isOptionsOpen)
  }, [isOptionsOpen])

  const clickCheckBox = useCallback((event: React.SyntheticEvent<InputEvent>) => {
    setMovement(event.target.checked)
  }, [])

  return <div className={styles.container}>
    <button className={styles.button} onClick={_toggleOptions}>options
    </button>
    {isOptionsOpen ? <div className={styles.content}>
      <div className={styles.innerContent}>
        <input
          checked={isMovement}
          id='setMovement'
          onChange={clickCheckBox}
          className={styles.input}
          type="checkbox"/>
        <label className={styles.label} htmlFor={'setMovement'}>Follow time line</label>
      </div>
    </div> : null}
  </div>
}
