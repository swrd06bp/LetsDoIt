import React, { useState, useEffect, useReducer } from 'react'
import 'react-dropdown/style.css'
import { DragDropContext } from 'react-beautiful-dnd'

import ListHabit from '../../components/AddGoal/ListHabit'
import AddHabit from '../../components/AddGoal/AddHabit' 
import AddTask from '../../components/AddTask'
import TaskList from '../../components/TaskList'
import DeleteButton from '../../components/DeleteButton'
import ListButton from '../../components/ListButton'
import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function GoalDescription (props) {
  const [update, forceUpdate] = useReducer(x => x + 1, 0)
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
    props.onDescribe({task: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteGoal(props.goal._id)
    props.onDescribe({task: null, project: null, goal: null})
  }
  return (
    <div style={styles().wrapper}>
      <div style={styles().titleContainer}>
        <h3 style={styles().title}>Description</h3>
        <DeleteButton confirm={true} width='15' height='15' onDelete={onDelete} />
      </div>

      <div style={styles().navbarContainer}>
        <div 
          style={showPage === 'Characteristics' ? styles().narbarOptionActive : styles().narbarOption}
          onClick={() => setShowPage('Characteristics')}
        >
          Characteristics
        </div>
        <div 
          style={showPage === 'Habits' ? styles().narbarOptionActive : styles().narbarOption}
          onClick={() => setShowPage('Habits')}
        >
          Habits
        </div>
      </div>
    {showPage === 'Characteristics' && ( 
      <div>
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


      <div style={{display: 'flex', flexDirection: 'row', height: '60%'}}>
        <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
         <div style={styles().noteTitle}>
          Status
         </div>
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
          <div style={styles().noteTitle}>
            Note
          </div>
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
            <div style={styles().noteTitle}>Tasks</div>
            <div style={styles().noteTitle}>{tasks.filter(x => x.doneAt).length}/{tasks.length}</div>
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
        <div 
          style={styles().buttonCancel} 
          onClick={() => props.onDescribe({
            task: null, project: null, goal: null
          })}
          onMouseOver={(event) => {
            event.target.style.background = '#F5A9A9'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#F51111'
          }}
        >
          Cancel
        </div>
        <div
          style={styles().buttonSave}
          onClick={onSave}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
        >
          Save
        </div>
      </div>
    </div>
    )}
    {showPage === 'Habits' && (
      <div style={styles().habitsWrapper}>
        <AddHabit goalId={props.goal._id} getAllHabits={forceUpdate} />
        <ListHabit goalId={props.goal._id} update={update} />
      </div>
    )} 
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
  narbarOptionActive: {
    background: 'lightblue',
    marginLeft: 10,
    color: 'blue',
    cursor: 'pointer',
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
    fontSize: 20 * getDimRatio().X,
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
  buttonCancel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F51111',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatio().X,
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonSave: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    background: '#32A3BC',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatio().X,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  habitsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default GoalDescription


