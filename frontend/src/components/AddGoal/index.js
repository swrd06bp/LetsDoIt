import React, { useState } from 'react'

import Api from '../../Api.js'


function AddGoal (props) {
  const [goalInput, setGoalInput] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault();
    const api = new Api() 
    if (goalInput) {
      await api.insertGoal({
        content: goalInput,
        list: 'Work',
        dueDate: new Date().toJSON(),
      })
    }
    setGoalInput('')
    props.onUpdate()
  }


  return (
    <div>
    <form onSubmit={onSubmit}>
      <label>
        <input 
          type="text"
          name="goal"
          placeholder="I want to.."
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />
      </label>
      <input type="submit" value="Add" />
    </form>
    </div>
  )
}

export default AddGoal


