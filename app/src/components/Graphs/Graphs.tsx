import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Brush, ComposedChart, Cell, LineChart, Line, ReferenceLine, ReferenceArea, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// import { SocketIOClientStatic } from 'socket.io-client'
import cn from 'classnames'

import socketConfig, { startSignal } from '../../../config/socket.config'
// import Graph from '../../components/common/graphs/Mygraph'
// import { CartesianGrids } from '../../components/common/graphs/Elements/index'
import s from './Graphs.css'
const data = [{ name: 'Page A', uv: 590, pv: 800, amt: 1400 },
{ name: 'Page B', uv: 868, pv: 967, amt: 1506 },
{ name: 'Page C', uv: 1397, pv: 1098, amt: 989 },
{ name: 'Page D', uv: 1480, pv: 1200, amt: 1228 },
{ name: 'Page E', uv: 1520, pv: 1108, amt: 1100 },
{ name: 'Page F', uv: 1400, pv: 680, amt: 1700 },
{ name: 'Page G', uv: 0, pv: 680, amt: 1700 },
{ name: 'Page H', uv: 700, pv: 680, amt: 1700 }
];

const TopBar = (props) => {
  const { fill, x, y, width, height } = props
  return <path d={height ? `M ${x} ${y} h ${width} v 2 h -${width} v -2` : null} stroke="green" fill={'green'} />;
}

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
  startTime: number,
  endTime: number,
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
    this.lastX=0
    this.x=0
    this.data = null
    this.state = {
      rmpsValues: [
      //   {
      //   RPMvalue: 425,
      //   timeStamp: 0
      // },
      // {
      //   RPMvalue: 225,
      //   timeStamp: 1
      // },
      // {
      //   RPMvalue: 325,
      //   timeStamp: 2
      // },
      // {
      //   RPMvalue: 455,
      //   timeStamp: 3
      // },
      // {
      //   RPMvalue: 125,
      //   timeStamp: 4
      // },
      // {
      //   RPMvalue: 335,
      //   timeStamp: 5
      // },
      // {
      //   RPMvalue: 215,
      //   timeStamp: 6
      // },
      // {
      //   RPMvalue: 115,
      //   timeStamp: 7
      // },
      // {
      //   RPMvalue: 85,
      //   timeStamp: 8
      // },
      // {
      //   RPMvalue: 285,
      //   timeStamp: 9
      // },
      // {
      //   RPMvalue: 15,
      //   timeStamp: 10
      // },
      // {
      //   RPMvalue: 115,
      //   timeStamp: 11
      // },
      // {
      //   RPMvalue: 335,
      //   timeStamp: 12
      // },
      // {
      //   RPMvalue: 266,
      //   timeStamp: 13
      // },
      // {
      //   RPMvalue: 432,
      //   timeStamp: 14
      // },
      // {
      //   RPMvalue: 234,
      //   timeStamp: 15
      // },
      // {
      //   RPMvalue: 123,
      //   timeStamp: 16
      // },
      // {
      //   RPMvalue: 169,
      //   timeStamp: 17
      // },
      // {
      //   RPMvalue: 65,
      //   timeStamp: 18
      // },
      // {
      //   RPMvalue: 35,
      //   timeStamp: 19
      // },
      // {
      //   RPMvalue: 85,
      //   timeStamp: 20
      // },
      // {
      //   RPMvalue: 270,
      //   timeStamp: 21
      // }
    ],
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
      startTime: 0,
      endTime: 21,
      width: 100,
      allTime: 1,
      counts: 0,
      dx:0,
      commonArray: [],
      rmpValues: [/* {
        name: 'RPM',
        uv: 0,
      } */],
    }
  }

  componentDidMount() {
    this.props.socket.on(socketConfig.rpmChange, (socketData) => {
      // const { rmpValue } = data
      const { data, time, temperature } = socketData
     // console.log('socketData', socketData)
      // console.log('socketData', socketData)
      // console.log('time', time)
      this.data = data
      const datas = {
        RPMvalue: data,
        timeStamp: time
      }
      this.setState({
        rmpsValues: [...this.state.rmpsValues, datas]
      })
    })

    this.props.socket.on(socketConfig.tempChange, socketData => {
      console.log('socketDatasocketDatasocketData', socketData)
    })

    this.props.socket.on(socketConfig.start, (data, form: startSignal) => {
      let counter = 0
      // console.log('form', form);
      const { allTime } = form
      const { distance, time } = data
      // console.log('time', time/allTime)
      // let timer = setInterval(()=> {
      //   console.log('this.data', this.data)
      //   const datas = {
      //     RPMvalue: this.data,
      //     timeStamp: counter
      //   }
      //   counter++
      //   this.setState({
      //     rmpsValues: [...this.state.rmpsValues, datas]
      //   })
      // }, time/allTime * 1000)
     
      const RPMchanges = form.lineFormer.filter(el => el.shortName === 'RPM')[0].changes
      // console.log('RPMchanges', RPMchanges)
      const graphTicks = RPMchanges.reduce((acc, cur) => {
        acc.push(cur.startTime, cur.endTime)
        return acc
      }, [])
      const datas = []
      datas.push({
        ...RPMchanges[0],
        value: RPMchanges[0].value + 120
      })
      RPMchanges.reduce((acc, curr) => {
        const duration = curr.startTime - acc.endTime
        if (duration !== 0) {
          datas.push({
            startTime: acc.endTime,
            endTime: curr.startTime,
            duration,
            value: 0,
            changeId: Math.random().toFixed(3)
          })
        }
        curr = {
          ...curr,
          value: curr.value + 150
        }
        datas.push(curr)
        return curr
      })
      // console.log('datas', datas);
      // console.log('graphTicks', graphTicks)
      const rmpSetValues = RPMchanges.reduce((acc, cur) => {
        acc.push({
          timeStamp: cur.startTime,
          "RPM set value": cur.value,
        })
        acc.push({
          timeStamp: cur.endTime,
          "RPM set value": cur.value,
        })
        // acc.push({
        //   timeStamp: cur.endTime,
        // })
        return acc
      }, [])
      // console.log('rmpSetValues', rmpSetValues);
      const RPMcurrentValue = rmpSetValues.filter(el => el['RPM set value'])
      const stepValues = []
      RPMcurrentValue.reduce((acc, curr, ind) => {
        if (curr['RPM set value'] === acc['RPM set value']) {
          stepValues.push({
            ts: acc.timeStamp,
            tf: curr.timeStamp,
            setValue: curr['RPM set value'],
            name: ind,
          })
        }
        return curr
      })
      // console.log('stepValues', stepValues)
      this.setState({
        allTime,
        endTime: allTime,
        graphTicks,
        rmpSetValues,
        stepValues,
        datas,
      })
      // this.interval = setInterval(this.increaseCounts, 20)
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  increaseCounts = () => {
    const { stepValues, rmpSetValues, rmpValues } = this.state
    let currentValue
    // if (this.count === 0) console.log(rmpSetValues)
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
        // console.log('value', value)
        array = [{ ...rmpSetValues[index], ...value }]
        // console.log('commonArray', this.state.commonArray)
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

  changeScale = (distance: {startIndex: number, endIndex: number}) => {
    // console.log(distance);
    this.setState({
      startTime: distance.startIndex,
      endTime: distance.endIndex,
    })
  }

  clear = () => {
    this.setState({
      rmpsValues: []
    })
  }

  incr = () => {
    const { rmpsValues, endTime, startTime, allTime } = this.state
    if(this.state.endTime + 10 < allTime) {
      const endTime = this.state.endTime + 10
      this.setState({
        endTime,
        width: (endTime-startTime)/allTime * 100
      })
    } else {
      this.setState({
        endTime: allTime,
        width: (allTime-startTime)/allTime * 100
      })
    }
  }

  decr = () => {
    const { rmpsValues, endTime, startTime, allTime} = this.state
    if(endTime > 10) {
        const endTime = this.state.endTime - 10
        this.setState({
        endTime,
        width: (endTime-startTime)/allTime * 100
      })
    }
  }

  grab = (e: React.MouseEvent) => {
    this.setState({
      isGrab: true,
    })
    this.x = e.clientX
  }

  unGrab = () => {
    this.setState({
      isGrab: false
    })
    this.lastX = this.state.dx
  }

  move = (e: React.MouseEvent ) => {
    if(this.state.isGrab){
      const { endTime, startTime, width, rmpsValues, allTime } = this.state
      // const width = (endTime-startTime)/21 * 100
      // console.log('width', endTime-startTime)
      // console.log('endTime', endTime)
      // console.log('numberOfElements', numberOfElements)
      const currentWidth = e.currentTarget.clientWidth
      const initialWidth = currentWidth/width * 100
      const offset = this.lastX + (e.clientX - this.x)/initialWidth*100
      // console.log('startTimeNew', +(offset * numberOfElements / 100).toFixed(2));
      const startTimeNew = +(offset * allTime / 100).toFixed(2)
      if(offset + 2/initialWidth*100 < 100 - width && offset > 0 ){
        const endTimeNew = /* endTime + */ +(width * allTime / 100 + startTimeNew).toFixed(2)
        // console.log('endTimeNew', endTimeNew);
        //  + +(endTime/initialWidth*100).toFixed(2)
        // console.log('startTimeNew', startTimeNew)
        // console.log('endTimeNew', endTimeNew)
        // console.log('endTimeNew - startTimeNew =', endTimeNew - startTimeNew)
        this.setState({
          dx: offset,
          startTime: startTimeNew,
          endTime: endTimeNew
        })
      }
    }
  }

  render() {
    const { isGrab, dx, rmpValues, width, rmpsValues, graphTicks, allTime, endTime, startTime, datas, rmpSetValues, stepValues, commonArray } = this.state
    // console.log('endTime', endTime);
    // console.log('rmpValues', rmpValues)
    // console.log('stepValues', stepValues)
    // console.log('rmpSetValues', rmpSetValues)
    // const RPMcurrentValue = rmpSetValues.filter(el => el['RPM set value'])
    // console.log('stepValues', stepValues)
    // console.log('graphTicks', graphTicks)
    // console.log('rmpSetValues', rmpSetValues);
    // console.log('rmpValues', rmpValues);
    // console.log('commonArray', commonArray);
    return (<div>
      <button onClick={this.clear}>Clear</button>
      <button onClick={this.incr}>+</button>
      <button onClick={this.decr}>-</button>
      {/* {this.state.counts} */}
      {/* <ResponsiveContainer
        minWidth={800}
        width="100%"
        height={400}
      > */}
        {/* <BarChart barCategoryGap={0} barGap={0} width={730} height={250} data={datas}>
          <CartesianGrid stroke='#f5f5f5' />
          <XAxis dataKey="changeId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey='value'
            shape={<TopBar />}
          >
            {
              data.map((entry, index) => (
                <Cell
                  stroke="black"
                  key={`cell-${index}`}
                  strokeWidth={3}
                  fill='transparent'
                />
              ))
            }
          </Bar>
        </BarChart> */}
        {/* <ComposedChart barCategoryGap={0} barGap={0} width={600} height={400} data={datas}
          margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
          <CartesianGrid stroke='#f5f5f5' />
          <XAxis dataKey="changeId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey='value'
            shape={<TopBar/>}
          >
           {
              data.map((entry, index) => (
                <Cell
                  stroke="black"
                  key={`cell-${index}`}
                  strokeWidth={3}
                  fill='transparent'
                />
              ))
            }
          </Bar>
          <Line type='monotone' dataKey='value' stroke='#ff7300' />
        </ComposedChart> */}

        <LineChart
          data={rmpsValues}
          width={1200} height={300}
          //  data={rmpValues}
        // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            allowDataOverflow={true}
            // scale="ordinal"
            type="number"
            // // ticks={graphTicks}
            domain={[startTime, endTime]}
            dataKey="timeStamp"
          />
          {/* <YAxis dataKey="value" domain={[0, 3000]} hide yAxisId="setValue" /> */}
          <YAxis dataKey="RPMvalue" domain={[0, 3000]} />
          {/* <YAxis /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {/* {datas && datas.map(el => {
            return <ReferenceArea
                key={Math.random()}
                // yAxisId="setValue"
                x1={el.startTime}
                x2={el.endTime}
                y1={el.value}
                y2={el.value - 2}
                stroke="red"
                strokeOpacity={1}
                ifOverflow='extendDomain'
              />
            }
          )} */}
          {stepValues && stepValues.map(el =>
            <ReferenceArea
              key={el.ts}
              // yAxisId="setValue"
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
            type='natural'
            dataKey="RPMvalue"
            stroke="red"
            strokeWidth={2}
            fill="red"
            dot={false}
            // connectNulls={true}
            // yAxisId="currentValue"
          />
          {/* <Brush onChange={this.changeScale} /> */}
        </LineChart>
        <div className={s.scale}>
          <button>-</button>
          <div className={cn(s['mover-container'])}>
            <div
              style={{
                cursor: !isGrab ? 'grab' : '-webkit-grabbing',
                width: `${width}%`,
                left: `${dx}%`
              }}
              onMouseLeave={this.unGrab}
              onMouseEnter={this.unGrab}
              onMouseMove={this.move}
              onMouseUp={this.unGrab}
              onMouseDown={this.grab}
              className={s.mover}>
            </div>
          </div>
          <button>+</button>
        </div>
      {/* </ResponsiveContainer > */}
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
