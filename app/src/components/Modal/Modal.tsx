import React from 'react'

import s from './Modal.css'

export interface Props {
  render: () => JSX.Element
}

const Modal = (props: Props) => {
    return (
      <div className={s.cover}>
        <div
          className={s.container}
        >
          <div className={s.content}>
            {props.render()}
          </div>
        </div>
      </div>
    )
  }

export default Modal
