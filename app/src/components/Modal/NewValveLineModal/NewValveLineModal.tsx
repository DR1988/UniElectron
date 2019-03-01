import React, { StatelessComponent } from 'react'

import s from './NewValveLineModal.scss'

import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface { }

const NewValveLineModal: StatelessComponent<Props> = ({
  resetToPreviousChanges,
  closeModal
}) => (
  <div className={s.root}>
    <button
      onClick={() => {
        resetToPreviousChanges()
        closeModal()
      }}
    >Cancel</button>
  </div>
)


export default NewValveLineModal
