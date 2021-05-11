import React, { useState } from 'react'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import Api from '../../app/Api.js'


function AddTask (props) {
  const [taskInput, setTaskInput] = useState('')
  const [note, setNote] = useState(null)


  const onSubmit = async () => {
    const api = new Api() 
    let newTask = {
      content: taskInput,
      list: props.list ? props.list : 'Work',
      dueDate: props.dueDate ? props.dueDate.toJSON() : new Date().toJSON(),
      note,
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

  const linkTab = () => {
    const browser = window.browser || window.chrome
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      let tab = tabs[0]
      setNote(tab.url)
      setTaskInput(tab.title)
    })
  }

  const addShowNote = async () => {
    const api = new Api() 
    let newTask = {
      content: taskInput ? taskInput : 'New task',
      list: props.list ? props.list : 'Work',
      dueDate: props.dueDate ? props.dueDate.toJSON() : new Date().toJSON(),
      note,
      projectId: props.projectId ? props.projectId : null,
      goalId: props.goalId ? props.goalId : null,
    }
    const resp = await api.insertTask(newTask)
    const json = await resp.json()
    newTask.type = 'task'
    newTask.id = json.taskId.insertedId
    newTask._id = json.taskId.insertedId
    newTask.isNoteActive = true
    props.onDescribe({task: newTask, goal: null, project: null})
  }


  return (
    <div style={styles().wrapper}>
        <img 
          onClick={linkTab}
          src="/link.png"
          alt=""
          title="Add this page in your to do"
          style={styles().imageLink}
        />
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
        <img 
          onClick={addShowNote}
          src="/post-it.png"
          alt=""
          title="Create a task"
          style={styles().imageLink}
        />
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
    height: 35 * getDimRatio().Y,
    fontSize: 18* getDimRatioText().X,
    paddingLeft: 20,
  },
  button: {
    display: 'flex',
    height: 40*getDimRatio().Y,
    width: 50* getDimRatio().X,
    cursor: 'pointer',
    backgroundColor: '#32A3BC',
    borderRadius: 40,
    fontSize: 18* getDimRatioText().X,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
  },
  imageLink: {
    height: 45 * getDimRatio().X,
    width: 45 * getDimRatio().X,
    cursor: 'pointer',
    marginHorizontal: 10,
  },
})

export default AddTask

