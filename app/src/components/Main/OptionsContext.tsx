import React, { createContext, FC, useEffect, useRef, useState } from 'react'
import ClickOutHandler from '../HOC/ClickOutHandler'
import io from 'socket.io-client'

import socketConfig from '../../../config/socket.config'
import { Options } from '../MainForm/MainFormComponent/ProcessSheetComponent/Options/Options'

export type OptionsContextProp = {
  isOptionsOpen: boolean
  toggleOptions: (value: boolean) => void
  isMovement: boolean
  setMovement: (value: boolean) => void
  isThermostatCheck: boolean
  setThermostatCheck: (value: boolean) => void
  flashFirmware: (hexPath: string) => void
}

const defaultContext: OptionsContextProp = {
  isOptionsOpen: false,
  toggleOptions() {},
  isMovement: false,
  setMovement() {},
  isThermostatCheck: true,
  setThermostatCheck() {},
  flashFirmware() {},
}

export const OptionsContext = createContext<OptionsContextProp>(defaultContext)

export const OptionsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOptionsOpen, toggleOptions] = useState(false)
  const [isMovement, setMovement] = useState(false)
  // состояние переключателя восстанавливается из localStorage, по умолчанию включен
  const [isThermostatCheck, setIsThermostatCheck] = useState(() =>
    localStorage.getItem('thermostatCheck') !== 'false'
  )

  // отдельное соединение для передачи переключателя на сервер (controller - singleton)
  const socket = useRef<SocketIOClient.Socket | null>(io(`${location.origin}`))

  useEffect(() => {
    // сервер стартует со значением true - синхронизируем его с восстановленным
    socket.current?.emit(socketConfig.setThermostatCheck, isThermostatCheck)
    return () => {
      socket.current?.removeAllListeners()
      socket.current?.disconnect()
    }
  }, [])

  const setThermostatCheck = (value: boolean) => {
    setIsThermostatCheck(value)
    localStorage.setItem('thermostatCheck', String(value))
    socket.current?.emit(socketConfig.setThermostatCheck, value)
  }

  const flashFirmware = (hexPath: string) => {
    socket.current?.emit(socketConfig.flashFirmware, hexPath)
  }

  return (
    <OptionsContext.Provider value={{ isOptionsOpen, toggleOptions, isMovement, setMovement, isThermostatCheck, setThermostatCheck, flashFirmware }}>
      {children}
      <ClickOutHandler onClickOut={() => toggleOptions(false)}>
        <Options
          toggleOptions={toggleOptions}
          setMovement={setMovement}
          isOptionsOpen={isOptionsOpen}
          isMovement={isMovement}
        />
      </ClickOutHandler>
    </OptionsContext.Provider>
  )
}
