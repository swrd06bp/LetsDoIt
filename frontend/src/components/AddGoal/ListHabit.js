import React, { useState, useEffect } from 'react'

import Api from '../../app/Api'

function HabitItem (props) {

  const onDelete = async () => {
    const api = new Api()
    await api.deleteHabit(props.item._id)
    props.onUpdate()
  }

  let frequency

  if (props.item.frequency.type === 'day') frequency = 'Every day'
  if (props.item.frequency.type === 'week') frequency = `${props.item.frequency.number} times a week`
  if (props.item.frequency.type === 'month') frequency = `${props.item.frequency.number} times a month`

  return (
    <div style={styles().habitWrapper}>
      <div style={styles().descriptionColumnContainer}>
        <div>{props.item.content}</div> 
      </div>
      <div style={styles().frequencyColumnContainer}>
        <div>{frequency}</div>
      </div>
      <div style={styles().timeColumnContainer}>
        <div>{props.item.startTime}</div> 
      </div>
      <div style={styles().actionColumnContainer}>
        <img style={styles().trashImage} src={'./trash.png'} alt='delete' onClick={onDelete} width='20' height='20' />
      </div>
    </div>
  )

}

export default function ListHabit (props) {
  const [allHabits, setAllHabits] = useState([])
  
  const getAllHabits = async () => {
    const api = new Api()
    const resp = await api.getHabitsGoal(props.goalId)
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
    width: '35%',
    textAlign: 'center',
  },
  timeColumnContainer: {
    textAlign: 'center',
    width: '15%',
  },
  actionColumnContainer: {
    textAlign: 'center',
    width: '15%',
  },
  trashImage: {
    cursor: 'pointer',
  },
})
