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
  short: string,
  kind: 'info' | 'error'
}

export default function UpdaterToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const versionRef = useRef('')
  const activeRef = useRef(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const clear = () => {
      activeRef.current = false
      setToast(null)
    }

    const show = (next: Toast, autoHideMs?: number) => {
      // новый тост (после скрытия предыдущего) показываем развёрнутым
      if (!activeRef.current) {
        setCollapsed(false)
      }
      activeRef.current = true
      setToast(next)
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
      if (autoHideMs) {
        hideTimerRef.current = setTimeout(clear, autoHideMs)
      }
    }

    const onStatus = (_event, payload: UpdaterStatus) => {
      switch (payload.status) {
        case 'checking':
          show({text: 'Проверка обновлений…', short: '⟳', kind: 'info'}, 10000)
          break
        case 'available':
          versionRef.current = payload.version
          show({text: `Доступно обновление v${payload.version} — загрузка… 0%`, short: '0%', kind: 'info'})
          break
        case 'downloading':
          show({text: `Доступно обновление v${versionRef.current} — загрузка… ${payload.percent}%`, short: `${payload.percent}%`, kind: 'info'})
          break
        case 'not-available':
          show({text: 'У вас последняя версия', short: '✓', kind: 'info'}, 3000)
          break
        case 'error':
          show({text: `Ошибка обновления: ${payload.message}`, short: '!', kind: 'error'}, 10000)
          break
        case 'downloaded':
          clear()
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

  const themeClass = theme === 'dark' ? s.dark : s.light
  const kindClass = toast.kind === 'error' ? s.error : ''

  if (collapsed) {
    // свёрнутый вид — компактная плашка, клик по ней разворачивает тост
    return <div className={`${s.toast} ${s.collapsed} ${themeClass} ${kindClass}`} >

      <div className={s.collapseContainer}>
        <div title="Развернуть" onClick={() => setCollapsed(false)} className={s.collapseRound}>
          <div  className={`${s.collapse} ${s.shortCollapse}`}/>
        </div>
      </div>

      <div className={s.content}>
        <span className={s.text}>{toast.short}</span>
      </div>
      
    </div>
  }

  return <div className={`${s.toast} ${themeClass} ${kindClass}`}>

    <div className={s.collapseContainer}>
      <div title="Свернуть" onClick={() => setCollapsed(true)} className={s.collapseRound}>
        <div className={s.collapse} />
      </div>
    </div>

    <div className={s.content}>
      <span className={s.text}>{toast.text}</span>
    </div>
  </div>
}
