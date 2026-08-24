import React, {useCallback, useContext} from 'react';
import styles from './Options.css'
import { ThemeContext } from '../../../../Main/Context';

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

  const {theme, toggleTheme} = useContext(ThemeContext)

  const _toggleOptions = useCallback(() => {
    toggleOptions(!isOptionsOpen)
  }, [isOptionsOpen])

  const clickCheckBox = useCallback((event: React.SyntheticEvent<InputEvent>) => {
    setMovement(event.target.checked)
  }, [])

   const clickChangeTheme = useCallback(() => {
    toggleTheme()
  }, [])

  return <div className={styles.container}>
    <button className={styles.button} onClick={_toggleOptions}>options
    </button>
    {isOptionsOpen ? <div className={styles.content}>
      <div className={styles.innerContent}>
        <div>
          <input
            checked={isMovement}
            id='setMovement'
            onChange={clickCheckBox}
            className={styles.input}
            type="checkbox"/>
          <label className={styles.label} htmlFor={'setMovement'}>Follow time line</label>
        </div>
        <div>
          <input
            checked={theme === 'dark'}
            id='setDarkTheme'
            onChange={clickChangeTheme}
            className={styles.input}
            type="checkbox"/>
          <label className={styles.label} htmlFor={'setDarkTheme'}>Dark Theme</label>
        </div>
        
      </div>
    </div> : null}
  </div>
}
