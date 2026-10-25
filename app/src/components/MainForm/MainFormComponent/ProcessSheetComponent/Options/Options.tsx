import React, {useCallback, useContext} from 'react';
import { ipcRenderer } from 'electron'
import styles from './Options.css'
import { ThemeContext } from '../../../../Main/Context';
import { OptionsContext } from '../../../../Main/OptionsContext';

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
  const {isThermostatCheck, setThermostatCheck, flashFirmware} = useContext(OptionsContext)

  const clickFlash = useCallback(() => {
    ipcRenderer.invoke('dialog:open', {
      defaultPath: '',
      title: 'Выбрать прошивку (Intel HEX)',
      filters: [{
        extensions: ['hex'],
        name: ''
      }],
    }).then(({filePaths}: {filePaths: string[]}) => {
      if (filePaths.length) {
        flashFirmware(filePaths[0])
      }
    })
  }, [flashFirmware])

  const _toggleOptions = useCallback(() => {
    toggleOptions(!isOptionsOpen)
  }, [isOptionsOpen])

  const clickThermostatCheck = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setThermostatCheck(event.currentTarget.checked)
  }, [setThermostatCheck])

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

            <label className={styles.label} htmlFor={'setMovement'}>
              <input
                checked={isMovement}
                id='setMovement'
                onChange={clickCheckBox}
                className={styles.input}
                type="checkbox"/>
              Follow time line
            </label>

            <label className={styles.label} htmlFor={'setDarkTheme'}>
              <input
                checked={theme === 'dark'}
                id='setDarkTheme'
                onChange={clickChangeTheme}
                className={styles.input}
                type="checkbox"/>
                Dark Theme
            </label>

  
            <label className={styles.label} htmlFor={'setThermostatCheck'}>
              <input
              checked={isThermostatCheck}
                id='setThermostatCheck'
                onChange={clickThermostatCheck}
                className={styles.input}
                type="checkbox"/>
                Thermostat check
            </label>

        <div className={styles.divider} />

        <div className={styles.buttonContainer}>
          <button className={styles.flashButton} onClick={clickFlash}>Flash firmware</button>
        </div>
        
      </div>
    </div> : null}
  </div>
}
