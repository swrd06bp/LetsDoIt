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
      <div>
        <div>{props.item.content}</div> 
      </div>
      <div>
        <div>{frequency}</div>
      </div>
      <img style={{cursor: 'pointer'}} src={'./trash.png'} alt='delete' onClick={onDelete} width='20' height='20' />
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
    <div styles={styles().allHabitsContainer}>
      {allHabits.map(habit => (
        <HabitItem key={habit._id} item={habit} onUpdate={getAllHabits}/> 
      ))}
    </div>
  )
}

const styles = () => ({
  allHabitsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    overflow: 'auto',
  },
  habitWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: 900,
  },
})
