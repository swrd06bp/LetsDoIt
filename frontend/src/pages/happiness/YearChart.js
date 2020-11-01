import React from 'react'
import moment from 'moment'

import { getDimRatio } from '../../app/DynamicSizing'
import { scoreToColor } from './utils'

function MonthChart (props) {

  const filteredData = props.data.filter(x => (
    moment(new Date(x.createdAt)).format('MMMM') === props.month)
  )

  let monthData = []


  for (let i = 1; i <= moment(new Date(`${props.index}/1/${props.year}`)).daysInMonth(); i++) {
    const index = filteredData.map(x => parseInt(moment(new Date(x.createdAt)).format('D'))).indexOf(i)
    if (index === -1)
      monthData.push({
        _id: i,
        score: -1  
      })
    else
      monthData.push(filteredData[index])
  }

  return (
    <div style={styles().monthWrapper}>
      <div style={styles().monthTitle}>{props.month}</div>
      {monthData.map(x => {
        if (x.score === -1)
          return (
              <div 
                key={x._id}
                role='img text'
                title={'No entry data'}
                style={{
                  ...styles().dayContainer,
                  background: 'lightgrey'
                }}
            />
          )
        else
          return (
              <div 
                key={x._id}
                role='img text'
                title={moment(new Date(x.createdAt)).format('dddd Do MMMM') + '\nHappiness score: ' + x.score}
                style={{
                  ...styles().dayContainer,
                  background: scoreToColor(x.score)
                }}
            />
            )
        })
      }

    </div>
  )

}

function YearChart (props) {

  const allMonths = moment.months()

  return (
    <div>
      <div style={styles().titleYear}>{props.year}</div>
      {allMonths.map((month, index) => (
        <MonthChart 
          key={month}
          year={'2020'}
          index={index + 1}
          data={props.data}
          month={month}
        />
      ))}
    </div>




  )
}


const styles = () => ({
  titleYear: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    width: 100 * getDimRatio().X,
    fontSize: 18 * getDimRatio().X,
  },
  dayContainer: {
    width: 25 * getDimRatio().X,
    height: 40 * getDimRatio().X,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderStyle: 'solid',
  }
})

export default YearChart
