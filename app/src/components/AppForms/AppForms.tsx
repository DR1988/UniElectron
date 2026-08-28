import React, { useEffect, useRef, useState } from 'react'

import cn from 'classnames'
import io from 'socket.io-client'

import s from './AppForms.css'

import Graphs from '../Graphs/Graphs'
import MainForm from '../MainForm/MainForm'

import socketConfig from '../../../config/socket.config'

interface Props {
  currentForm: string
}

interface Error {
  name: string
  message: string
}

export default function AppForms({ currentForm }: Props) {
  const [error, setError] = useState<Error | null>(null)

  const socket = useRef<SocketIOClient.Socket | null>(io(`${location.origin}`))

  useEffect(() => {
    socket.current.on(socketConfig.thermoStatInitError, (error: Error) => {
      setError(error)
    })

    return () => {
      socket.current?.removeAllListeners()
      socket.current?.disconnect()
    }
  }, [])

  const acceptError = () => {
    setError(null)
  }

  const isMainForm = currentForm === 'MainForm'

  return (
    <div className={s.container}>
      <div
        className={cn(
          { [s.showSide]: isMainForm },
          { [s.hideSide]: !isMainForm },
        )}
      >
        <MainForm socket={socket.current} />
      </div>

      <div
        className={cn(
          { [s.showSide]: !isMainForm },
          { [s.hideSide]: isMainForm },
        )}
      >
        <Graphs socket={socket.current} />
      </div>

      <section
        className={cn(
          s.modal_container,
          { [s.modal_container_error]: !!error },
        )}
      >
        <div
          className={cn(
            s.modal_content,
            { [s.modal_content_error]: !!error },
          )}
        >
          <h5 className={s.text}>
            {error && error.message}
          </h5>

          <button onClick={acceptError}>
            Close
          </button>
        </div>
      </section>
    </div>
  )
}
