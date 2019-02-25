import React from 'react'

import s from './Modal.scss'

// interface Props {
//   render: () => React.ComponentType
// }

const Modal = (props) => {
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
