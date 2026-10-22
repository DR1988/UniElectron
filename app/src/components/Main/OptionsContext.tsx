import React, { createContext, FC, useEffect, useRef, useState } from 'react'
import ClickOutHandler from 'react-onclickout'
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
}

const defaultContext: OptionsContextProp = {
  isOptionsOpen: false,
  toggleOptions() {},
  isMovement: false,
  setMovement() {},
  isThermostatCheck: true,
  setThermostatCheck() {},
}

export const OptionsContext = createContext<OptionsContextProp>(defaultContext)

export const OptionsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOptionsOpen, toggleOptions] = useState(false)
  const [isMovement, setMovement] = useState(false)
  const [isThermostatCheck, setIsThermostatCheck] = useState(true)

  // отдельное соединение для передачи переключателя на сервер (controller - singleton)
  const socket = useRef<SocketIOClient.Socket | null>(io(`${location.origin}`))

  useEffect(() => {
    return () => {
      socket.current?.removeAllListeners()
      socket.current?.disconnect()
    }
  }, [])

  const setThermostatCheck = (value: boolean) => {
    setIsThermostatCheck(value)
    socket.current?.emit(socketConfig.setThermostatCheck, value)
  }

  return (
    <OptionsContext.Provider value={{ isOptionsOpen, toggleOptions, isMovement, setMovement, isThermostatCheck, setThermostatCheck }}>
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
