import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Main from './ui/components/Main/Main'

render(
  <AppContainer>
    <Main />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./ui/components/Main/Main', () => {
    // eslint-disable-next-line global-require
    const NextMain = require('./ui/components/Main/Main').default
    render(
      <AppContainer>
        <NextMain />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
