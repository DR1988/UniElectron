import React from 'react'
import { createRoot } from 'react-dom/client'

import Main from './components/Main/Main'
import { ThemeProvider } from './components/Main/Context'
import { OptionsProvider } from './components/Main/OptionsContext'

const container = document.getElementById('root')!
createRoot(container).render(
  <ThemeProvider>
    <OptionsProvider>
      <Main />
    </OptionsProvider>
  </ThemeProvider>,
)
