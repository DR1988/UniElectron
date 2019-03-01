import React from 'react'

import s from './NewTempModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeTempValue: () => void
}

const NewTempModal = (props: Props) => (
  <div className={s.root}>

  </div>
)


export default NewTempModal
