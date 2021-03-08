import React, { useState } from 'react'

import SmarterForm from './SmarterForm'
import BehaviorForm from './BehaviorForm'
import { getDimRatio } from '../../app/DynamicSizing'


function AddGoal (props) {

  const [goalId, setGoalId] = useState(null)

  return (
    <div style={styles().wrapper}>
      {!goalId && (
        <SmarterForm onNext={setGoalId} />
      )}
      {goalId && (
        <BehaviorForm goalId={goalId} onClose={props.onUpdate}/>
      )}
    </div>
  )
}

const styles = ()  => ({
  wrapper: {
    display: 'flex',
    width: 1300 * getDimRatio().X,
    height: 1000 * getDimRatio().Y,
  }
})


export default AddGoal


