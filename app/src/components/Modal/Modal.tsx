import React, { Component } from 'react'

import s from './Modal.css'
import { render } from 'react-dom';

export interface Props {
  render: () => JSX.Element,
  closeModal: () => void,
  resetToPreviousChanges: () => void,
}

class Modal extends Component<Props> {
  private coverRef: React.RefObject<HTMLDivElement>
  constructor(props) {
    super(props)
    this.coverRef = React.createRef();
  }

  componentDidMount() {
    this.coverRef.current.focus()
  }
  render() {
    const { closeModal, render, resetToPreviousChanges } = this.props
    return (
      <div
        ref={this.coverRef}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.keyCode === 27) {
            resetToPreviousChanges()
            closeModal()
          }
        }
        } className={s.cover} tabIndex={1}>
        <div
          className={s.container}
        >
          <div className={s.content}>
            {render()}
          </div>
        </div>
      </div>
    )
  }
}
export default Modal
