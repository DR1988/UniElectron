import React, { Component } from 'react'

import s from './Modal.css'
import { render } from 'react-dom';

export interface Props {
  render: () => JSX.Element,
  closeModal: () => void,
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
    const { closeModal, render } = this.props
    return (
      <div
        ref={this.coverRef}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.keyCode === 27) {
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
