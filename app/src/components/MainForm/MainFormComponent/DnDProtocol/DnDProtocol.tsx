import React, { useContext } from 'react'
import { TemporaryFileLoaded, TemporaryProtocolButtonPosition } from '../../MainFormInterfaces'
import { ThemeContext } from '../../../Main/Context'

// the same text rendering as ChangeElement (drawText in CanvasElements/ChangeElement.ts):
// bold 17px black text centered in the block; left-aligned and clipped when wider than the block
const TEXT_FONT = 'bold 17px Arial, Helvetica, sans-serif'

let measureCtx: CanvasRenderingContext2D | null = null
const getTextWidth = (text: string): number => {
    if (!measureCtx) {
        measureCtx = document.createElement('canvas').getContext('2d')
    }
    measureCtx.font = TEXT_FONT
    return measureCtx.measureText(text).width
}

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
    const containerWidth = screenSpaceWidth * protocolRation * scale
    return <div ref={protocolRef}
        style={{
            position: 'absolute',
            width: containerWidth,
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
                            // same content as ChangeElement (useElements): value for RPM/TC lines, duration otherwise
                            const text = ch.value || duration
                            // same rule as ChangeElement.drawText: text wider than the block is left-aligned and clipped
                            const textIsBig = getTextWidth(String(text)) > (duration / allTime) * containerWidth

                            return <div style={{left: `${100 * ch.startTime/allTime}%`, width: `${100*duration / allTime}%`, backgroundColor: fits ? 'green' : 'red', position: 'absolute', height: '100%', font: TEXT_FONT, color: '#000000', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: textIsBig ? 'flex-start' : 'center'}}>{text}</div>
                        })}
                      {/* <span>{line.shortName}</span> */}
                      {/* <div >{line.description}</div> */}
                    </div>
                })}
      </div>
}