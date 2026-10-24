// Dev-only: инициализация runtime React Fast Refresh (заменяет react-hot-loader)
import ReactRefreshRuntime from 'react-refresh/runtime'

declare global {
  interface Window {
    $RefreshReg$: () => void
    $RefreshSig$: () => (type: unknown) => unknown
  }
}

ReactRefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
