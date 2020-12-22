import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { Line } from '@reactchartjs/react-chart.js'
import moment from 'moment'

import Api from '../../app/Api'
import { todayDate } from './../../app/utils'


function HabitProgress (props) {

  const [rawData, setRawData] = useState({})
  const [graphData, setGraphData] = useState(null)
  const api = new Api()

  useEffect(() => {
    getAllData() 
  }, [props.habit._id])

  const getAllData = async () => {
    const resp = await api.getRoutinesHabit({habitId: props.habit._id})
    const json = await resp.json()
    setRawData(json)
    formatData(json)
  }

  const formatData = (rawData) => {
    const frequency = props.habit.frequency

    const dayFrequency = frequency.type === 'day' ? 1 : (frequency.type === 'week' ? 7 : 30)

    let labels = []
    let dataPoints = []
    let cummulatedDataPoint = 0

    let tempDate = new Date(props.habit.createdAt)
    
    const limitDate = props.habit.acheived === true && props.habit.acheived === false
      ? new Date(props.habit.doneAt) : todayDate()


    while (tempDate < limitDate) {
      // deep copy tempDate
      const tempDate1 = new Date(JSON.parse(JSON.stringify(tempDate.toJSON())))
      // Add the labels for later
      labels.push(moment(tempDate1).format('DD/MM/YYYY'))
      // increment the temp date 
      tempDate.setDate(tempDate.getDate() + dayFrequency)
      // Add data
      const filteredData = rawData.filter(x => {
        return x.isDone && new Date(x.createdAt) > tempDate1 && new Date(x.createdAt) < tempDate
      })
      if (filteredData.length)
        cummulatedDataPoint += 1
      else
        cummulatedDataPoint -= 1
      dataPoints.push(cummulatedDataPoint) 
    } 


    const data = {
      labels,
      datasets: [
      {
        label: 'Progress data',
        data: dataPoints,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
    }
    setGraphData(data)
  }

  
  
  const options = {
    scales: {
      yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
      ],
    },
  }

  return (
    <div>
    {graphData && (
      <Line data={graphData} options={options} />
    )}
    </div>
  )
}


export default HabitProgress
