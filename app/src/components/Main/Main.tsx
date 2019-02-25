import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import 'normalize.css'

import '../../common.scss'
import s from './style.scss'

import FormChoserComponent from '../FormChoserComponent/FormChoserComponent'
import AppForms from '../AppForms/AppForms'

const socket = io(`${location.origin}`)

export interface Props {}

interface State {
  currentForm: string,
}

export default class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentForm: 'MainForm',
    }
  }

  choseForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentForm = e.currentTarget.name
    this.setState({
      currentForm
    })
  }

  render() {
    const { currentForm } = this.state
    return (
      <div className={s.root}>
        <FormChoserComponent updateForm={this.choseForm} />
        <AppForms currentForm={currentForm} />
      </div>
    )
  }
}
