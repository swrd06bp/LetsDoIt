import React, { useState } from 'react'

import { getDimRatio } from '../../app/DynamicSizing'
import Api from '../../app/Api.js'


function AddTask (props) {
  const [taskInput, setTaskInput] = useState('')


  const onSubmit = async () => {
    const api = new Api() 
    if (taskInput) {
      await api.insertTask({
        content: taskInput,
        list: props.list ? props.list : 'Work',
        dueDate: new Date().toJSON(),
        note: null,
        projectId: props.projectId ? props.projectId : null,
        goalId: props.goalId ? props.goalId : null,
      })
    }
    setTaskInput('')
    props.onUpdate()
  }


  return (
    <div style={styles().wrapper}>
          <input 
            style={styles().inputText}
            type="text"
            name="task"
            placeholder="I want to.."
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            onKeyUp={(event) => {
              if (event.keyCode === 13)
                onSubmit()
            }}
          />
        <div 
          style={styles().button}
          onClick={onSubmit}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
        >
          Add
        </div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  inputText: {
    borderRadius: 20,
    width: '70%',
    height: 30 * getDimRatio().Y,
    paddingLeft: 20,
  },
  button: {
    display: 'flex',
    height: 30*getDimRatio().Y,
    width: 40* getDimRatio().X,
    cursor: 'pointer',
    backgroundColor: '#32A3BC',
    borderRadius: 40,
    fontSize: 14* getDimRatio().X,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
  },
})

export default AddTask

