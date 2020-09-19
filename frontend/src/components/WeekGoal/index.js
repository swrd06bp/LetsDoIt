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
  const isShowing = props.weekNumber <= moment(new Date()).week()


  useEffect(() => {
    getFocus()
  }, [props.weekNumber])

  const getFocus = async () => {
    if (isShowing) {
      const resp = await api.getFocus({
        type: 'week',
        number: props.weekNumber,
        limit: 1
      })
      const json = await resp.json()

      if (json.length) setFocusGoal(json[0])
      else setFocusGoal(null)
      setIsLoading(false)
    }
  }


  if (isLoading || !isShowing) return null

  return (
    <div>
      <AddWeekGoal
        modalOpen={modalOpen}
        weekNumber={props.weekNumber}
        focusGoal={focusGoal}
        onClose={() => {
          setModalOpen(false)
          getFocus()
        }}
      />
      {!focusGoal && (
      <div 
        style={styles().toolButton}
        onClick={() => setModalOpen(true)}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >
        Set a goal for this week
      </div>
      )}
      {focusGoal && (
        <div 
          onClick={() => setModalOpen(true)}
          style={styles().goalContainer}
          onMouseOver={(event) => {
            event.target.style.background = '#d9d9d9'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#b3b3b3'
          }}
        >
          {focusGoal.content}
        </div>
      )}
    </div>
  )
}


const styles = () => ({
  toolButton: {
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16 * getDimRatio().X,
    color: 'white',
    borderStyle: 'solid',
  },
  goalContainer: {
    background: '#b3b3b3',
    cursor: 'pointer',
    fontSize: 16 * getDimRatio().X,
    borderRadius: 20,
    paddingRight: 10,
    paddingLeft: 10,
  },
})

export default WeekGoal
