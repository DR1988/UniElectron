import * as React from 'react'
import { useState } from 'react'
import io from 'socket.io-client'

import 'normalize.css'
import '../../common.css'

import s from './style.css'

import FormChoserComponent from '../FormChoserComponent/FormChoserComponent'
import AppForms from '../AppForms/AppForms'
import { ThemeProvider } from './Context'

interface Props {}

export default function Main(props: Props) {
  const [currentForm, setCurrentForm] = useState<string>('MainForm')

  const choseForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentForm = e.currentTarget.name
    setCurrentForm(currentForm)
  }

  return (
    <ThemeProvider>
      <div className={s.root}>
        <FormChoserComponent updateForm={choseForm} />
        <AppForms currentForm={currentForm} />
      </div>
    </ThemeProvider>
  )
}