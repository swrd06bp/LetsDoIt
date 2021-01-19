import React, { useState, useRef, useEffect } from 'react'

import { getDimRatio } from '../../app/DynamicSizing'
import Api from '../../app/Api.js'


function AddTask (props) {
  const [taskInput, setTaskInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
    window.addEventListener('focus', () => (inputRef.current ? inputRef.current.focus() : null))

    return () => window.addEventListener('focus', () => (inputRef.current ? inputRef.current.focus() : null))

  }, [])

  const onSubmit = async () => {
    const api = new Api() 
    let newTask = {
      content: taskInput,
      list: props.list ? props.list : 'Work',
      dueDate: props.dueDate ? props.dueDate.toJSON() : new Date().toJSON(),
      note: null,
      projectId: props.projectId ? props.projectId : null,
      goalId: props.goalId ? props.goalId : null,
    }
    if (taskInput) {
      const resp = await api.insertTask(newTask)
      const json = await resp.json()
      newTask.type = 'task'
      newTask.id = json.taskId.insertedId
      newTask._id = json.taskId.insertedId
      props.onCreate(newTask)
    }
    setTaskInput('')
  }


  return (
    <div style={styles().wrapper}>
          <input 
            style={styles().inputText}
            ref={inputRef}
            type="text"
            name="task"
            placeholder="Create a quick task"
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

