import React from 'react'

import s from './NewRMPModal.scss'
import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeRPMValue: () => void
  changeStartTime: () => void
  changeEndTime: () => void
}

const NewRMPModal = (props: Props) => (
  <div className={s.root}>

  </div>
)


export default NewRMPModal
