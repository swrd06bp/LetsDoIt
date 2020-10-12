import React, { useState, useEffect } from 'react'
import DeleteButton from '../../components/DeleteButton'

import Api from '../../app/Api'

function HabitItem (props) {
  const api = new Api()

  const onDelete = async () => {
    await api.deleteHabit(props.item._id)
    props.onUpdate()
  }

  const onSuccess = async (acheived) => {
    const habit = { acheived, doneAt: new Date() } 
    await api.updateHabit(props.item._id, habit)
    props.onUpdate()
  }

  const onCancel = async () => {
    const habit = { acheived: null, doneAt: null }
    await api.updateHabit(props.item._id, habit)
    props.onUpdate()
  }

  let frequency


  if (props.item.frequency.type === 'day') frequency = 'Every day'
  if (props.item.frequency.type === 'week') frequency = `${props.item.frequency.number} times a week`
  if (props.item.frequency.type === 'month') frequency = `${props.item.frequency.number} times a month`

  let background
  let color
  if (props.item.acheived === false) {
    background = 'red'
    color = 'white'
  }
  else if (props.item.acheived === true) {
    background = 'green'
    color = 'white'
  }

  return (
    <div style={{...styles().habitWrapper, background, color}}>
      <div style={styles().descriptionColumnContainer}>
        <div>{props.item.content}</div> 
      </div>
      <div style={styles().frequencyColumnContainer}>
        <div>{frequency}</div>
      </div>
      <div style={styles().timeColumnContainer}>
        <div>{props.item.startTime}</div> 
      </div>
      {props.item.doneAt && ( <div style={styles().actionColumnContainer}>
        <img style={styles().icon} src={'./cancel.png'} alt='Go back to this habit' title='Go back to this habit' onClick={() => onCancel()} width='20' height='20' />
      </div>
      )}
      {!props.item.doneAt && ( <div style={styles().actionColumnContainer}>
        <img style={styles().icon} src={'./done.png'} alt='Mark habit as done' title='Mark habit as done' onClick={() => onSuccess(true)} width='20' height='20' />
        <img style={styles().icon} src={'./fail.png'} alt='Mark habit as too ambitious for now' title='Mark habit as too ambitious for now' onClick={() => onSuccess(false)} width='20' height='20' />
      </div>
      )}
      <div style={styles().deleteColumnContainer}>
        <DeleteButton 
          confirm={true}
          onDelete={onDelete}
          height='20'
          width='20'
        />
      </div>
    </div>
  )

}

export default function ListHabit (props) {
  const [allHabits, setAllHabits] = useState([])
  
  const getAllHabits = async () => {
    const api = new Api()
    const resp = await api.getHabitsGoal(props.goalId, true)
    const json = await resp.json()
    setAllHabits(json)
  }
  
  useEffect(() => {
    getAllHabits()
  },[props.update])

  return (
    <div style={styles().allHabitsContainer}>
      <div style={{...styles().headerContainer, textAlign: 'center'}}>
        <div style={styles().descriptionColumnContainer}>Description</div>
        <div style={styles().frequencyColumnContainer}>Frequency</div>
        <div style={styles().timeColumnContainer}>Time</div>
        <div style={styles().actionColumnContainer}>Action</div>
        <div style={styles().deleteColumnContainer}>Delete</div>
      </div>
      {allHabits.map(habit => (
        <HabitItem key={habit._id} item={habit} onUpdate={getAllHabits}/> 
      ))}
    </div>
  )
}

const styles = () => ({
  allHabitsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 20,
    marginLeft: 20,
    width: '100%',
    height: 200,
    overflow: 'scroll',
  },
  habitWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  descriptionColumnContainer: {
    width: '45%',
    textAlign: 'center',
  },
  frequencyColumnContainer: {
    width: '30%',
    textAlign: 'center',
  },
  timeColumnContainer: {
    textAlign: 'center',
    width: '15%',
  },
  actionColumnContainer: {
    textAlign: 'center',
    width: '10%',
  },
  deleteColumnContainer: {
    textAlign: 'center',
    width: '10%',
  },
  icon: {
    cursor: 'pointer',
    marginRight: 3,
    marginLeft: 3,
  },
})
