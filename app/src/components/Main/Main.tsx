import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import 'normalize.css'

import '../../common.css'
import s from './style.css'

import FormChoserComponent from '../FormChoserComponent/FormChoserComponent'
import AppForms from '../AppForms/AppForms'

export interface Props {}

interface State {
  currentForm: string,
}

export default class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentForm: 'MainForm',
      // currentForm: 'Graphs',
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
