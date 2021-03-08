import React, { useState } from 'react'

import Api from '../../app/Api.js'


function AddProject (props) {
  const [projectInput, setProjectInput] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault();
    const api = new Api() 
    if (projectInput) {
      await api.insertProject({
        content: projectInput,
        list: 'Work',
        dueDate: new Date().toJSON(),
      })
    }
    setProjectInput('')
    props.onUpdate()
  }


  return (
    <div>
    <form onSubmit={onSubmit}>
      <label>
        <input 
          type="text"
          name="project"
          placeholder="I want to.."
          value={projectInput}
          onChange={(event) => setProjectInput(event.target.value)}
        />
      </label>
      <input type="submit" value="Add" />
    </form>
    </div>
  )
}

export default AddProject



