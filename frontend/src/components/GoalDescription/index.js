import React, { useState, useEffect } from 'react'
import 'react-dropdown/style.css'
import { DragDropContext } from 'react-beautiful-dnd'

import AddTask from '../AddTask'
import TaskList from '../TaskList'
import ListButton from '../ListButton'
import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function GoalDescription (props) {
  const [content, setContent] = useState(props.goal.content)
  const [note, setNote] = useState(props.goal.note)
  const [dueDate, setDueDate] = useState(props.goal.dueDate)
  const [doneAt, setDoneAt] = useState(props.goal.doneAt)
  const [list, setList] = useState(props.goal.list)
  const [tasks, setTasks] = useState([])
  const [showPage, setShowPage] = useState('Characteristics')
  const api = new Api()

  useEffect(() => {
    getGoalTasks()
  }, [])

  const getGoalTasks = async () => {
    const resp = await api.getTasksGoal(props.goal._id) 
    const results = await resp.json()
    const sortedTasks = sortProjectTasks(results).map( x => {
      const task = x
      task.id = task._id
      return task
    })
    setTasks(sortedTasks)
  }

  const onSave = async () => {
    await api.updateGoal(
      props.goal._id,
      {content, dueDate, note, goalId: props.goalId, list, doneAt}
    )
    props.onDescribe({goal: null, goal: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteGoal(props.goal._id)
    props.onDescribe({goal: null, goal: null, goal: null})
  }
  return (
    <div style={styles().wrapper}>
      <div style={styles().titleContainer}>
        <h3 style={styles().title}>Description</h3>
        <div onClick={onDelete} style={styles().deleteButton}>
          <img 
            className='deleteTask' 
            alt='delete' 
            src='/trash.png'
            width='15'
            height='15'/>
        </div>
      </div>

      <div style={styles().titleTaskContainer}>
        <input 
          type='text' 
          name='content'
          value={content} 
          onChange={(event) => setContent(event.target.value)} 
          style={styles().titleTaskText}
        />
        <ListButton
          item={props.goal}
          scale={1.5}
          active={true}
          onListChange={setList}
        />
      </div>

      <div style={styles().navbarContainer}>
        <div style={styles().narbarOption} onClick={() => setShowPage('Characteristics')}>Characteristics</div>
        <div style={styles().narbarOption} onClick={() => setShowPage('Habits')}>Habits</div>
      </div>


     <div style={{display: 'flex', flexDirection: 'row', height: '60%'}}>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
       <h4 style={styles().noteTitle}>
        Status
       </h4>
            <div style={styles().checkboxContainer}>
          Due 
          <input 
            type='date' 
            value={new Date(dueDate).toJSON().slice(0, 10)} 
            onChange={(event) => { if (event.target.value) setDueDate(new Date(event.target.value))}}
          />
        </div>
        
        <div>
            <div style={styles().checkboxContainer}>
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
            <div style={styles().checkboxContainer}>
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

      <div>
        <h4 style={styles().noteTitle}>
          Note
        </h4>
        <div style={styles().noteContainer}>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => setNote(event.target.value)} 
            style={styles().noteText}
          />
       </div>
      </div>

    </div>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <DragDropContext onDragEnd={() => {}}>
        <div style={styles().taskListTitle}>
          <h4 style={styles().noteTitle}>Tasks</h4>
          <h4 style={styles().noteTitle}>{tasks.filter(x => x.doneAt).length}/{tasks.length}</h4>
        </div>
        <div style={styles().taskList}>
        <TaskList
          droppableId={"tasks"}
          items={tasks}
          onUpdate={getGoalTasks}
          onDescribe={() => {}}
          scale={1}
          projectTask={true}
          
        />
        </div>
        </DragDropContext>
        <AddTask goalId={props.goal._id} onUpdate={getGoalTasks} list={props.goal.list}/>
      </div>
    </div>

      <div style={styles().footer}>
        <button style={styles().buttonCancel} onClick={() => props.onDescribe({
          task: null, project: null, goal: null
        })}>
          Cancel
        </button>
        <button style={styles().buttonSave} onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 700 * getDimRatio().X,
    height: 550* getDimRatio().Y,
    margin: 30,
    background: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    boxShadow: '2px 4px grey',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 25 * getDimRatio().X,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  buttonBack: {
    height: 20 * getDimRatio().X,
    width: 20 * getDimRatio().X,
  },
  navbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  narbarOption: {
    marginLeft: 10,
    color: 'blue',
    cursor: 'pointer',
  },
  titleTaskContainer: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: 100 * getDimRatio().X,
    padding: 3,
    margin: 10,
  },
  titleTaskText: {
    background: 'transparent',
    fontSize: 20 * getDimRatio().X,
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
    marginLeft: 10* getDimRatio().X,
    marginRight: 10 * getDimRatio().X,
    color: '#32A3BC',
  },
  noteText: {
    width: '90%',
    height: 120 * getDimRatio().Y,
  },
  noteContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  checkboxContainer: {
    marginLeft: 10,
    fontSize: 13 * getDimRatio().X,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    marginLeft: 10,
    marginTop: 10,
    display: 'flex',
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
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonSave: {
    background: '#32A3BC',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
})

export default GoalDescription


