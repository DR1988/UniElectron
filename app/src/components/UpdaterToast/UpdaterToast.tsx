import React, { useContext, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'

import { ThemeContext } from '../Main/Context'
import s from './UpdaterToast.css'

type UpdaterStatus =
  | {status: 'checking'}
  | {status: 'available'; version: string}
  | {status: 'not-available'; version?: string}
  | {status: 'downloading'; percent: number}
  | {status: 'error'; message: string}
  | {status: 'downloaded'}

type Toast = {
  text: string,
  kind: 'info' | 'error'
}

export default function UpdaterToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const versionRef = useRef('')
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const show = (next: Toast, autoHideMs?: number) => {
      setToast(next)
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
      if (autoHideMs) {
        hideTimerRef.current = setTimeout(() => setToast(null), autoHideMs)
      }
    }

    const onStatus = (_event, payload: UpdaterStatus) => {
      switch (payload.status) {
        case 'checking':
          show({text: 'Проверка обновлений…', kind: 'info'}, 10000)
          break
        case 'available':
          versionRef.current = payload.version
          show({text: `Доступно обновление v${payload.version} — загрузка… 0%`, kind: 'info'})
          break
        case 'downloading':
          show({text: `Доступно обновление v${versionRef.current} — загрузка… ${payload.percent}%`, kind: 'info'})
          break
        case 'not-available':
          show({text: 'У вас последняя версия', kind: 'info'}, 3000)
          break
        case 'error':
          show({text: `Ошибка обновления: ${payload.message}`, kind: 'error'}, 10000)
          break
        case 'downloaded':
          setToast(null)
          break
      }
    }

    ipcRenderer.on('updater-status', onStatus)
    return () => {
      ipcRenderer.removeListener('updater-status', onStatus)
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  const {theme} = useContext(ThemeContext)

  if (!toast) {
    return null
  }

  return <div className={`${s.toast} ${theme === 'dark' ? s.dark : s.light} ${toast.kind === 'error' ? s.error : ''}`}>
    {toast.text}
  </div>
}
