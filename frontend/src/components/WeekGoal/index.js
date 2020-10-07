import React, { useState, useEffect } from 'react'
import moment from 'moment'

import AddWeekGoal from './AddWeekGoal'
import { getDimRatio } from '../../app/DynamicSizing'
import Api from '../../app/Api'


function WeekGoal (props) {
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [focusGoal, setFocusGoal] = useState(null)
  const api = new Api()
  const isShowing = (props.day && props.weekNumber <= new Date().getFullYear()*1000 + moment(new Date()).dayOfYear())
    || (!props.day && props.weekNumber <= new Date().getFullYear()*100 + moment(new Date()).isoWeek())


  useEffect(() => {
    getFocus()
  }, [props.weekNumber])

  const getFocus = async () => {
    if (isShowing) {
      const resp = await api.getFocus({
        type: props.day ? 'day' : 'week',
        number: props.weekNumber,
        limit: 1
      })
      const json = await resp.json()

      if (json.length) setFocusGoal(json[0])
      else setFocusGoal(null)
      setIsLoading(false)
    }
  }


  const scale = props.scale ? props.scale : 1

  if (isLoading || !isShowing) return null

  return (
    <div>
      <AddWeekGoal
        modalOpen={modalOpen}
        weekNumber={props.weekNumber}
        focusGoal={focusGoal}
        day={props.day}
        onClose={() => {
          setModalOpen(false)
          getFocus()
        }}
      />
      {!focusGoal && (
      <div 
        style={styles(scale).toolButton}
        onClick={() => setModalOpen(true)}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >
        {props.day ? 'Set your main focus for today' : 'Set a goal for this week'}
      </div>
      )}
      {focusGoal && (
        <div 
          onClick={() => setModalOpen(true)}
          style={styles(scale).goalContainer}
          onMouseOver={(event) => {
            event.target.style.background = '#33cc33'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#009933'
          }}
        >
          {focusGoal.content}
        </div>
      )}
    </div>
  )
}


const styles = (scale) => ({
  toolButton: {
    background: '#32A3BC',
    cursor: 'pointer',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: scale * 16 * getDimRatio().X,
    color: 'white',
    borderStyle: 'solid',
  },
  goalContainer: {
    background: '#009933',
    color: 'white',
    cursor: 'pointer',
    fontSize: scale * 16 * getDimRatio().X,
    borderRadius: 20,
    paddingRight: 10,
    paddingLeft: 10,
  },
})

export default WeekGoal
