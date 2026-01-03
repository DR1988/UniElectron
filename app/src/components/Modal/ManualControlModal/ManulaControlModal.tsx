import React, {Component, useEffect, useState} from 'react'
import { ShortNames } from '../../MainForm/MainFormInterfaces'
import socketConfig from '../../../../config/socket.config';
import {VALVES} from '../../../../server/socketHandlers/serialMessages';

type CustomInputProps = {
    // defaultValue: number,
    id: string,
    value: number,
    changeValue: (value: number) => void,
  }

class CustomInput extends Component<CustomInputProps> { // eslint-disable-line
    constructor(props: CustomInputProps) { // eslint-disable-line
        super(props)
    }
    _changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { changeValue } = this.props
        if (Number.isInteger(+e.target.value.trim()) && +e.target.value.trim() >= 0 && +e.target.value.trim() <= 2500) {
          console.log('e.target.value', e.target.value);
          if (e.target.value.length <= 4) {
            changeValue(+e.target.value)
          }
        }
    }
    render() {
        const { value, id } = this.props
        return (
        <input
            id={id}
            type="text"
            onChange={this._changeValue}
            value={value}
            style={{
              fontSize: 32,
              width: 100,
               height: 42,
               borderRadius: 7,
               outline: 'none',
               borderWidth: 2,
               borderColor: 'grey',
               borderStyle: 'solid'
            }}
        />)
    }
}

type Props = {
  sendRPMValue: (rpmValue: number) => void
  closeModal: () => void
  toggleValve: (shorName: ShortNames, value: boolean) => void
  checkValves: () => void
  socket: SocketIOClient.Socket
}

export const ManualControlModal = ({sendRPMValue, closeModal, toggleValve, checkValves, socket}: Props) => {
    const [RMPValue, changeRmpValue] = useState(0)
    const [RPMState, toggleRPMState] = useState(false)
    const [GV1State, toggleGV1] = useState(false)
    const [GV2State, toggleGV2] = useState(false)
    const [GV3State, toggleGV3] = useState(false)
    const [GV4State, toggleGV4] = useState(false)
    const [GV5State, toggleGV5] = useState(false)
    const [GV6State, toggleGV6] = useState(false)
    const [HV1State, toggleHV1] = useState(false)
    const [HV2State, toggleHV2] = useState(false)
    const [HV3State, toggleHV3] = useState(false)


    useEffect(() => {
        socket.on(socketConfig.valveAction, (valve: VALVES) => {
          console.log('valvevalve', valve)
          switch (valve) {
            case 'C0C':
              toggleGV1(false);
              break;
            case 'C0O':
              toggleGV1(true);
              break;
            case 'C1C':
              toggleGV2(false);
              break;
            case 'C1O':
              toggleGV2(true);
              break;
            case 'C2C':
              toggleGV3(false);
              break;
            case 'C2O':
              toggleGV3(true);
              break;
            case 'C3C':
              toggleGV4(false);
              break;
            case 'C3O':
              toggleGV4(true);
              break;
            case 'C4C':
              toggleGV5(false);
              break;
            case 'C4O':
              toggleGV5(true);
              break;
            case 'C5C':
              toggleGV6(false);
              break;
            case 'C5O':
              toggleGV6(true);
              break;
            case 'CS0C':
              toggleHV1(false);
              break;
            case 'CS0O':
              toggleHV1(true);
              break;
            case 'CS1C':
              toggleHV2(false);
              break;
            case 'CS1O':
              toggleHV2(true);
              break;
            case 'CS2C':
              toggleHV3(false);
              break;
            case 'CS2O':
              toggleHV3(true);
              break;
          }
        })

        checkValves()
        return () => {
          socket.off(socketConfig.valveAction)
          console.log('DESTROY')
        }
    }, [socket])

    const handleStirerClick = () => {
      if (!RPMState) {
        sendRPMValue(RMPValue)
      } else {
        sendRPMValue(0)
      }
      toggleRPMState(!RPMState)
    }

    const _toggleGV1 = () => {
      toggleValve('GV1', !GV1State)
      toggleGV1(!GV1State)
    }

    const _toggleGV2 = () => {
      toggleValve('GV2', !GV2State)
      toggleGV2(!GV2State)
    }

    const _toggleGV3 = () => {
      toggleValve('GV3', !GV3State)
      toggleGV3(!GV3State)
    }

    const _toggleGV4 = () => {
      toggleValve('GV4', !GV4State)
      toggleGV4(!GV4State)
    }

    const _toggleGV5 = () => {
      toggleValve('GV5', !GV5State)
      toggleGV5(!GV5State)
    }

    const _toggleGV6 = () => {
      toggleValve('GV6', !GV6State)
      toggleGV6(!GV6State)
    }

    const _toggleHV1 = () => {
      toggleValve('HV1', !HV1State)
      toggleHV1(!HV1State)
    }

    const _toggleHV2 = () => {
      toggleValve('HV2', !HV2State)
      toggleHV2(!HV2State)
    }

    const _toggleHV3 = () => {
      toggleValve('HV3', !HV3State)
      toggleHV3(!HV3State)
    }


    return (
        <div style={{ backgroundColor: 'white', width: 550, height: 700}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                paddingLeft: 20,
                paddingRight: 20
              }}>
              <h2>Manual Control</h2>
              <div style={{display: 'flex', alignContent: 'center', alignItems: 'center'}}>
                <button onClick={closeModal}>
                  <div style={{display: 'flex', position: 'relative', top: -10, left: -2}}>
                    <div style={{position: 'absolute', width:2, backgroundColor: 'grey', height: 20, transform: 'rotate(45deg)'}}/>
                    <div style={{position: 'absolute', width:2, backgroundColor: 'grey', height: 20, transform: 'rotate(-45deg)'}}/>
                  </div>
                </button>
              </div>
            </div>

            <div style={{marginTop: 0}}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 750 900"
            >
            <defs>
                <linearGradient id="e">
                <stop
                    style={{
                        stopColor: "#d1d8d1",
                        stopOpacity: 0.97647059,
                    }}
                    offset={0}
                />
                <stop
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                    offset={1}
                />
                </linearGradient>
                <linearGradient id="d">
                <stop
                    style={{
                        stopColor: "#cacaca",
                        stopOpacity: 1,
                    }}
                    offset={0}
                />
                <stop
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                    offset={1}
                />
                </linearGradient>
                <linearGradient id="c">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#d7eef4",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#81acbc",
                        stopOpacity: 1,
                    }}
                />
                </linearGradient>
                <linearGradient id="a">
                <stop
                    style={{
                        stopColor: "#d7eef4",
                        stopOpacity: 1,
                    }}
                    offset={0}
                />
                <stop
                    style={{
                        stopColor: "#81acbc",
                        stopOpacity: 1,
                    }}
                    offset={1}
                />
                </linearGradient>
                <linearGradient id="b">
                <stop
                    style={{
                        stopColor: "#d7eef4",
                        stopOpacity: 1,
                    }}
                    offset={0}
                />
                <stop
                    style={{
                        stopColor: "#81acbc",
                        stopOpacity: 1,
                    }}
                    offset={1}
                />
                </linearGradient>
                <linearGradient
                    xlinkHref="#d"
                    id="j"
                    x1={521.078}
                    y1={397.005}
                    x2={529.821}
                    y2={397.362}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#e"
                    id="i"
                    x1={524.2}
                    y1={358.951}
                    x2={529.907}
                    y2={358.773}
                    gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                    xlinkHref="#a"
                    id="f"
                    cx={128.571}
                    cy={311.648}
                    fx={128.571}
                    fy={311.648}
                    r={48.571}
                    gradientTransform="matrix(.99998 .0067 -.05882 8.77941 18.335 -2425.299)"
                    gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                    xlinkHref="#b"
                    id="g"
                    cx={254.286}
                    cy={311.648}
                    fx={254.286}
                    fy={311.648}
                    r={48.571}
                    gradientTransform="matrix(1 .00338 -.02941 8.69118 29.168 -2397.801)"
                    gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                    xlinkHref="#c"
                    id="h"
                    cx={512.143}
                    cy={658.791}
                    fx={512.143}
                    fy={658.791}
                    r={146.611}
                    gradientTransform="matrix(1.09283 0 0 3.74878 -33.97 -1858.857)"
                    gradientUnits="userSpaceOnUse"
                />
            </defs>
            <path
                style={{
                    opacity: 1,
                    fill: "#fff",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="M647.26 441.43a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.351 9.844M158.59 489.513a10.102 10.102 0 0 1-9.848 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.35 9.845M304.053 489.513a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.845M459.393 441.43a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.35 9.844M333.643 133.16a10.102 10.102 0 0 1-9.848 10.346 10.102 10.102 0 0 1-10.349-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.351 9.844M236.065 133.16a10.102 10.102 0 0 1-9.849 10.346 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.844M186.875 133.16a10.102 10.102 0 0 1-9.848 10.346 10.102 10.102 0 0 1-10.349-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.351 9.844M91.113 133.16a10.102 10.102 0 0 1-9.849 10.346 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.844"
            />
            <path
                style={{
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "evenodd",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                d="M269.286 467.863v-32.644l10-.13v32.774zm10 42.931v27.148s-.106 2.216 1.116 3.304c1.4 1.247 3.377 1.116 3.377 1.116h83.364v9.286h-90.16s-3.017.227-5.522-2.125c-2.26-2.123-2.175-5.448-2.175-5.448v-33.028zM245.926 696.708H369.9v9.286H245.926Zm-114.679 0h73.161v9.286h-73.16M123.55 467.809v-32.64l10-.13v32.68zm10 43.125v66.86s-.105 2.215 1.116 3.304c1.4 1.247 3.377 1.116 3.377 1.116H369.9v9.285H131.247s-3.017.228-5.522-2.125c-2.26-2.122-2.175-5.447-2.175-5.447v-73.172z"
            />
            <path
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "evenodd",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                d="M240.227 155.302v32.644l10 .13v-32.774zm0-76.212v33.028l10 .253V79.162M95.476 154.829v32.643l10 .13v-32.773zm0-76.213v33.028l10 .253V78.688M612.482 458.726v35.118l10-.11v-35.008zm10-45.456V125.502s-.105-2.215 1.116-3.304c1.4-1.247 3.377-1.116 3.377-1.116h83.364v-9.286h-90.16s-3.017-.227-5.521 2.126c-2.26 2.122-2.176 5.447-2.176 5.447v293.648z"
            />
            <path
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "evenodd",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                d="M152.903 155.35v32.639l10 .13v-32.68zm10-43.125v-66.86s-.106-2.215 1.116-3.304c1.4-1.247 3.377-1.116 3.377-1.116l543.159.536-.011-9.822H160.6s-3.017-.227-5.522 2.126c-2.26 2.122-2.175 5.447-2.175 5.447v73.172z"
            />
            <rect
                style={{
                    opacity: 1,
                    fill: "url(#f)",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#164450",
                    strokeWidth: 0.36399999,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={97.143}
                height={252.857}
                x={80}
                y={185.219}
                ry={9.03}
            />
            <path
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "evenodd",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                d="M298.91 155.429v32.643l10 .13v-32.773zm10-42.932V85.35s-.105-2.215 1.117-3.304c1.4-1.247 3.377-1.116 3.377-1.116h396.451v-9.286H306.608s-3.017-.227-5.522 2.126c-2.26 2.122-2.175 5.447-2.175 5.447v33.029z"
            />
            <rect
                style={{
                    opacity: 1,
                    fill: "url(#g)",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#164450",
                    strokeWidth: 0.36399999,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={97.143}
                height={252.857}
                x={225.714}
                y={185.219}
                ry={9.091}
            />
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 1,
                }}
            >
              {/* GV1 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 488.822 931.44)"
                />
                <path
                    transform="translate(488.822 931.44)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                 <circle
                  cx="638"
                  cy="441.5"
                  r="12"
                  fill={GV1State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="599" y="400"
                width="50" height="80">
                    <button
                      onClick={_toggleGV1}
                      style={{
                        // backgroundColor: 'red',
                        backgroundColor: 'transparent',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <path
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "evenodd",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                d="M424.997 463.569v32.643l10 .13v-32.773zm0-76.213v33.029l10 .252v-33.209"
            />
            <path
                style={{
                    opacity: 1,
                    fill: "url(#h)",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#164450",
                    strokeWidth: 0.32159546,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="M377.816 490.912c-6.716 0-12.123 4.301-12.123 9.645v216.742c0 5.343 5.74 11.317 12.123 13.406 96.582 31.598 195.173 31.704 295.796 0 6.406-2.019 12.124-8.063 12.124-13.406V500.557c0-5.344-5.408-9.645-12.124-9.645z"
            />
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-395.257}
                y={137.991}
                transform="rotate(-90)"
            >
                <tspan
                    x={-395.257}
                    y={137.991}
                    style={{
                    fontSize: "37.5px",
                    lineHeight: 1,
                    }}
                >
                {"Reagent 1"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-397.682}
                y={283.705}
                transform="rotate(-90)"
            >
                <tspan
                    x={-397.682}
                    y={283.705}
                    style={{
                    fontSize: "37.5px",
                    lineHeight: 1,
                    }}
                >
                {"Reagent 2"}
                </tspan>
            </text>
            <g
                style={{
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                }}
            >
              {/* HV1 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <path
                    transform="scale(1 -1)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="148"
                  cy="490.5"
                  r="12"
                  fill={HV1State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="110" y="445"
                width="50" height="80">
                    <button
                      onClick={_toggleHV1}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                }}
            >
              {/* HV2 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="translate(145.625)"
                />
                <path
                    transform="matrix(1 0 0 -1 145.625 0)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="294"
                  cy="490.5"
                  r="12"
                  fill={HV2State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="256" y="445"
                width="50" height="80">
                    <button
                      onClick={_toggleHV2}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                }}
            >
              {/* GV3 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 29.353 623.17)"
                />
                <path
                    transform="translate(29.353 623.17)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="177"
                  cy="133"
                  r="12"
                  fill={GV3State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="138" y="87"
                width="50" height="80">
                    <button
                      onClick={_toggleGV3}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                }}
            >
              {/* GV5 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 175.25 623.17)"
                />
                <path
                    transform="translate(175.25 623.17)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="323"
                  cy="133"
                  r="12"
                  fill={GV5State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="286" y="87"
                width="50" height="80">
                    <button
                      onClick={_toggleGV5}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                }}
            >
              {/* GV6 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 116.566 623.17)"
                />
                <path
                    transform="translate(116.566 623.17)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                 <circle
                  cx="227"
                  cy="133"
                  r="12"
                  fill={GV6State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="216" y="87"
                width="50" height="80">
                    <button
                      onClick={_toggleGV6}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                }}
            >
              {/* GV4 */}
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 -28.185 623.17)"
                />
                <path
                    transform="translate(-28.185 623.17)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                  <circle
                  cx="82"
                  cy="133"
                  r="12"
                  fill={GV4State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="70" y="87"
                width="50" height="80">
                    <button
                      onClick={_toggleGV4}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            <g
                style={{
                    fill: "#dff6fe",
                    fillOpacity: 1,
                }}
            >
                {/* GV2 клапан */}

                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="matrix(1 0 0 -1 301.336 931.44)"
                />
                <path
                    transform="translate(301.336 931.44)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="449"
                  cy="441.5"
                  r="12"
                  fill={GV2State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="410" y="400"
                width="50" height="80">
                    <button
                      onClick={_toggleGV2}
                      style={{backgroundColor: 'transparent', width: 50, height: 80}}
                    />
                  </foreignObject>
            </g>
            {/* <path
                style={{
                    opacity: 1,
                    fill: "#fff",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="M647.26 441.43a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.351 9.844M158.59 489.513a10.102 10.102 0 0 1-9.848 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.35 9.845M304.053 489.513a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.845M459.393 441.43a10.102 10.102 0 0 1-9.849 10.347 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.35 9.844M333.643 133.16a10.102 10.102 0 0 1-9.848 10.346 10.102 10.102 0 0 1-10.349-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.351 9.844M236.065 133.16a10.102 10.102 0 0 1-9.849 10.346 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.844M186.875 133.16a10.102 10.102 0 0 1-9.848 10.346 10.102 10.102 0 0 1-10.349-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.351 9.844M91.113 133.16a10.102 10.102 0 0 1-9.849 10.346 10.102 10.102 0 0 1-10.348-9.847 10.102 10.102 0 0 1 9.845-10.35 10.102 10.102 0 0 1 10.352 9.844"
            /> */}
            <rect
                style={{
                    opacity: 1,
                    fill: "#dff5fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={72.857}
                height={176.429}
                x={639.857}
                y={14.811}
                ry={9.025}
                rx={9.025}
            />
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-177.037}
                y={685.761}
                transform="rotate(-90)"
            >
                <tspan
                    x={-177.037}
                    y={685.761}
                    style={{
                    fontSize: "37.5px",
                    lineHeight: 1,
                    }}
                >
                {"Inert gas"}
                </tspan>
            </text>
            <path
                style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.68263054,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m230.293 52.424-5.631 17.93c-.145.38-.112.346.267.346h3.566v21.723a.86.86 0 0 0 .862.861h2.543a.86.86 0 0 0 .861-.861V70.7h3.6c.39.025.341-.005.233-.349l-5.62-17.89c-.355-1.202-.306-1.23-.681-.037zM85.583 52.424l-5.631 17.93c-.145.38-.112.346.267.346h3.565v21.723a.86.86 0 0 0 .863.861h2.542a.86.86 0 0 0 .862-.861V70.7h3.6c.39.025.34-.005.233-.349l-5.62-17.89c-.355-1.202-.307-1.23-.681-.037zM630.367 255.853l-5.631-17.93c-.145-.38-.112-.346.267-.346h3.566v-21.723a.86.86 0 0 1 .862-.861h2.543a.86.86 0 0 1 .861.861v21.723h3.6c.39-.025.341.004.233.349l-5.619 17.89c-.356 1.202-.307 1.23-.682.037z"
            />
            <path
                style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.68263054,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m415.095 363.02-5.631 17.93c-.145.38-.112.345.267.345h3.566v21.723a.86.86 0 0 0 .862.862h2.542a.86.86 0 0 0 .862-.862v-21.723h3.6c.39.025.341-.004.233-.349l-5.62-17.889c-.355-1.203-.306-1.23-.681-.037z"
            />
            {/* СТРЕЛКИ НАВЕРХУ */}
            <path
                style={{
                    opacity: 1,
                    fill: "#dff6fe",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.68263054,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m536.26 23.31 17.93-5.63c.38-.145.345-.112.345.267v3.566h21.723a.86.86 0 0 1 .862.862v2.543a.86.86 0 0 1-.862.861h-21.723v3.6c.025.39-.004.341-.348.233l-17.89-5.62c-1.203-.355-1.23-.306-.037-.681zM536.26 62.618l17.93-5.63c.38-.146.345-.112.345.267v3.565h21.723a.86.86 0 0 1 .862.863v2.542a.86.86 0 0 1-.862.862h-21.723v3.6c.025.39-.004.34-.348.232l-17.89-5.619c-1.203-.356-1.23-.307-.037-.682z"
            />
            <path
                style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.68263054,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m348.168 530.52-17.93 5.631c-.38.145-.346.112-.346-.267v-3.566H308.17a.86.86 0 0 1-.861-.862v-2.543a.86.86 0 0 1 .861-.861h21.723v-3.6c-.025-.39.004-.341.35-.233l17.888 5.62c1.203.355 1.231.306.038.681zM348.168 571.222l-17.93 5.631c-.38.145-.346.112-.346-.267v-3.566H308.17a.86.86 0 0 1-.861-.862v-2.543a.86.86 0 0 1 .861-.861h21.723v-3.6c-.025-.39.004-.341.35-.233l17.888 5.619c1.203.356 1.231.307.038.682z"
            />
            <rect
                style={{
                    opacity: 1,
                    fill: "url(#i)",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.58190155,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={6.804}
                height={32.34}
                x={522.312}
                y={342.603}
                rx={1.704}
                ry={1.704}
            />
            {/* САМА МЕШАЛКА НА КАРТНИКЕ */}
            <path
                style={{
                    opacity: 1,
                    fill: "#fff",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="M522.305 417.362V702.45c-6.284-3.63-22.549-6.002-40.516-5.91-23.282.126-41.684 4.296-41.105 9.315.577 5.019 19.92 8.987 43.205 8.863 17.185-.095 32.384-2.428 38.416-5.899v4.702c0 .943.76 1.705 1.705 1.705h3.41a1.7 1.7 0 0 0 1.703-1.705v-4.825c6.13 3.687 22.525 6.114 40.69 6.022 23.282-.124 41.69-4.294 41.117-9.313v-.006c-.587-5.019-19.935-8.985-43.217-8.86-17.387.099-32.712 2.488-38.59 6.017V417.48z"
            />
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={533.812}
                y={561.451}
            >
                <tspan
                    x={533.812}
                    y={561.451}
                    style={{
                    fontSize: "37.5px",
                    lineHeight: 1,
                    }}
                >
                {"Reaction "}
                </tspan>
                <tspan
                    x={533.812}
                    y={598.951}
                    style={{
                    fontSize: "37.5px",
                    lineHeight: 1,
                    }}
                >
                {"chamber"}
                </tspan>
            </text>
            <foreignObject x="473.511" y="193.604"
                width="100" height="48">
                  <div
                    style={{
                        width: 100,
                        height: 42,

                    }}>
                      <CustomInput id="RMPVALUE" value={RMPValue} changeValue={changeRmpValue} />
                  </div>
            </foreignObject>
            <rect
                onClick={handleStirerClick}
                style={{
                    cursor: 'pointer',
                    opacity: 1,
                    fill: "#d1d8d1",
                    fillOpacity: 0.97647059,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={107.857}
                height={107.857}
                x={471.786}
                y={240.934}
                ry={6.589}
                rx={6.796}
            />
            <circle
              cx="565"
              cy="335"
              r="9"
              fill={RPMState ? 'limegreen' : 'red'}
            />
            <text
                xmlSpace="preserve"
                pointerEvents="none"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={473.511}
                y={303.604}
            >
                <tspan
                    x={473.511}
                    y={303.604}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: "37.5px",
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"Stirrer"}
                </tspan>
            </text>
            <rect
                style={{
                    opacity: 1,
                    fill: "url(#j)",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                width={34.286}
                height={54.286}
                x={508.664}
                y={370.219}
                rx={1.704}
                ry={1.704}
            />
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-155.787}
                y={68.188}
                transform="rotate(-90)"
            >
                <tspan
                    x={-155.787}
                    y={68.188}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV4"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-157.423}
                y={139.899}
                transform="rotate(-90)"
            >
                <tspan
                    x={-157.423}
                    y={139.899}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV3"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-157.515}
                y={213.82}
                transform="rotate(-90)"
            >
                <tspan
                    x={-157.515}
                    y={213.82}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV6"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={-157.478}
                y={286.353}
                transform="rotate(-90)"
            >
                <tspan
                    x={-157.478}
                    y={286.353}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV5"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={357.621}
                y={403.68}
            >
                <tspan
                    x={357.621}
                    y={403.68}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV2"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={558.388}
                y={403.68}
            >
                <tspan
                    x={558.388}
                    y={403.68}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"GV1"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={69.84}
                y={497.703}
            >
                <tspan
                    x={69.84}
                    y={497.703}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"HV1"}
                </tspan>
            </text>
            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={214.46}
                y={497.703}
            >
                <tspan
                    x={214.46}
                    y={497.703}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 25,
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    }}
                >
                {"HV2"}
                </tspan>
            </text>
            <path
                style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.6826306,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m308.188 680.378 17.93 5.63c.38.146.345.113.345-.266v-3.566h21.723a.86.86 0 0 0 .862-.862v-2.543a.86.86 0 0 0-.862-.861h-21.723v-3.6c.025-.39-.004-.341-.349-.233l-17.889 5.619c-1.203.356-1.23.307-.037.682z"
            />
            <g
                style={{
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                }}
            >
              {/* HV3 */}
              <path
                style={{
                    opacity: 1,
                    fill: "#fff",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="M-671.102 225.677a10.102 10.102 0 0 1-9.848 10.347 10.102 10.102 0 0 1-10.349-9.847 10.102 10.102 0 0 1 9.846-10.35 10.102 10.102 0 0 1 10.351 9.845"
                transform="rotate(-90)"
            />
                <path
                    d="m110.349 520.918 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                    transform="rotate(-90 282.928 546.764)"
                />
                <path
                    transform="matrix(0 -1 -1 0 -263.836 829.693)"
                    d="m110.349-458.606 18.193-31.512 18.193 31.512z"
                    style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 1.60000002,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                    }}
                />
                <circle
                  cx="226"
                  cy="681"
                  r="12"
                  fill={HV3State ? 'limegreen' : 'red'}
                />
                 <foreignObject x="190" y="670"
                width="80" height="50">
                    <button
                      onClick={_toggleHV3}
                      style={{
                        backgroundColor: 'transparent',
                        // backgroundColor: 'red',
                         width: 80, height: 50}}
                    />
                  </foreignObject>
            </g>

            <text
                xmlSpace="preserve"
                style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: 12,
                    lineHeight: "0%",
                    fontFamily: "Arial",
                    textAlign: "start",
                    letterSpacing: 0,
                    wordSpacing: 0,
                    textAnchor: "start",
                    fill: "#000",
                    fillOpacity: 1,
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeOpacity: 1,
                }}
                x={201.158}
                y={740.473}
            >
                <tspan
                    x={201.158}
                    y={740.473}
                    style={{
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: 400,
                    fontStretch: "normal",
                    fontSize: "25.00000191px",
                    lineHeight: "100%",
                    fontFamily: "Arial",
                    textAlign: "start",

                    textAnchor: "start",
                    strokeWidth: 1,
                    }}
                >
                {"HV3"}
                </tspan>
            </text>
            <path
                style={{
                    opacity: 1,
                    fill: "#8fb6c5",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "#1a1a1a",
                    strokeWidth: 0.68263066,
                    strokeLinecap: "round",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                    strokeOpacity: 1,
                }}
                d="m133.218 680.378 17.93 5.63c.38.146.345.113.345-.266v-3.566h21.723a.86.86 0 0 0 .861-.862v-2.543a.86.86 0 0 0-.861-.861h-21.723v-3.6c.025-.39-.004-.341-.349-.233l-17.89 5.619c-1.202.356-1.23.307-.036.682z"
            />
                </svg>
            </div>
        </div>
    )
}
