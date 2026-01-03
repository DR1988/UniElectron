import socket from 'socket.io';
import socketConfig from '../../config/socket.config';

export type VALVES =
  'C0C' | 'C0O' | 'C1C' | 'C1O' |
  'C2C' | 'C2O' | 'C3C' | 'C3O' |
  'C4C' | 'C4O' | 'C5C' | 'C5O' |
  'C6C' | 'C6O' | 'C7C' | 'C7O' |
  'CS0C' | 'CS0O' | 'CS1C' | 'CS1O' | 'CS2C' | 'CS2O'

export class ValveActions {
    constructor(private io: socket.Server) {
        this.io = io
    }

    actions: Record<VALVES, {name: VALVES, closed: boolean, action: (valve: VALVES) => void}> = {
        'C0C': {
            name: 'C0C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)
                //console.log('Valve "0" is close')
            }
        },
        'C0O': {
            name: 'C0O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "0" is open')
            }
        },
        'C1C': {
            name: 'C1C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "1" is close')
            }
        },
        'C1O': {
            name: 'C1O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "1" is open')
            },
        },
        'C2C': {
            name: 'C2C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "2" is close')
            }
        },
        'C2O': {
            name: 'C2O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "2" is open')
            }
        },
        'C3C': {
            name: 'C3C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "3" is close')
            }
        },
        'C3O': {
            name: 'C3O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "3" is open')
            }
        },
        'C4C': {
            name: 'C4C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "4" is close')
            }
        },
        'C4O': {
            name: 'C4O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "4" is open')
            }
        },
        'C5C': {
            name: 'C5C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "5" is close')
            }
        },
        'C5O': {
            name: 'C5O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "5" is open')
            }
        },
        'C6C': {
            name: 'C6C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "6" is close')
            }
        },
        'C6O': {
            name: 'C6O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "6" is open')
            }
        },
        'C7C': {
            name: 'C7C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is close')
            }
        },
        'C7O': {
            name: 'C7O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS0O': {
            name: 'CS0O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS0C': {
            name: 'C7O',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS1O': {
            name: 'CS1O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS1C': {
            name: 'CS1C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS2O': {
            name: 'CS2O',
            closed: false,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
        'CS2C': {
            name: 'CS2C',
            closed: true,
            action: (valve: VALVES) => {
                this.io.emit(socketConfig.valveAction, valve)

                //console.log('Valve "7" is open')
            }
        },
    }
}
