import React, { Component } from 'react'
import socketConfig, { startSignal } from '../../../config/socket.config'
import cn from 'classnames'

import s from './ReactionFlowComponent.css'

interface Props {
  socket: SocketIOClient.Socket
}


class ReactionFlowComponent extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      amin: false
    }
  }
  componentDidMount() {
    const { socket } = this.props
    socket.on(socketConfig.serialSending, (data) => {
      const datas = data.split('|')
      console.log(datas)
    })
    setTimeout(() => {
      this.setState({
        anim: true,
      })
    }, 1000);
  }

  render() {
    const { lineFormer, time, socket } = this.props
    const changes = lineFormer.map(lf => lf.changes)
    // console.log('time', time)
    const { anim } = this.state
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 744 800"
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
          </g>
          <g
              style={{
                fill: "#8fb6c5",
                fillOpacity: 1,
              }}
          >
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
          </g>
          <g
              style={{
                fill: "#dff6fe",
                fillOpacity: 0.97647059,
              }}
          >
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
          </g>
          <g
              style={{
                fill: "#dff6fe",
                fillOpacity: 0.97647059,
              }}
          >
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
          </g>
          <g
              style={{
                fill: "#dff6fe",
                fillOpacity: 0.97647059,
              }}
          >
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
          </g>
          <g
              style={{
                fill: "#dff6fe",
                fillOpacity: 0.97647059,
              }}
          >
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
          </g>
          <g
              style={{
                fill: "#dff6fe",
                fillOpacity: 1,
              }}
          >
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
          </g>
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
          <rect
              style={{
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
          <text
              xmlSpace="preserve"
              style={{
                fontStyle: "normal",
                fontVariant: "normal",
                fontWeight: 400,
                fontStretch: "normal",
                lineHeight: "0%",
                fontFamily: "Arial",
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
          </g>
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
                InkscapeFontSpecification: "'Arial, Normal'",
                textAlign: "start",
                letterSpacing: 0,
                wordSpacing: 0,
                writingMode: "lr-tb",
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
                  InkscapeFontSpecification: "'Arial, Normal'",
                  textAlign: "start",
                  writingMode: "lr-tb",
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
    )
    // return (
    //   <svg id="svg2" version="1.1" viewBox="0 0 744 800" >
    //     <defs id="defs4">
    //       <linearGradient id="linearGradient4292">
    //         <stop id="stop4294" style={{ "stopColor": "#d1d8d1", "stopOpacity": "0.97647059" }} offset="0" />
    //         <stop id="stop4296" style={{ "stopColor": "#ffffff", "stopOpacity": "1" }} offset="1" />
    //       </linearGradient>
    //       <linearGradient id="linearGradient4282">
    //         <stop id="stop4284" style={{ "stopColor": "#cacaca", "stopOpacity": "1" }} offset="0" />
    //         <stop id="stop4286" style={{ "stopColor": "#ffffff", "stopOpacity": "1" }} offset="1" />
    //       </linearGradient>
    //       <linearGradient id="linearGradient4229">
    //         <stop id="stop4231" style={{ "stopColor": "#d7eef4", "stopOpacity": "1" }} offset="0" />
    //         <stop id="stop4233" style={{ "stopColor": "#81acbc", "stopOpacity": "1" }} offset="1" />
    //       </linearGradient>
    //       <linearGradient id="linearGradient4169">
    //         <stop id="stop4171" style={{ "stopColor": "#d7eef4", "stopOpacity": "1" }} offset="0" />
    //         <stop id="stop4173" style={{ "stopColor": "#81acbc", "stopOpacity": "1" }} offset="1" />
    //       </linearGradient>
    //       <linearGradient id="linearGradient4153">
    //         <stop id="stop4155" style={{ "stopColor": "#d7eef4", "stopOpacity": "1" }} offset="0" />
    //         <stop id="stop4157" style={{ "stopColor": "#81acbc", "stopOpacity": "1" }} offset="1" />
    //       </linearGradient>
    //       <radialGradient id="radialGradient4175" cx="128.57143" cy="311.64792" fx="128.57143" fy="311.64792" gradientTransform="matrix(0.99997755,0.00670002,-0.05882353,8.7794121,18.335116,-2425.299)" gradientUnits="userSpaceOnUse" r="48.57143" xlinkHref="#linearGradient4169" />
    //       <radialGradient id="radialGradient4177" cx="254.28571" cy="311.64792" fx="254.28571" fy="311.64792" gradientTransform="matrix(0.99999428,0.00338408,-0.02941178,8.6911807,29.167575,-2397.801)" gradientUnits="userSpaceOnUse" r="48.57143" xlinkHref="#linearGradient4153" />
    //       <radialGradient id="radialGradient4187" cx="512.14288" cy="658.79077" fx="512.14288" fy="658.79077" gradientTransform="matrix(1.0928278,0,0,3.748785,-33.969627,-1858.8565)" gradientUnits="userSpaceOnUse" r="146.61057" xlinkHref="#linearGradient4229" />
    //       <radialGradient id="linearGradient4288" gradientUnits="userSpaceOnUse" x1="521.07794" x2="529.8208" y1="397.00504" y2="397.36218" xlinkHref="#linearGradient4282" />
    //       <radialGradient id="linearGradient4298" gradientUnits="userSpaceOnUse" x1="524.20001" x2="529.90717" y1="358.95148" y2="358.77292" xlinkHref="#linearGradient4292" />
    //     </defs>
    //     <g id="layer1">
    //       <path id="path4194" style={{ "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 269.28571,467.86269 0,-32.64334 10,-0.12999 0,32.77333 z m 10,42.93148 0,27.14785 c 0,0 -0.10524,2.21564 1.11607,3.30411 1.39939,1.24719 3.37712,1.11607 3.37712,1.11607 l 83.36396,0 0,9.28572 -90.16005,0 c 0,0 -3.01698,0.22751 -5.52175,-2.12529 -2.25974,-2.12263 -2.17535,-5.44743 -2.17535,-5.44743 l 0,-33.02849 z" />
    //       <path id="path4194-1" style={{ "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 123.55012,467.80863 0,-32.63879 10,-0.12999 0,32.6795 z m 10,43.125 0,66.85991 c 0,0 -0.10524,2.21564 1.11607,3.30411 1.39939,1.24719 3.37712,1.11607 3.37712,1.11607 l 231.85638,0 0,9.28572 -238.65247,0 c 0,0 -3.01698,0.22751 -5.52175,-2.12529 -2.25974,-2.12263 -2.17535,-5.44743 -2.17535,-5.44743 l 0,-73.17166 z" />
    //       <path id="path4194-5-2" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 240.22668,155.3022 0,32.64334 10,0.12999 0,-32.77333 z m 0,-76.212506 0,33.028486 10,0.25254 0,-33.208761" />
    //       <path id="path4194-5-2-9" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 95.475736,154.82852 0,32.64334 10.000024,0.12999 0,-32.77333 z m 0,-76.212502 0,33.028482 10.000024,0.25254 0,-33.208757" />
    //       <path id="path4194-0" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 612.48215,458.72636 0,35.11796 10,-0.10987 0,-35.0081 z m 10,-45.45686 0,-287.76721 c 0,0 -0.10524,-2.21564 1.11607,-3.30411 1.39939,-1.24719 3.37712,-1.11607 3.37712,-1.11607 l 83.36396,0 0,-9.28572 -90.16005,0 c 0,0 -3.01698,-0.22751 -5.52175,2.12529 -2.25974,2.12263 -2.17535,5.44743 -2.17535,5.44743 l 0,293.64785 z" />
    //       <path id="path4194-1-7" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 152.90267,155.35008 0,32.63879 10,0.12999 0,-32.6795 z m 10,-43.12499 0,-66.859917 c 0,0 -0.10524,-2.21564 1.11607,-3.30411 1.39939,-1.24719 3.37712,-1.11607 3.37712,-1.11607 l 543.15868,0.535714 -0.0108,-9.821434 -549.94394,0 c 0,0 -3.01698,-0.22751 -5.52175,2.12529 -2.25974,2.12263 -2.17535,5.44743 -2.17535,5.44743 l 0,73.171667 z" />
    //       <rect height="252.85715" id="rect4136" style={{ "opacity": "1", "fill": "url(#radialGradient4175)", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#164450", "strokeWidth": "0.36399999", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="97.14286" ry="9.0301037" x="80" y="185.21935" />
    //       <path id="path4194-5" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 298.91072,155.42862 0,32.64334 10,0.12999 0,-32.77333 z m 10,-42.93148 0,-27.147853 c 0,0 -0.10524,-2.21564 1.11607,-3.30411 1.39939,-1.24719 3.37712,-1.11607 3.37712,-1.11607 l 396.45118,0 0,-9.28572 -403.24727,0 c 0,0 -3.01698,-0.22751 -5.52175,2.12529 -2.25974,2.12263 -2.17535,5.44743 -2.17535,5.44743 l 0,33.028493 z" />
    //       <rect height="252.85715" id="rect4136-3" style={{ "opacity": "1", "fill": "url(#radialGradient4177)", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#164450", "strokeWidth": "0.36399999", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="97.14286" ry="9.0913725" x="225.71428" y="185.21935" />
    //       <g id="g4243-7-2" style={{ "fill": "#dff6fe", "fillOpacity": "1" }} transform="matrix(1,0,0,-1,488.82165,931.44024)">
    //         <path id="path4226-8-7" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6-7" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <path id="path4194-5-2-7" style={{ "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "evenodd", "stroke": "#1a1a1a", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} d="m 424.99682,463.56854 0,32.64335 10,0.12999 0,-32.77334 z m 0,-76.2125 0,33.02848 10,0.25254 0,-33.20876" />
    //       <path id="rect4179" style={{ "opacity": "1", "fill": "url(#radialGradient4187)", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#164450", "strokeWidth": "0.32159546", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 377.816,490.91218 c -6.7163,0 -12.12257,4.30107 -12.12257,9.64436 l 0,216.74256 c 0,5.3433 5.73922,11.3173 12.12257,13.40574 96.58164,31.59864 195.17348,31.70421 295.79573,0 6.40586,-2.01837 12.12453,-8.06244 12.12453,-13.40574 l 0,-216.74256 c 0,-5.34329 -5.40822,-9.64436 -12.12453,-9.64436 z" />
    //       <text id="text4148" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "37.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "letterSpacing": "0px", "wordSpacing": "0px", "writingMode": "lr", "textAnchor": "start", "fill": "#000000", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} transform="matrix(0,-1,1,0,0,0)" x="-395.25668" y="137.99098" xmlSpace="preserve">
    //         <tspan id="tspan4150" x="-395.25668" y="137.99098">Reagent 1</tspan>
    //       </text>
    //       <text id="text4148-0" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "37.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "letterSpacing": "0px", "wordSpacing": "0px", "writingMode": "lr", "textAnchor": "start", "fill": "#000000", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} transform="matrix(0,-1,1,0,0,0)" x="-397.6817" y="283.70526" xmlSpace="preserve">
    //         <tspan id="tspan4150-7" x="-397.6817" y="283.70526">Reagent 2</tspan>
    //       </text>
    //       <g id="g4243" style={{ "fill": "#8fb6c5", "fillOpacity": "1" }}>
    //         <path id="path4226" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-7" style={{ "fill": "#8fb6c5", "fillOpacity": "1" }} transform="translate(145.62521,0)">
    //         <path id="path4226-8" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-1" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059" }} transform="matrix(1,0,0,-1,29.352546,623.16983)">
    //         <path id="path4226-02" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-8" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-7-5" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059" }} transform="matrix(1,0,0,-1,175.25022,623.16983)">
    //         <path id="path4226-8-4" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6-0" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-7-5-4" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059" }} transform="matrix(1,0,0,-1,116.56617,623.16983)">
    //         <path id="path4226-8-4-1" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6-0-0" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-7-5-4-3" style={{ "fill": "#dff6fe", "fillOpacity": "0.97647059" }} transform="matrix(1,0,0,-1,-28.184774,623.16983)">
    //         <path id="path4226-8-4-1-0" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6-0-0-0" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <g id="g4243-7-5-4-6" style={{ "fill": "#dff6fe", "fillOpacity": "1" }} transform="matrix(1,0,0,-1,301.33631,931.44024)">
    //         <path id="path4226-8-4-1-9" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,520.91783 18.19327,-31.51166 18.19326,31.51166 z" />
    //         <path id="path4226-0-6-0-0-9" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 110.34865,-458.60616 18.19327,-31.51166 18.19326,31.51166 z" transform="scale(1,-1)" />
    //       </g>
    //       <path id="path4588" style={{ "opacity": "1", "fill": "#37c837", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 647.25954,441.42969 a 10.101525,10.101525 0 0 1 -9.84845,10.34699 10.101525,10.101525 0 0 1 -10.34841,-9.84695 10.101525,10.101525 0 0 1 9.84546,-10.34984 10.101525,10.101525 0 0 1 10.35125,9.84398" />
    //       <path id="path4588-5" style={{ "opacity": "1", "fill": "#37c837", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 158.5909,489.51343 a 10.101525,10.101525 0 0 1 -9.84845,10.34699 10.101525,10.101525 0 0 1 -10.34841,-9.84695 10.101525,10.101525 0 0 1 9.84546,-10.34983 10.101525,10.101525 0 0 1 10.35125,9.84397" />
    //       <path id="path4588-2" style={{ "opacity": "1", "fill": "#ff0000", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 304.05284,489.51343 a 10.101525,10.101525 0 0 1 -9.84845,10.34699 10.101525,10.101525 0 0 1 -10.34841,-9.84695 10.101525,10.101525 0 0 1 9.84547,-10.34983 10.101525,10.101525 0 0 1 10.35125,9.84397" />
    //       <path id="path4588-9" style={{ "opacity": "1", "fill": "#ff0000", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 459.39293,441.42969 a 10.101525,10.101525 0 0 1 -9.84845,10.34699 10.101525,10.101525 0 0 1 -10.34841,-9.84695 10.101525,10.101525 0 0 1 9.84547,-10.34984 10.101525,10.101525 0 0 1 10.35125,9.84398" />
    //       <path id="path4588-3" style={{ "opacity": "1", "fill": "#ff0000", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 333.64311,133.15927 a 10.101525,10.101525 0 0 1 -9.84844,10.347 10.101525,10.101525 0 0 1 -10.34842,-9.84696 10.101525,10.101525 0 0 1 9.84547,-10.34983 10.101525,10.101525 0 0 1 10.35125,9.84398" />
    //       <path id="path4588-22" style={{ "opacity": "1", "fill": "#ff0000", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 236.06485,133.15927 a 10.101525,10.101525 0 0 1 -9.84845,10.347 10.101525,10.101525 0 0 1 -10.34841,-9.84696 10.101525,10.101525 0 0 1 9.84547,-10.34983 10.101525,10.101525 0 0 1 10.35125,9.84398" />
    //       <path id="path4588-96" style={{ "opacity": "1", "fill": "#37c837", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 186.87517,133.15927 a 10.101525,10.101525 0 0 1 -9.84845,10.347 10.101525,10.101525 0 0 1 -10.34841,-9.84696 10.101525,10.101525 0 0 1 9.84547,-10.34983 10.101525,10.101525 0 0 1 10.35124,9.84398" />
    //       <path id="path4588-4" style={{ "opacity": "1", "fill": "#ff0000", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 91.112673,133.15927 a 10.101525,10.101525 0 0 1 -9.848448,10.347 10.101525,10.101525 0 0 1 -10.348414,-9.84696 10.101525,10.101525 0 0 1 9.845468,-10.34983 10.101525,10.101525 0 0 1 10.351249,9.84398" />
    //       <rect height="176.42857" id="rect4643" style={{ "opacity": "1", "fill": "#dff5fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="72.85714" rx="9.02528" ry="9.02528" x="639.85712" y="14.811081" />
    //       <text id="text4148-8" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "37.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "letterSpacing": "0px", "wordSpacing": "0px", "writingMode": "lr-tb", "textAnchor": "start", "fill": "#000000", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} transform="matrix(0,-1,1,0,0,0)" x="-177.03659" y="685.76141" xmlSpace="preserve">
    //         <tspan id="tspan4150-5" x="-177.03659" y="685.76141">Inert gas</tspan>
    //       </text>
    //       <path id="rect4663-9" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 230.29285,52.424437 -5.63102,17.929678 c -0.14493,0.380417 -0.11161,0.345569 0.26736,0.345569 l 3.56557,0 0,21.723013 c 0,0.477522 0.38493,0.861621 0.86245,0.861621 l 2.54237,0 c 0.47752,0 0.86162,-0.384099 0.86162,-0.861621 l 0,-21.723014 3.60016,0 c 0.39025,0.025 0.34074,-0.0044 0.23259,-0.34873 L 230.97486,52.46172 c -0.35591,-1.202893 -0.30716,-1.230834 -0.68201,-0.03729 z" />
    //       <path id="rect4663-9-9" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 85.582551,52.424436 -5.631032,17.929678 c -0.14493,0.380417 -0.11161,0.345569 0.26736,0.345569 l 3.56557,0 0,21.723014 c 0,0.477522 0.38493,0.861621 0.86245,0.861621 l 2.542382,0 c 0.47752,0 0.86162,-0.384099 0.86162,-0.861621 l 0,-21.723014 3.60016,0 c 0.39025,0.025 0.34074,-0.0044 0.23259,-0.34873 L 86.264561,52.46172 c -0.35591,-1.202893 -0.30716,-1.230834 -0.68201,-0.03729 z" />
    //       <path id="rect4663-9-6" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 630.36705,255.85254 -5.63102,-17.92968 c -0.14493,-0.38042 -0.11161,-0.34557 0.26736,-0.34557 l 3.56557,0 0,-21.72301 c 0,-0.47752 0.38493,-0.86162 0.86245,-0.86162 l 2.54237,0 c 0.47752,0 0.86162,0.3841 0.86162,0.86162 l 0,21.72301 3.60016,0 c 0.39025,-0.025 0.34074,0.004 0.23259,0.34873 l -5.61909,17.88924 c -0.35591,1.20289 -0.30716,1.23083 -0.68201,0.0373 z" />
    //       <path id="rect4663-9-62" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 415.09473,363.01984 -5.63102,17.92967 c -0.14493,0.38042 -0.11161,0.34557 0.26736,0.34557 l 3.56557,0 0,21.72302 c 0,0.47752 0.38493,0.86162 0.86245,0.86162 l 2.54237,0 c 0.47752,0 0.86162,-0.3841 0.86162,-0.86162 l 0,-21.72302 3.60016,0 c 0.39025,0.025 0.34074,-0.004 0.23259,-0.34873 l -5.61909,-17.88923 c -0.35591,-1.20289 -0.30716,-1.23084 -0.68201,-0.0373 z" />
    //       <path className={cn(s.animationStart, {[s.active_1]: anim})} id="rect4663-9-6-6" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }}   d="m 536.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path className={cn(s.animationStart, {[s.active_2]: anim})} id="rect4663-9-6-6-2" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 466.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path className={cn(s.animationStart, {[s.active_3]: anim})} id="rect4663-9-6-6-6" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 396.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path className={cn(s.animationStart, {[s.active_4]: anim})} id="rect4663-9-6-6-6" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 326.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path className={cn(s.animationStart, {[s.active_5]: anim})} id="rect4663-9-6-6-6" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 256.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path className={cn(s.animationStart, {[s.active_6]: anim})} id="rect4663-9-6-6-6" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 186.26004,23.310801 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path id="rect4663-9-6-6-9" style={{ "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 536.26004,62.618178 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path id="rect4663-9-6-6-12" style={{ "opacity": "1", "fill": "#dff6fe", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 386.26004,62.618178 17.92968,-5.63102 c 0.38042,-0.14493 0.34557,-0.11161 0.34557,0.26736 l 0,3.56557 21.72301,0 c 0.47752,0 0.86162,0.38493 0.86162,0.86245 l 0,2.54237 c 0,0.47752 -0.3841,0.86162 -0.86162,0.86162 l -21.72301,0 0,3.60016 c 0.025,0.39025 -0.004,0.34074 -0.34873,0.23259 l -17.88924,-5.61909 c -1.20289,-0.35591 -1.23083,-0.30716 -0.0373,-0.68201 z" />
    //       <path id="rect4663-9-6-0" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 348.16771,530.52007 -17.92968,5.63102 c -0.38042,0.14493 -0.34557,0.11161 -0.34557,-0.26736 l 0,-3.56557 -21.72301,0 c -0.47752,0 -0.86162,-0.38493 -0.86162,-0.86245 l 0,-2.54237 c 0,-0.47752 0.3841,-0.86162 0.86162,-0.86162 l 21.72301,0 0,-3.60016 c -0.025,-0.39025 0.004,-0.34074 0.34873,-0.23259 l 17.88924,5.61909 c 1.20289,0.35591 1.23083,0.30716 0.0373,0.68201 z" />
    //       <path id="rect4663-9-6-1" style={{ "opacity": "1", "fill": "#8fb6c5", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "0.68263054", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 348.16771,571.22204 -17.92968,5.63103 c -0.38042,0.14493 -0.34557,0.11161 -0.34557,-0.26736 l 0,-3.56558 -21.72301,0 c -0.47752,0 -0.86162,-0.38493 -0.86162,-0.86245 l 0,-2.54237 c 0,-0.47752 0.3841,-0.86162 0.86162,-0.86162 l 21.72301,0 0,-3.60016 c -0.025,-0.39025 0.004,-0.34074 0.34873,-0.23259 l 17.88924,5.61909 c 1.20289,0.35591 1.23083,0.30716 0.0373,0.68201 z" />
    //       <rect height="32.339527" id="rect4290" style={{ "opacity": "1", "fill": "url(#linearGradient4298)", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.58190155", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="6.803813" rx="1.70384" ry="1.70384" x="522.31238" y="342.60315" />
    //       <path id="rect4260" style={{ 'transformOrigin': '70.7% 0%', 'transform': 'rotateY(0deg)', "opacity": "1", "fill": "#ffffff", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} d="m 522.30469,417.3622 0,285.08702 c -6.28378,-3.6298 -22.5482,-6.00235 -40.51563,-5.91016 -23.28184,0.12563 -41.68424,4.2956 -41.10547,9.31446 0.57722,5.0194 19.92063,8.98759 43.20508,8.86328 17.1852,-0.0946 32.38413,-2.42825 38.41602,-5.89844 l 0,4.70117 c 0,0.94393 0.76115,1.70508 1.70508,1.70508 l 3.41015,0 c 0.94393,0 1.70313,-0.76115 1.70313,-1.70508 l 0,-4.82422 c 6.13017,3.68703 22.52533,6.11329 40.68945,6.02149 23.28283,-0.12427 41.6908,-4.29343 41.11719,-9.3125 l 0,-0.006 c -0.58699,-5.01887 -19.93471,-8.98513 -43.2168,-8.85938 -17.38695,0.098 -32.71151,2.48689 -38.58984,6.01563 l 0,-285.07322 z" />
    //       <text id="text4188" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "37.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "letterSpacing": "0px", "wordSpacing": "0px", "writingMode": "lr-tb", "textAnchor": "start", "fill": "#000000", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} x="533.81152" y="561.45081" xmlSpace="preserve">
    //         <tspan id="tspan4190" x="533.81152" y="561.45081">Reaction</tspan>
    //         <tspan id="tspan4192" x="533.81152" y="598.95081">chamber</tspan>
    //       </text>
    //       <rect height="107.85712" id="rect4254" style={{ "opacity": "1", "fill": "#d1d8d1", "fillOpacity": "0.97647059", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="107.85713" rx="6.7957239" ry="6.5891986" x="471.78574" y="240.93362" />
    //       <text id="text4256" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "17.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "letterSpacing": "0px", "wordSpacing": "0px", "writingMode": "lr-tb", "textAnchor": "start", "fill": "#000000", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }} x="473.51093" y="303.60358" xmlSpace="preserve">
    //         <tspan id="tspan4258" style={{ "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "fontStretch": "normal", "fontSize": "37.5px", "lineHeight": "100%", "fontFamily": "Arial", "InkscapeFontSpecification": "'Arial, Normal'", "textAlign": "start", "writingMode": "lr-tb", "textAnchor": "start" }} x="473.51093" y="303.60358">Stirrer</tspan>
    //       </text>
    //       <rect height="54.285713" id="rect4280" style={{ "opacity": "1", "fill": "url(#linearGradient4288)", "fillOpacity": "1", "fillRule": "nonzero", "stroke": "#1a1a1a", "strokeWidth": "1.60000002", "strokeLinecap": "round", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeDashoffset": "0", "strokeOpacity": "1" }} width="34.285713" rx="1.70384" ry="1.70384" x="508.66367" y="370.21933" />
    //     </g>
    //   </svg>)
  }
}


export default ReactionFlowComponent
