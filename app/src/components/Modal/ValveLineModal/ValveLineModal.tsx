import React from 'react'

import s from './ValveLineModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeEndTime: () => void
  changeStartTime: () => void
}

const ValveLineModal = (props:Props) => (
  <div className={s.root}>

  </div>
)


export default ValveLineModal
