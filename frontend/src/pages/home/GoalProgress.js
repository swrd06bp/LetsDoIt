import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { Line } from '@reactchartjs/react-chart.js'
import moment from 'moment'

import Api from '../../app/Api'
import { todayDate } from './../../app/utils'


function GoalProgress (props) {

  const [rawData, setRawData] = useState({})
  const [graphData, setGraphData] = useState(null)
  const [allHabits, setAllHabits] = useState([])
  const [chosenHabit, setChosenHabit] = useState({ value: 'All', label: 'All'})
  const api = new Api()

  useEffect(() => {
    getAllHabits() 
  }, [])

  const getAllHabits = async () => {
    const resp_habit = await api.getHabitsGoal(props.goalId, true) 
    const json_habit = await resp_habit.json()


    let tempData = {}
    for (let elem of json_habit) {
      const resp_routine = await api.getRoutinesHabit({habitId: elem._id})
      const json_routine = await resp_routine.json()
      tempData[elem._id] = {}
      tempData[elem._id].elem = elem
      tempData[elem._id].data = json_routine
    } 

    
    let data = json_habit.map(x => { return {value: x._id, label: x.content}})
    data.push({value: 'All', label: 'All'}) 
    setAllHabits(data)
    setRawData(tempData)
    
    
    formatData(tempData, chosenHabit)
  }

  const formatData = (rawData, chosenHabit) => {
    if (chosenHabit.label === 'All')
      console.log('ok')
    else {
      const frequency = rawData[chosenHabit.value].elem.frequency

      const dayFrequency = frequency.type === 'day' ? 1 : (frequency.type === 'week' ? 7 : 30)

      let labels = []
      let dataPoints = []
      let cummulatedDataPoint = 0

      let tempDate = new Date(rawData[chosenHabit.value].elem.createdAt)
      
      const limitDate = rawData[chosenHabit.value].elem.acheived === true && rawData[chosenHabit.value].elem.acheived === true
        ? new Date(rawData[chosenHabit.value].elem.doneAt) : todayDate()


      while (tempDate < limitDate) {
        // deep copy tempDate
        const tempDate1 = new Date(JSON.parse(JSON.stringify(tempDate.toJSON())))
        // Add the labels for later
        labels.push(moment(tempDate1).format('DD/MM/YYYY'))
        // increment the temp date 
        tempDate.setDate(tempDate.getDate() + dayFrequency)
        // Add data
        const filteredData = rawData[chosenHabit.value].data.filter(x => {
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

  return (<div>
    <Dropdown
      options={allHabits}
      value={chosenHabit.label}
      onChange={(x) => {
        setChosenHabit(x)
        formatData(rawData, x)
      }}
      placeholder="Choose a habit"
    />
    {graphData && (
      <Line data={graphData} options={options} />
    )}
    </div>)
}


export default GoalProgress
