import React from 'react'

import s from './TempModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeTempValue: () => void
}

const TempModal = (props:Props) => (
  <div className={s.root}>

  </div>
)


export default TempModal
