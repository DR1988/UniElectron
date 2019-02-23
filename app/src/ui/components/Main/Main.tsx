import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import './style.scss'

const socket = io(`${location.origin}`)

export interface Props {}

interface State {
  count: number;
}

export default class Main extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
    this.increaseCounter = this.increaseCounter.bind(this)
  }

  componentDidMount() {
    socket.on('INC', () => {
      let { count } = this.state
      const nc = ++count
      this.setState({
        count: nc,
      })
    })
  }


  increaseCounter() {
    let { count } = this.state
    const nc = ++count
    socket.emit('INC', nc)
    this.setState({
      count: nc,
    })
  }

  render() {
    const { count } = this.state
    return (
      <div>
        main is here 1212
        <button
          type="button"
          onClick={this.increaseCounter}
        >+
        </button>
        <h1>{count}</h1>
      </div>
    )
  }
}
