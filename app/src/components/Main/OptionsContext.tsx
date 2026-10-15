import React, { createContext, FC, useState } from 'react'
import ClickOutHandler from 'react-onclickout'

import { Options } from '../MainForm/MainFormComponent/ProcessSheetComponent/Options/Options'

export type OptionsContextProp = {
  isOptionsOpen: boolean
  toggleOptions: (value: boolean) => void
  isMovement: boolean
  setMovement: (value: boolean) => void
}

const defaultContext: OptionsContextProp = {
  isOptionsOpen: false,
  toggleOptions() {},
  isMovement: false,
  setMovement() {},
}

export const OptionsContext = createContext<OptionsContextProp>(defaultContext)

export const OptionsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOptionsOpen, toggleOptions] = useState(false)
  const [isMovement, setMovement] = useState(false)

  return (
    <OptionsContext.Provider value={{ isOptionsOpen, toggleOptions, isMovement, setMovement }}>
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
