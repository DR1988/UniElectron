import React from 'react'

import s from './RMPModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeRPMValue: () => void
}

const RMPModal = (props: Props) => (
  <div className={s.root}>

  </div>
)


export default RMPModal
