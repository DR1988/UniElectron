// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LineChart, ReferenceArea, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'Recharts'
// import { SocketIOClientStatic } from 'socket.io-client'

// import { socketConfig } from '../../../config'
// import Graph from '../../components/common/graphs/Mygraph'
// import { CartesianGrids } from '../../components/common/graphs/Elements/index'


function randomIntFromInterval(min, max) // min and max included
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// const arrays = [
//   { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//   { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//   { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//   { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//   { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
// ]

interface State {
  rmpSetValues: Array<any>,
  graphTicks: Array<any>,
  allTime: number,
  counts: number,
  commonArray: Array<any>,
  rmpValues: Array<any>,
}

interface Props {
  socket: SocketIOClient.Socket
}

class Graphs extends Component<Props, State> {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.count = 0
    this.state = {
      rmpSetValues: [
        { timeStamp: 0, 'RPM set value': 500 },
        { timeStamp: 1, 'RPM current value': 520 },
        { timeStamp: 2, 'RPM current value': 480 },
        { timeStamp: 3, 'RPM current value': 510 },
        { timeStamp: 4, 'RPM current value': 511 },
        { timeStamp: 5, 'RPM current value': 491 },
        { timeStamp: 6, 'RPM current value': 498 },
        { timeStamp: 7, 'RPM current value': 501 },
        { timeStamp: 8, 'RPM current value': 511 },
        { timeStamp: 9, 'RPM current value': 525 },
        { timeStamp: 10, 'RPM current value': 505 },
        { timeStamp: 11, 'RPM current value': 497 },
        { timeStamp: 12, 'RPM current value': 491 },
        { timeStamp: 13, 'RPM current value': 511 },
        { timeStamp: 14, 'RPM current value': 522 },
        { timeStamp: 15, 'RPM current value': 503 },
        { timeStamp: 50, 'RPM set value': 500 },
        // { timeStamp: 50, 'RPM set value': 0 },
        // { timeStamp: 100, 'RPM set value': 0 },
        { timeStamp: 100, 'RPM set value': 2000 },
        { timeStamp: 150, 'RPM set value': 2000 },
        { timeStamp: 150 },
        { timeStamp: 200, 'RPM set value': 1500 },
        { timeStamp: 250, 'RPM set value': 1500 },
        { timeStamp: 250 },
        { timeStamp: 300, 'RPM set value': 1000 },
        { timeStamp: 350, 'RPM set value': 1000 },
        { timeStamp: 350 },
      ],
      graphTicks: [],
      allTime: 1,
      counts: 0,
      commonArray: [],
      rmpValues: [/* {
        name: 'RPM',
        uv: 0,
      } */],
    }
  }

  componentDidMount() {
    // this.props.socket.on(socketConfig.rpmChange, (data) => {
    //   const { rmpValue } = data
    //   // console.log('datas', data)
    //   this.setState({
    //     rmpValues: [...this.state.rmpValues, {
    //       name: 'RPM',
    //       rpm: data,
    //     }],
    //     counts: this.state.counts += 1,
    //     // rmpValues: [...this.state.rmpValues, rmpValue],
    //   })
    // })

    // this.props.socket.on(socketConfig.start, (data, form) => {
    //   console.log('form', form);
    //   const { allTime } = form
    //   const RPMchanges = form.lineFormer.filter(el => el.shortName === 'RPM')[0].changes
    //   console.log('RPMchanges', RPMchanges)
    //   const graphTicks = RPMchanges.reduce((acc, cur) => {
    //     acc.push(cur.startTime, cur.endTime)
    //     return acc
    //   }, [])
    //   // console.log('graphTicks', graphTicks)
    //   const rmpSetValues = RPMchanges.reduce((acc, cur) => {
    //     acc.push({
    //       timeStamp: cur.startTime,
    //       "RPM set value": cur.value,
    //     })
    //     acc.push({
    //       timeStamp: cur.endTime,
    //       "RPM set value": cur.value,
    //     })
    //     // acc.push({
    //     //   timeStamp: cur.endTime,
    //     // })
    //     return acc
    //   }, [])
    //   console.log('rmpSetValues', rmpSetValues);
    //   const RPMcurrentValue = rmpSetValues.filter(el => el['RPM set value'])
    //   const stepValues = []
    //   RPMcurrentValue.reduce((acc, curr) => {
    //     if (curr['RPM set value'] === acc['RPM set value']) {
    //       stepValues.push({
    //         ts: acc.timeStamp,
    //         tf: curr.timeStamp,
    //         setValue: curr['RPM set value'],
    //       })
    //     }
    //     return curr
    //   })
    //   console.log('stepValues', stepValues)
    //   this.setState({
    //     allTime,
    //     graphTicks,
    //     rmpSetValues,
    //     stepValues,
    //   })
    //   this.interval = setInterval(this.increaseCounts, 20)
    // })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  increaseCounts = () => {
    const { stepValues, rmpSetValues, rmpValues } = this.state
    let currentValue
    if (this.count === 0) console.log(rmpSetValues)
    const startTime = stepValues.filter(el => this.count >= el.ts && this.count <= el.tf)[0]
    // console.log('startTime', startTime)
    if (startTime) {
      // const setValue = rmpSetValues.find(el => el.timeStamp === this.count)
      // console.log('setValue', setValue)
      // console.log('rmpValues', rmpValues)
      currentValue = randomIntFromInterval(startTime.setValue - 50, startTime.setValue + 50)
      const count = { timeStamp: this.count, 'RPM current value': currentValue }
      // console.log('rmpSetValues', rmpSetValues)
      const index = rmpSetValues.findIndex(el => el.timeStamp === this.count)
      // console.log(this.count)
      let array
      if (index !== -1) {
        const value = { ...rmpSetValues[index], ...count }
        console.log('value', value)
        array = [{ ...rmpSetValues[index], ...value }]
        console.log('commonArray', this.state.commonArray)
      } else {
        array = [count]
      }
      this.setState({
        commonArray: this.state.commonArray.concat(array),
        // rmpSetValues: rmpSetValues.concat([count]),
        rmpValues: this.state.rmpValues.concat([count]),
      })
    } else {
      this.setState({
        commonArray: this.state.commonArray.concat([
          { timeStamp: this.count, 'RPM current value': 0 },
        ]),
        rmpValues: this.state.rmpValues.concat([
          { timeStamp: this.count, 'RPM current value': 0 },
        ]),
      })
    }
    this.count++
    if (this.count >= this.state.allTime) {
      clearInterval(this.interval)
    }
    // this.setState({
    //   counts: this.state.counts += 1,
    // })
    // RPM current value
  }

  render() {
    const { rmpValues, graphTicks, allTime, rmpSetValues, stepValues, commonArray } = this.state
    // console.log('rmpValues', rmpValues)
    // console.log('stepValues', stepValues)
    // console.log('rmpSetValues', rmpSetValues)
    // const RPMcurrentValue = rmpSetValues.filter(el => el['RPM set value'])
    // console.log('stepValues', stepValues)
    // console.log('graphTicks', graphTicks)
    // console.log('rmpSetValues', rmpSetValues);
    // console.log('rmpValues', rmpValues);
    return (<div>
      {/* {this.state.counts} */}
      <ResponsiveContainer
        minWidth={800}
        width="100%"
        height={400}
      >
        <LineChart
          data={commonArray}
        // width={600} height={300} data={rmpValues}
        // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* <XAxis
            // scale="ordinal"
            type="number"
            ticks={graphTicks}
            domain={[0, allTime]}
            dataKey="timeStamp"
          /> */}
          {/* <YAxis dataKey="RPM set value" hide yAxisId="setValue" /> */}
          <YAxis dataKey="RPM set value" domain={[0, 2000]} yAxisId="currentValue" />
          <CartesianGrid strokeDasharray="3 3" />
          {/* <Tooltip />
          <Legend />
          {stepValues && stepValues.map(el =>
            <ReferenceArea
              key={el.ts}
              yAxisId="setValue"
              x1={el.ts}
              x2={el.tf}
              y1={el.setValue}
              y2={el.setValue - 2}
              stroke="green"
              strokeOpacity={1}
            />,
          )}
          <Line
            isAnimationActive={false}
            dot={false}
            type="monotone"
            dataKey="RPM current value"
            stroke="red"
            strokeWidth={3}
            yAxisId="currentValue"
          /> */}
        </LineChart>
      </ResponsiveContainer >
      {/* <Graph
        // animatable
        scaleFactor={0.2}
        maxScale={10}
      >
        <CartesianGrids />
      </Graph> */}
    </div>)
  }
}

export default Graphs
