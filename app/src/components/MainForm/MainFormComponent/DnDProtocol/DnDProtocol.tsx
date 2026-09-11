import React, { useContext } from 'react'
import { TemporaryFileLoaded, TemporaryProtocolButtonPosition } from '../../MainFormInterfaces'
import { ThemeContext } from '../../../Main/Context'

export type Props = {
    protocolRef: React.MutableRefObject<HTMLDivElement | null>,
    capturedProtocol: TemporaryProtocolButtonPosition | '',
    allTime: number,
    screenSpaceWidth: number,
    scale?: number,
    // false when the protocol does not fit into the gap under the cursor - highlighted red
    fits?: boolean
}

export const DnDProtocol = ({protocolRef, capturedProtocol, allTime: currentProtocolAlltime, screenSpaceWidth, scale = 1, fits = true}: Props) => {
    const data = JSON.parse(window.localStorage.getItem(capturedProtocol)) as TemporaryFileLoaded
    console.log('datadata', data)

    const {theme} = useContext(ThemeContext)
          

    if (!data) {
        return null
    }

    const {protocol: {lineFormer, allTime}} = data

    const protocolRation = Math.min(1, allTime / currentProtocolAlltime)
    // the canvas sheet is drawn horizontally scaled by scaleRef, so the preview must be too
    return <div ref={protocolRef}
        style={{
            position: 'absolute',
            width: screenSpaceWidth * protocolRation * scale,
            height: 450,
            backgroundColor: fits ? (theme === 'dark' ? '#123456' : 'red') : 'rgba(255, 0, 0, 0.5)',
            border: fits ? 'none' : '2px solid red',
            opacity: 0.4,
            pointerEvents: 'none',
            // visibility: capturedProtocol ? 'visible' : 'hidden'
            }}>

        {lineFormer.map(line => {
                    return <div key={line.name + line.id} style={{width: '100%', height: 30, backgroundColor:  'rgba(209, 216, 209, 0.5)', marginBottom: '5px', position: 'relative'}}>
                        {line.changes.map(ch => {
                            const duration = ch.endTime-ch.startTime

                            return <div style={{left: `${100 * ch.startTime/allTime}%`, width: `${100*duration / allTime}%`, backgroundColor: 'red', position: 'absolute', height: '100%'}}>{duration}</div>
                        })}
                      {/* <span>{line.shortName}</span> */}
                      {/* <div >{line.description}</div> */}
                    </div>
                })}
      </div>
}