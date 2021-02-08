import React, { useState } from 'react'
import moment from 'moment'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import { scoreToColor } from './utils'
import { todayDate } from '../../app/utils'

function MonthChart (props) {
  const [editId, setEditId] = useState(null)

  const filteredData = props.allData.filter(x => (
    moment(new Date(x.dueDate)).format('MMMM') === props.month)
  )

  let monthData = []


  for (let i = 1; i <= moment(new Date(`${props.index}/1/${props.year}`)).daysInMonth(); i++) {
    const index = filteredData.map(x => parseInt(moment(new Date(x.dueDate)).format('D'))).indexOf(i)
    if (index === -1)
      monthData.push({
        _id: new Date(props.year, props.index - 1, i).toJSON(),
        score: -1  
      })
    else
      monthData.push(filteredData[index])
  }

  
  const firstShortDataId = props.shortData.length ? props.shortData[0]._id : null
  const lastShortDataId = props.shortData.length ? props.shortData[props.shortData.length - 1]._id : null
  const shortDataId = props.shortData.length ? props.shortData.map(x => x._id) : []


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
                  background: 'lightgrey',
                }}
                onMouseOver={() => setEditId(x._id)}
                onMouseLeave={() => setEditId(null)}
            >
              { editId === x._id && new Date(x._id) <= todayDate() && (
                <a href={'/happinessCreate/' + x._id}>
                  <img src='/edit.png' title='Provide happiness data' style={styles().editIcon}/>
                </a>
              )}
            </div>
          )
        else
          return (
              <div 
                key={x._id}
                role='img text'
                title={moment(new Date(x.dueDate)).format('dddd Do MMMM') + '\nHappiness score: ' + x.score}
                style={{
                  ...styles().dayContainer,
                  background: scoreToColor(x.score),
                  borderTopColor: shortDataId.includes(x._id) ? 'blue': 'grey',
                  borderTopWidth: shortDataId.includes(x._id) ? 4 : 0.5,
                  borderBottomColor: shortDataId.includes(x._id) ? 'blue' : 'grey',
                  borderBottomWidth: shortDataId.includes(x._id) ? 4 : 0.5,
                  borderRightWidth: x._id === lastShortDataId ? 4 : 0.5,
                  borderRightColor: x._id === lastShortDataId ? 'blue' : 'grey',
                  borderLeftWidth: x._id === firstShortDataId ? 4 : 0.5,
                  borderLeftColor: x._id === firstShortDataId ? 'blue' : 'grey',

                }}
                onClick={() => {
                  props.onChoose(x._id)
                  setEditId(x._id)
                }}
                onMouseLeave={() => setEditId(null)}
            >
              { editId === x._id && (
                <a href={'/happinessEdit/' + x._id + '/' + x.dueDate}>
                  <img src='/edit.png' title='Provide happiness data' style={styles().editIcon}/>
                </a>
              )}
            </div>
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
      <div style={styles().yearContainer}>
        <div
          style={styles().toolButton}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
          onClick={() => {props.setYear(props.year - 1)}}
        >
          &lt;
        </div>
        <div
          style={styles().toolButton}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
          onClick={() => {props.setYear(props.year + 1)}}
        >
          &gt;
        </div>
        <div style={styles().titleYear}>{props.year}</div>
      </div>
      {allMonths.map((month, index) => (
        <MonthChart 
          key={month}
          year={props.year.toString()}
          index={index + 1}
          allData={props.allData}
          shortData={props.shortData}
          month={month}
          onChoose={props.onChoose}
        />
      ))}
    </div>




  )
}


const styles = () => ({
  yearContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25 * getDimRatio().X,
    height: 45 * getDimRatio().X,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderStyle: 'solid',
  },
  editIcon: {
    height: 20,
    width: 15,
  },
  toolButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18 * getDimRatioText().X,
    color: 'white',
    borderStyle: 'solid',
  },
  firstActiveDayContainer: {
  
  },
  lastActiveDayContainer: {
  
  },
  activeDayContainer: {
  },
})

export default YearChart
