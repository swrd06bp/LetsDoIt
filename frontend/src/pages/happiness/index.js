import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'

import TopNavigation from '../../app/Navigation'
import { todayDate } from './../../app/utils'
import Api from './../../app/Api'

function HappinessPage (props) {
  const [showGraph, setShowGraph] = useState(false)
  const [data, setData] = useState([])
   

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
      let formatedData = [['Date', 'Score']] 
      for (let x of json)
        formatedData.push([new Date(x.createdAt), x.score])    
      setData(formatedData) 
      setShowGraph(true)
    }
    
  }


  return (
    <div>
      {showGraph && (
        <div>
          <TopNavigation />
          <div>
            <Chart
              width={'100%'}
              height={400} 
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={data}
              options={{
                chartArea: { height: '80%', width: '90%' },
                hAxis: { slantedText: false },
                vAxis: { viewWindow: { min: 0, max: 10 } },
                legend: { position: 'none' },
              }}
              rootProps={{ 'data-testid': '3' }}
              chartPackages={['corechart', 'controls']}
              controls={[
              {
                controlType: 'ChartRangeFilter',
                options: {
                  filterColumnIndex: 0,
                  ui: {
                    chartType: 'LineChart',
                    chartOptions: {
                      chartArea: { width: '90%', height: '50%' },
                      vAxis: { viewWindow: { min: 0, max: 10 } },
                      hAxis: { baselineColor: 'none' },
                    },
                  },
                },
                  controlPosition: 'bottom',
                  controlWrapperParams: {
                    state: {
                      range: { start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() },
                    },
                  },
                },
              ]}
            />

          </div>
        </div>
      )}
    </div>
  )
}


export default HappinessPage
