import React, { StatelessComponent } from 'react'

import s from './ValveTimeComponentAdder.scss'
import { ValveLineType } from '../../MainFormInterfaces'

interface Base {
  showModal: () => void,
  addNewValveTime: (chosenLine: ValveLineType) => void,
}

interface ButtonProps extends Base {
  line: ValveLineType,
}

interface Props extends Base {
  lines: Array<ValveLineType>,
}

class Button extends React.Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props)
  }
  _choseLine = () => {
    const { showModal, addNewValveTime, line } = this.props
    showModal()
    addNewValveTime(line)
  }
  render() {
    return <button onClick={this._choseLine}>+</button>
  }
}

const ValveTimeComponentAdder: StatelessComponent<Props> = ({
  lines,
  ...rest
}) => (
    <div className={s.root} >
      {lines.map(line => (
        <div key={line.id} className={s.button_container}>
          <Button line={line} {...rest} />
        </div>
      ))}
    </div>
  )

export default ValveTimeComponentAdder
