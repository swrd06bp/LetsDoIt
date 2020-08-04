import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import { DragDropContext } from 'react-beautiful-dnd'

import AddTask from '../AddTask'
import TaskList from '../TaskList'
import GoalShape from '../GoalShape'
import Api from '../../Api'
import { sortTasks} from '../../utils'


function ProjectDescription (props) {
  const [content, setContent] = useState(props.project.content)
  const [note, setNote] = useState(props.project.note)
  const [dueDate, setDueDate] = useState(props.project.dueDate)
  const [doneAt, setDoneAt] = useState(props.project.doneAt)
  const [goalId, setGoalId] = useState(props.project.goalId)
  const [tasks, setTasks] = useState([])
  const api = new Api()

  useEffect(() => {
    getProjectTasks()
  }, [])

  const getProjectTasks = async () => {
    const resp = await api.getTasksProject(props.project._id) 
    const results = await resp.json()
    const sortedTasks = sortTasks(results).map( x => {
      const task = x
      task.id = task._id
      return task
    })
    setTasks(sortedTasks)
  }

  const goalColorCode = props.goals.filter(x => x._id === goalId).length
    ? props.goals.filter(x => x._id === goalId)[0].colorCode : null


  let goalsOptions = props.goals.map(x => ({value: x._id, label: x.content}))
  goalsOptions.unshift({value: null, label: 'none'})

  const onSave = async () => {
    await api.updateProject(props.project._id, {content, dueDate, note, goalId, doneAt})
    props.onDescribe({project: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteProject(props.project._id)
    props.onDescribe({project: null, project: null, goal: null})
  }
  return (
    <div style={styles.wrapper}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <button onClick={() => props.onDescribe({task: null, project: null, goal: null})}> 
          x
        </button>
        <button onClick={onDelete}> 
          delete
        </button>
      </div>


     <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{width: '50%'}}>
        <DragDropContext onDragEnd={() => {}}>
        <h3>Project task</h3>
        <TaskList
          droppableId={"tasks"}
          items={tasks}
          onUpdate={getProjectTasks}
          onDescribe={() => {}}
          scale={1}
          hideList={true}
        />
        </DragDropContext>
        <AddTask projectId={props.project._id} onUpdate={getProjectTasks}/>
      </div>
      <div style={{width: '50%'}}>
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

    </div>
    </div>

      <button onClick={onSave}>
        save
      </button>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 500,
    height: '50%',
  },
}

export default ProjectDescription
