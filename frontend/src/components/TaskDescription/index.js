import React, { useState } from 'react'
import Dropdown from 'react-dropdown'

import GoalShape from '../GoalShape'
import ProjectShape from '../ProjectShape'

import Api from '../../Api'

function TaskDescription (props) {
  const [content, setContent] = useState(props.task.content)
  const [note, setNote] = useState(props.task.note)
  const [dueDate, setDueDate] = useState(props.task.dueDate)
  const [doneAt, setDoneAt] = useState(props.task.doneAt)
  const [projectId, setProjectId] = useState(props.task.projectId)
  const [goalId, setGoalId] = useState(props.task.goalId)
  const api = new Api()


  let projectsOptions = props.projects.map(x => ({value: x._id, label: x.content}))
  projectsOptions.unshift({value: null, label: 'none'})

  const projectColorCode = props.projects.filter(x => x._id === projectId).length
    ? props.projects.filter(x => x._id === projectId)[0].colorCode : null
  
  const goalColorCode = props.goals.filter(x => x._id === goalId).length
    ? props.goals.filter(x => x._id === goalId)[0].colorCode : null


  let goalsOptions = props.goals.map(x => ({value: x._id, label: x.content}))
  goalsOptions.unshift({value: null, label: 'none'})

  const onSave = async () => {
    await api.updateTask(props.task.id, {content, dueDate, note, projectId, goalId, doneAt})
    props.onDescribe({task: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteTask(props.task.id)
    props.onDescribe({task: null, project: null, goal: null})
  }



  return (
    <div style={styles.wrapper}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <h3 style={styles.title}>Description</h3>
        <button onClick={() => props.onDescribe({task: null, project: null, goal: null})}> 
          x
        </button>
      </div>
      <div>
          <input 
            type='text' 
            name='content'
            value={content} 
            onChange={(event) => setContent(event.target.value)} 
            style={{borderWidth: 0}}
          />
      </div>
      <div>
        <div>
          <input
            type='checkbox'
            checked={dueDate ? false : true}
            onChange={() => {
              if (dueDate) 
                setDueDate(null)
              else
                setDueDate(new Date())
            }}
          />
          Someday
          </div>
          {dueDate && (
          <div>
          Due 
          <input 
            type='date' 
            value={new Date(dueDate).toJSON().slice(0, 10)} 
            onChange={(event) => {setDueDate(new Date(event.target.value))}}
          />
          </div>
          )}
        </div>
        
        <div>
          <div>
          <input
            type='checkbox'
            checked={doneAt ? true : false}
            onChange={() => {
              if (doneAt) 
                setDoneAt(null)
              else
                setDoneAt(new Date())
            }}
          />
            Mark as done
          </div>
          {doneAt && (
            <div>
              Done at 
              <input 
                type='date' 
                value={new Date(doneAt).toJSON().slice(0, 10)} 
                onChange={(event) => {setDoneAt(new Date(event.target.value))}}
              />
            </div>
          )}
        </div>

       <div style={{'display': 'flex', 'flexDirection': 'row'}}>
        <div>
        Link to:
        </div>
          <ProjectShape colorCode={projectColorCode} />
        
        <Dropdown options={projectsOptions} value={projectId} onChange={({value}) => {setProjectId(value)}} placeholder="Project" />
        <GoalShape colorCode={goalColorCode} />
        <Dropdown options={goalsOptions} value={goalId} onChange={({value}) => {setGoalId(value)}} placeholder="Goal" />
        
       </div>

      <div>
         <h4>
         </h4>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => setNote(event.target.value)} 
            style={{height: 100}}
          />
      </div>

      <div style={styles.footer}>
      <button onClick={onDelete}>
        Delete
      </button>
      <button onClick={onSave}>
        Save
      </button>
      
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    background: 'white',
    width: 200,
    height: '50%',
    margin: 30,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
  },
  title: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  footer: {
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}

export default TaskDescription

