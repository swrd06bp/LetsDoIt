import React, { useState } from 'react'

import SmarterForm from './SmarterForm'



function AddGoal (props) {

  const [showBehaviorForm, setShowBehaviorForm] = useState(false)

  return (
    <div style={styles.wrapper}>
      {!showBehaviorForm && (
        <SmarterForm onNext={() => setShowBehaviorForm(true)}/>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    width: 1000,
    height: 800,
  }
}


export default AddGoal


