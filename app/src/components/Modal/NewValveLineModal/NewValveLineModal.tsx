import React from 'react'

import s from './NewValveLineModal.scss'

import CommonMoadlInterface from '../modalInterfaces'

interface Props extends CommonMoadlInterface{
  changeNewStartTime: () => void
  changeNewEndTime: () => void
}

const NewValveLineModal = (props: Props) => (
  <div className={s.root}>

  </div>
)


export default NewValveLineModal
