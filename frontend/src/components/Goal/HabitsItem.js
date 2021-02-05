import React, { useState, useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'

import EditHabitForm from './EditHabitForm'
import Api from '../../app/Api'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'



function HabitsItem (props) {
  const [allHabits, setAllHabits] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const mixpanel = useMixpanel()
  const api = new Api()

  useEffect(() => {
    getHabits() 
  }, [props.describeElem.habit])

  const getHabits = async () => {
    const resp = await api.getHabitsGoal(props.goal._id, props.completed)
    const json = await resp.json()
    setAllHabits(json)
  }
  
  const onAddHabit = async (habit) => {
    await api.insertHabit(habit) 
    await getHabits()
    setShowEditForm(false)
  }

  return (
    <div style={styles().habitsWrapper}>
      {showEditForm && (
        <EditHabitForm 
          goalId={props.goal._id}
          onAddHabit={onAddHabit} 
          onClose={() => setShowEditForm(false)} 
        />
      )} 
      <div style={styles().firstHabitPart}>
      <div
        onClick={() => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Add an Habit')
          setShowEditForm(true)
        }}
        style={styles().toolButton}
        title={'Add an habit for this goal'}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >+</div>
      </div>
      <div style={{...styles().secondHabitPart, borderLeftColor: props.goal.colorCode}}>
    
        {allHabits.map(habit => (
          <div 
            key={habit._id}
            onClick={() => { 
              if (props.describeElem.habit)
                props.onDescribe({goal: null, task: null, project: null, habit: null})
              else
                props.onDescribe({goal: props.goal, task: null, project: null, habit})
            }}
            style={{...styles().habitContainer, background: props.describeElem.habit && props.describeElem.habit._id === habit._id ? 'lightgreen' : '#d8d0d2'}}
          >
            <div style={styles(1).habitText}>{habit.content}</div>
            <div style={styles().checkIcon}>
              {habit.acheived && (
                <img src='/check.png' alt='' height='17' witdh='17' />
              )}
              {props.goal.doneAt && habit.acheived === null && (
                <img src='/check.png' alt='' height='17' witdh='17' />
              )}
              {habit.acheived === false && (
                <img src='/uncheck.png' alt='' height='17' witdh='17' />
              )}
            </div>
          </div>
        ))}          
      </div>
    </div>
  )
}

const styles = (scale) => ({
  habitsWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20 * getDimRatio().Y,
  },
  firstHabitPart: {
    display: 'flex',
    flexDirection: 'column',
    width: 50 * getDimRatio().X,
    justifyContent: 'flex-end',

  },
  secondHabitPart: {
    borderLeftStyle: 'solid',
    borderLeftSize: 10,
    flex: 1,
  },
  habitContainer: {
    cursor: 'pointer',
    borderRadius: 20,
    marginTop: 2 * getDimRatio().X,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitText: {
    marginLeft: 10,
    fontSize: 16 * scale *  getDimRatioText().X,
  },
  toolButton: {
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16 * getDimRatio().X,
    color: 'white',
    borderStyle: 'solid',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 4,
  },
})


export default HabitsItem
