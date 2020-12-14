import React, { useState, useEffect, useReducer } from 'react'
import 'react-dropdown/style.css'
import { DragDropContext } from 'react-beautiful-dnd'

import GoalProgress from './GoalProgress'
import ListHabit from '../../components/AddGoal/ListHabit'
import AddHabit from '../../components/AddGoal/AddHabit' 
import CharacteristicsTab from './CharacteristicTab'
import AddTask from '../../components/AddTask'
import TaskList from '../../components/TaskList'
import DeleteButton from '../../components/DeleteButton'
import ListButton from '../../components/ListButton'
import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function GoalDescription (props) {
  const [update, forceUpdate] = useReducer(x => x + 1, 0)
  const [tasks, setTasks] = useState([])
  const [showPage, setShowPage] = useState('Characteristics')
  const api = new Api()

  useEffect(() => {
    getGoalTasks()
  }, [])
  
  useEffect(() => {
    getGoalTasks() 
  }, [props.describeElem.task])

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

  const onSave = async ({content, dueDate, note, list, doneAt}) => {
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
        <div
          onClick={() => props.onDescribe({task: null, project: null, goal: null})}
          style={styles().containerToDo}
        >
          <img style={styles().imgToDo} src={'./left-arrow.png'} alt='' />
          <div style={styles().title}>Description</div>
        </div>
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
        <div 
          style={showPage === 'Progress' ? styles().narbarOptionActive : styles().narbarOption}
          onClick={() => setShowPage('Progress')}
        >
          Progress
        </div>
      </div>
    {showPage === 'Characteristics' && ( 
      <CharacteristicsTab
        isGoal={true}
        tasks={tasks}
        setTasks={setTasks}
        elem={props.goal}
        getTasks={getGoalTasks}
        onSave={onSave} 
        onDescribe={props.onDescribe}
      />
    )}
    {showPage === 'Habits' && (
      <div style={styles().habitsWrapper}>
        <AddHabit goalId={props.goal._id} getAllHabits={forceUpdate} />
        <ListHabit goalId={props.goal._id} update={update} />
      </div>
    )} 

    {showPage === 'Progress' && (
      <div style={styles().habitsWrapper}>
        <GoalProgress goalId={props.goal._id} />
      </div>
    )} 
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 900 * getDimRatio().X,
    height: 650* getDimRatio().Y,
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
    paddingLeft: 4,
    paddingRight: 4,
    color: 'blue',
    cursor: 'pointer',
    borderRadius: 10,
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
  imgToDo: {
    height: 25,
    width: 25,
  },
  containerToDo: {
    cursor: 'pointer',
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
  },
})

export default GoalDescription


