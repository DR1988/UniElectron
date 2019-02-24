import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Main from './components/Main/Main'

render(
  <AppContainer>
    <Main />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./components/Main/Main', () => {
    // eslint-disable-next-line global-require
    const NextMain = require('./components/Main/Main').default
    render(
      <AppContainer>
        <NextMain />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
