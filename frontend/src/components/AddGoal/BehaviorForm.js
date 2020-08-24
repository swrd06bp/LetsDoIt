import React, { useReducer } from 'react'

import AddHabit from './AddHabit'
import ListHabit from './ListHabit' 




function BehaviorForm (props) {
  const [update, forceUpdate] = useReducer(x => x + 1, 0)

  return (
    <div style={styles().wrapper}>
      <img style={styles().image} src='./success.png' alt='' width='400' height='300' />
      <div>What new habit will help you to get there</div>
    
      <AddHabit goalId={props.goalId} getAllHabits={forceUpdate} />

      <ListHabit goalId={props.goalId} update={update}/>

      <div style={styles().doneButton} onClick={props.onClose}>
        Done
      </div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1,
  },
  image: {
    margin: 20,
  },
  doneButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'lightblue',
    cursor: 'pointer',
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    width: 50,
    fontWeight: 'bold',
  },
})


export default BehaviorForm

