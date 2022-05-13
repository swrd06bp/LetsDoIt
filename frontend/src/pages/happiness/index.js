import React, { useEffect, useState } from 'react'
import { Bar, Line } from '@reactchartjs/react-chart.js'
import moment from 'moment'

import WeekGoal from '../../components/WeekGoal'
import YearChart from './YearChart'
import TopNavigation from '../../app/Navigation'
import { scoreToColor } from './utils'
import { todayDate } from './../../app/utils'
import Api from './../../app/Api'

function HappinessPage (props) {
  const [allData, setAllData] = useState([])
  const [graphData, setGraphData] = useState([])
  const [shortData, setShortData] = useState([])
  const [month, setMonth] = useState('')
  const [year, setYear] = useState(parseInt(moment(new Date()).format('YYYY')))
  const [notes, setNotes] = useState([])

  useEffect(() => {
    getHappiness()
  },[year])
  
  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness({currentYear: year, limit: 400})
    let json = await resp.json()
    const indexInf = 0
    const indexSup = Math.min(7, json.length)
    setAllData(json.reverse())
    if (json.length)
      drawGraph(json.slice(indexInf, indexSup))
  }


  const drawGraph = (rawData) => {
    let formatedData = {
      labels: rawData.map(x => moment(new Date(x.dueDate)).format('dddd, Do')),
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
    setShortData(rawData)
    setGraphData(formatedData) 
    setMonth(moment(new Date(rawData.slice(-1)[0].dueDate)).format('MMMM YYYY'))
    setNotes(rawData.map(x => x.note))
  }

  const onChooseData = (uniqueId) => {
    const indexSup = allData.map(x => x._id).indexOf(uniqueId) + 1
    const indexInf = Math.max(indexSup - 7, 0)
    if (indexSup > indexInf)
      drawGraph(allData.slice(indexInf, indexSup))

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
          label += ": " + graphData.datasets[0].data[tooltipItem.index]
          return label
        },
        afterLabel: function(tooltipItem, elem) {
          const label = "\nNote:\n" + notes[tooltipItem.index]
          return label
        }
      }
    }
  }


  let averageData = {
    labels: allData.map(x => new Date(x.dueDate).getDay() === 0 ? moment(new Date(x.dueDate)).format('Do MMMM') : null).filter(x => x),
    datasets: [
      {
        label: 'Average score',
        data: allData.map((x, index) => {
          if (new Date(x.dueDate).getDay() === 0) {
            let average = x.score
            for (let i = 1; i < 7; i++) {
              const newIndex = index - i
              if (newIndex < 0)
                return average / i
              else
                average += allData[newIndex].score
            }
            return average / 7
          }
          else 
            return null
        }).filter(x => x),
        borderWidth: 1,
        borderColor: 'black',
        fill: false,
      },
      {
        label: 'Maximum score',
        data: allData.map((x, index) => {
          if (new Date(x.dueDate).getDay() === 0) {
            let maxScore = x.score
            for (let i = 1; i < 7; i++) {
              const newIndex = index - i
              if (newIndex < 0)
                return maxScore
              else
                maxScore = Math.max(allData[newIndex].score, maxScore)
            }
            return maxScore
          }
          else 
            return null
        }).filter(x => x),
        borderWidth: 1,
        borderColor: 'grey',
        fill: false,
      },
      {
        label: 'Minimum score',
        data: allData.map((x, index) => {
          if (new Date(x.dueDate).getDay() === 0) {
            let minScore = x.score
            for (let i = 1; i < 7; i++) {
              const newIndex = index - i
              if (newIndex < 0)
                return minScore
              else
                minScore = Math.min(allData[newIndex].score, minScore)
            }
            return minScore
          }
          else 
            return null
        }).filter(x => x),
        borderColor: 'grey',
        borderWidth: 1,
        fill: '-1',
      }
    ]
  }

  const averageOptions = {
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
  }


  return (
    <div>
        <div>
          <TopNavigation />
          <div style={styles().title}>Happiness over time</div>
          <div style={styles().graphContainer}>
            <div style={{width: '50%'}}>
             <YearChart
              year={year}
              setYear={setYear}
              allData={allData} 
              shortData={shortData}
              onChoose={onChooseData}
            />
            </div>
            <div style={{width: '50%'}}>
              <div style={styles().titleMonth}>{month}</div>
              <div>
                <Bar
                  data={graphData}
                  options={options}
                  legend={null}
                  height={150}
                />
              </div>
              
              <div style={styles().dailyFocusContainer}>
                {shortData.map(singleData => {
                  return (
                  <div key={singleData._id} style={{
                    display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    width: (100/shortData.length).toString() + '%',
                  }}>
                  <WeekGoal 
                    day={true} 
                    weekNumber={new Date(singleData.dueDate).getFullYear() * 1000 + moment(singleData.dueDate).dayOfYear()} 
                    scale={0.7}
                  />
                  </div>
                  )
                })}
              </div>
              
            </div>
          </div>
          <div style={styles().averageContainer}>
            <Line 
              data={averageData}
              options={averageOptions}
              legend={null}
              height={100}
            />
              <div style={styles().weeklyFocusContainer}>
                {allData.map(singleData => {
                  if (new Date(singleData.dueDate).getDay() === 1) {
                    return (
                      <div key={singleData._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: (100/allData.length).toString() + '%',
                      }}>
                        <WeekGoal 
                          weekNumber={new Date(singleData.dueDate).getFullYear()*100 + parseInt(moment(singleData.dueDate).isoWeek())}
                          scale={0.7}
                        />
                      </div>
                    )
                  }
                  else return null
                }).filter(x => x)}
              </div>
          </div>
        </div>
    </div>
  )
}


const styles = () => ({
  title: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: 'bold', 
    marginBottom: 25,
  },
  titleMonth: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  graphContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dailyFocusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 30,
  },
  weeklyFocusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: 50,
    marginRight: 50,
  },
  averageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 50,
  },
})

export default HappinessPage
