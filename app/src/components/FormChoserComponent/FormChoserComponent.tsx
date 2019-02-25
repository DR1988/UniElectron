import React, { Component } from 'react'

import s from './FormChoserComponent.scss'

export interface Props {
  updateForm: (e: React.MouseEvent<HTMLButtonElement>) => void,
  form?: string
}

class FormChoserComponent extends Component<Props> {
  render() {
    return (
      <div className={s.root}>
        <button name="MainForm" onClick={this.props.updateForm}>MainForm</button>
        <button name="Graphs" onClick={this.props.updateForm}>Graphs</button>
      </div>
    )
  }
}

export default FormChoserComponent
