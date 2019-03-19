import React from 'react'
import cn from 'classnames'
import io from 'socket.io-client'

import s from './AppForms.css'
import Graphs from '../Graphs/Graphs'
import MainForm from '../MainForm/MainForm'

const socket = io(`${location.origin}`)

interface Props {
  currentForm: string,
}

const AppForms = ({ currentForm }: Props) => {
  const isMainForm = currentForm === 'MainForm'
  return (
  <div className={s.container}>
    <div
      className={
        cn({ [s.showSide]: isMainForm },
          { [s.hideSide]: !isMainForm },
        )}
    >
      isMainForm
      <MainForm
        socket={socket}
      />
    </div>
    <div
      className={
        cn({ [s.showSide]: !isMainForm },
          { [s.hideSide]: isMainForm },
        )}
    >
      graphs
      <Graphs
        socket={socket}
      />
    </div>
  </div>
)
    }


export default AppForms
