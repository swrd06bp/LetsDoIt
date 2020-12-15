import React, { useReducer } from 'react'
import ListHabit from '../../components/AddGoal/ListHabit'
import AddHabit from '../../components/AddGoal/AddHabit' 

function HabitsTab (props) {
  const [update, forceUpdate] = useReducer(x => x + 1, 0)

  return (
    <div style={styles().habitsWrapper}>
      <AddHabit goalId={props.goal._id} getAllHabits={forceUpdate} />
      <ListHabit goalId={props.goal._id} update={update} />
    </div>
  )
}

const styles = () => ({
  habitsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default HabitsTab
