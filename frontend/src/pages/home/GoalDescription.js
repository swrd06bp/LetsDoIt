import React, { useState, useEffect} from 'react'
import 'react-dropdown/style.css'
import { DragDropContext } from 'react-beautiful-dnd'

import HabitsTab from './HabitsTab'
import CharacteristicsTab from './CharacteristicTab'
import DeleteButton from '../../components/DeleteButton'
import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function GoalDescription (props) {
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
      <HabitsTab goal={props.goal} />
    )} 

    {showPage === 'Progress' && (
      <div style={styles().habitsWrapper}>
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


