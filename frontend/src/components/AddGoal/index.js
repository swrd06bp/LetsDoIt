import React, { useState } from 'react'

import SmarterForm from './SmarterForm'
import BehaviorForm from './BehaviorForm'



function AddGoal (props) {

  const [showBehaviorForm, setShowBehaviorForm] = useState(false)

  return (
    <div style={styles.wrapper}>
      {!showBehaviorForm && (
        <SmarterForm onNext={() => setShowBehaviorForm(true)}/>
      )}
      {showBehaviorForm && (
        <BehaviorForm />
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    width: 1000,
    height: 700,
  }
}


export default AddGoal


