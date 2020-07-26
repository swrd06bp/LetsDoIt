import React, { useState } from 'react'

import Api from '../../Api.js'


function AddTask (props) {
  const [taskInput, setTaskInput] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault();
    const api = new Api() 
    if (taskInput) {
      await api.insertTask({
        content: taskInput,
        list: 'Personal',
        dueDate: new Date().toJSON(),
        note: null,
      })
    }
    setTaskInput('')
    props.onUpdate()
  }


  return (
    <div>
    <form onSubmit={onSubmit}>
      <label>
        <input 
          type="text"
          name="task"
          placeholder="Task"
          value={taskInput}
          onChange={(event) => setTaskInput(event.target.value)}
        />
      </label>
      <input type="submit" value="Add" />
    </form>
    </div>
  )
}

export default AddTask

