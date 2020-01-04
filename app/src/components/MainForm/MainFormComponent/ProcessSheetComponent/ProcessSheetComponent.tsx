import React, { StatelessComponent, PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import TimeLine from './TimeLineComponent'
import ValveLineComponent from './ValveLineComponent'

import { ValveLineType } from './../../MainFormInterfaces'

import s from './ProcessSheetComponent.css'
import { render } from 'react-dom'

export interface Props {
  distance: number,
  time: number,
  allTime: number,
  showModal: () => void,
  setChosenValveTime: (lineID: number, changeId: number) => void,
  lineFormer: Array<ValveLineType>,
}

interface State {
  scale: number,
  translateX: number,
  isMoving: boolean,
}
class ProcessSheetComponent extends PureComponent<Props, State> {

  currentX: number = 0
  sheetWidth: number
  crossCursor: boolean = false

  constructor(props) {
    super(props)
    this.state = {
      scale: 1,
      translateX: 0,
      isMoving: false,
    }
  }
  changScale = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      this.increase()
    } else {
      this.decrease()
    }
  }

  increase = () => {
    if (this.state.scale < 15) {
      this.setState({
        scale: this.state.scale + 0.5
      })
    }
  }
  decrease = () => {
    if (this.state.scale > 1) {
      this.setState({
        scale: this.state.scale - 0.5
      })
    } else if (this.state.translateX !== 0) {
      this.setState({
        translateX: 0
      })
    }
  }

  lockOnForm = (e: React.MouseEvent) => {
    // this.crossCursor = true
    if (e.nativeEvent.which === 2) {
      this.setState({
        isMoving: !this.state.isMoving
      })
      this.currentX = e.pageX + this.state.translateX
    }
  }

  moveForm = (e: React.MouseEvent) => {
    const dx = this.currentX - e.pageX
    if (Math.abs(dx) < e.currentTarget.clientWidth * 0.45) {
      if (this.state.scale !== 1) {
        this.setState({
          translateX: dx,
        })
      }
    }
  }

  unlockForm = () => {
    this.crossCursor = false
    this.setState({ isMoving: false })
  }

  render() {
    const {
      distance,
      time,
      allTime,
      showModal,
      setChosenValveTime,
      lineFormer,
    } = this.props

    const { scale, translateX, isMoving } = this.state
    return (<section
      id="processSheet"
      className={cn(s['lines-keeper'], { [s.crossed]: this.crossCursor })}
      onWheel={this.changScale}
      onMouseDown={this.lockOnForm}
      onMouseUp={this.lockOnForm}
      onMouseMove={isMoving ? this.moveForm : f => f}
      onMouseLeave={this.unlockForm}
    >
      <div style={{
        transform: `scaleX(${scale}) translateX(${translateX}px)`
      }}
        className={s.lineKeeperContent}
      >
        {lineFormer.map(elem => <ValveLineComponent
          key={elem.id}
          line={elem}
          allTime={allTime}
          showModal={showModal}
          setChosenValveTime={setChosenValveTime}
          scale={scale}
        />,
        )}
        <TimeLine
          scale={scale}
          distance={distance}
          time={time}
          allTime={allTime}
        />
      </div>

    </section >
    )
  }
}

export default ProcessSheetComponent
