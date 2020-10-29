import React, { useEffect, useState } from 'react'
import { Bar, Line } from '@reactchartjs/react-chart.js'
import moment from 'moment'

import YearChart from './YearChart'
import TopNavigation from '../../app/Navigation'
import { scoreToColor } from './utils'
import { todayDate } from './../../app/utils'
import Api from './../../app/Api'

function HappinessPage (props) {
  const [showGraph, setShowGraph] = useState(false)
  const [allData, setAllData] = useState([])
  const [shortData, setShortData] = useState([])
  const [month, setMonth] = useState([])
  const [notes, setNotes] = useState([])
   

  useEffect(() => {
    getHappiness()
  },[])
  
  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness(90)
    const json = await resp.json()
    if (!json.length || new Date(json[0].createdAt) < todayDate()) 
      window.location.assign('/happinesscreate')
    else {
      setAllData(json)
      drawGraph(json.slice(0, 7).reverse())
      setShowGraph(true)
    }
    
  }


  const drawGraph = (rawData) => {
      let formatedData = {
        labels: rawData.map(x => moment(new Date(x.createdAt)).format('dddd, Do')),
        datasets: [
          {
            label: 'Happiness score',
            data: rawData.map(x => x.score),
            backgroundColor: rawData.map(x => scoreToColor(x.score)),
            borderColor: rawData.map(x => scoreToColor(x.score)),
            borderWidth: 1,
          }
        ]
      }
      setShortData(formatedData) 
      setMonth(moment(new Date(rawData.slice(-1)[0].createdAt)).format('MMMM YYYY'))
      setNotes(rawData.map(x => x.note))
  
  }

  const options = {
    scales: {
      yAxes: [
      {
        ticks: {
          beginAtZero: true,
          suggestedMax: 10,
        },
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, elem) {
          let label = elem.datasets[tooltipItem.datasetIndex].label
          label += ": " + shortData.datasets[0].data[tooltipItem.index]
          return label
        },
        afterLabel: function(tooltipItem, elem) {
          const label = "\nNote:\n" + notes[tooltipItem.index]
          return label
        }
      }
    }
  }

  return (
    <div>
      {showGraph && (
        <div>
          <TopNavigation />
          <div style={styles().title}>Happiness over time</div>
          <div style={styles().graphContainer}>
            <div style={{width: '50%'}}>
             <YearChart
              data={allData} 
            />
            </div>
            <div style={{width: '50%'}}>
              <div>{month}</div>
              <div>
                <Bar
                  data={shortData}
                  options={options}
                  legend={null}
                  height={150}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const styles = () => ({
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold', 
  },
  graphContainer: {
    display: 'flex',
    flexDirection: 'row',

  },
})

export default HappinessPage
