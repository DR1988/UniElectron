import React, { Component } from 'react'
import cn from 'classnames'
import io from 'socket.io-client'

import s from './AppForms.css'
import Graphs from '../Graphs/Graphs'
import MainForm from '../MainForm/MainForm'
import socketConfig, { startSignal } from '../../../config/socket.config'


interface Props {
  currentForm: string,
}
interface State {
  error: {
    name: string,
    message: string,
  } | null,
 }

export default class AppForms extends Component<Props, State> {
  private socket: SocketIOClient.Socket
  constructor(props) {
    super(props)
    this.socket = io(`${location.origin}`)
    this.state = {
      error: null,
    }
  }
  componentDidMount() {
    this.socket.on(socketConfig.thermoStatInitError, (error) => {
      this.setState({
        error
      })
    })
  }

  componentWillUnmount() {
    this.socket.removeAllListeners()
  }

  acceptError = () => {
    this.setState({
      error: null,
    })
  }

  setError = () => {
    this.setState({
      error: {
        name: 'erwer',
        message: 'Some Messagae'
      }
    })
  }

  render() {
    const { currentForm } = this.props
    const { error } = this.state
    const isMainForm = currentForm === 'MainForm'
    return (
      <div className={s.container}>
        <div
          className={
            cn({ [s.showSide]: isMainForm },
              { [s.hideSide]: !isMainForm },
            )}
        >
          isMainForm
          {/* <button onClick={this.setError}>error</button> */}
          <MainForm socket={this.socket} />
        </div>
        <div
          className={
            cn({ [s.showSide]: !isMainForm },
              { [s.hideSide]: isMainForm },
            )}
        >
          graphs
          <Graphs socket={this.socket} />
        </div>
        <section
          className={cn(s.modal_container, {[s.modal_container_error]: !!error})}
        >
          <div className={cn(s.modal_content, {[s.modal_content_error]: !!error})}>
            <h5 className={s.text}>{error && error.message}</h5>
            <button onClick={this.acceptError}>Close</button>      
          </div>
        </section>
      </div>
    )
  }
}
