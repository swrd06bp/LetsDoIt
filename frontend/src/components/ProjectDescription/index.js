import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import { DragDropContext } from 'react-beautiful-dnd'

import AddTask from '../AddTask'
import TaskList from '../TaskList'
import ListButton from '../ListButton'
import GoalShape from '../GoalShape'
import Api from '../../Api'
import { sortProjectTasks} from '../../utils'


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
    const sortedTasks = sortProjectTasks(results).map( x => {
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
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={styles.title}>Description</h3>
        <div onClick={onDelete} style={styles.deleteButton}>
          <img 
            className='deleteTask' 
            alt='delete' 
            src='/trash.png'
            width='15'
            height='15'/>
        </div>
      </div>

      <div style={styles.titleTaskContainer}>
        <input 
          type='text' 
          name='content'
          value={content} 
          onChange={(event) => setContent(event.target.value)} 
          style={styles.titleTaskText}
        />
          <ListButton item={props.project} scale={1.5} onUpdate={()=>{}} type={'project'}/>
        </div>

     <div style={{display: 'flex', flexDirection: 'row', height: '60%'}}>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
       <h4 style={styles.noteTitle}>
        Status
       </h4>
        <div style={styles.checkboxContainer}>
          Someday
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
            </div>
          {dueDate && (
            <div style={styles.checkboxContainer}>
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
            <div style={styles.checkboxContainer}>
            Mark as done
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
          {doneAt && (
            <div style={styles.checkboxContainer}>
              Done at 
              <input 
                type='date' 
                value={new Date(doneAt).toJSON().slice(0, 10)} 
                onChange={(event) => {setDoneAt(new Date(event.target.value))}}
              />
            </div>
          )}
          </div>
        </div>

       <div style={styles.linkContainer}>
        <div>
        Link to:
        </div>
        <GoalShape colorCode={goalColorCode} />
        <Dropdown options={goalsOptions} value={goalId} onChange={({value}) => {setGoalId(value)}} placeholder="Goal" />
        
       </div>

      <div>
        <h4 style={styles.noteTitle}>
          Note
        </h4>
        <div style={styles.noteContainer}>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => setNote(event.target.value)} 
            style={styles.noteText}
          />
       </div>
      </div>

    </div>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <DragDropContext onDragEnd={() => {}}>
        <div style={styles.taskListTitle}>
          <h4 style={styles.noteTitle}>Tasks</h4>
          <h4 style={styles.noteTitle}>{tasks.filter(x => x.doneAt).length}/{tasks.length}</h4>
        </div>
        <div style={styles.taskList}>
        <TaskList
          droppableId={"tasks"}
          items={tasks}
          onUpdate={getProjectTasks}
          onDescribe={() => {}}
          scale={1}
          projectTask={true}
        />
        </div>
        </DragDropContext>
        <AddTask projectId={props.project._id} onUpdate={getProjectTasks} list={props.project.list}/>
      </div>
    </div>

      <div style={styles.footer}>
        <button style={styles.buttonCancel} onClick={() => props.onDescribe({
          task: null, project: null, goal: null
        })}>
          Cancel
        </button>
        <button style={styles.buttonSave} onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 600,
    height: '70%',
    margin: 30,
    background: 'white',
    borderRadius: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  buttonBack: {
    height: 20,
    width: 20,
  },
  titleTaskContainer: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '100%',
    padding: 3,
    margin: 10,
  },
  titleTaskText: {
    background: 'transparent',
    fontSize: 20,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 0,
    fontWeight: 'bold',
  },
  taskListTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskList: {
    overflow: 'scroll',
    height: '100%',
  },
  noteTitle: {
    marginLeft: 10,
    marginRight: 10,
    color: '#32A3BC',
  },
  noteText: {
    width: '90%',
    height: 120,
  },
  noteContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  checkboxContainer: {
    marginLeft: 10,
    fontSize: 13,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    marginLeft: 10,
    marginTop: 10,
    display: 'flex',
    fontSize: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownContainer: {
    display: 'flex',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  footer: {
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deleteButton: {
    cursor: 'pointer',
    marginRight: 5
  },
  buttonCancel: {
    background: '#F51111',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonSave: {
    background: '#32A3BC',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
}

export default ProjectDescription
