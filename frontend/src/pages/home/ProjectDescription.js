import React, { useState, useEffect } from 'react'

import CharacteristicsTab from './CharacteristicTab'
import Api from '../../app/Api'
import DeleteButton from '../../components/DeleteButton'
import { getDimScreen, getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function ProjectDescription (props) {
  const [tasks, setTasks] = useState([])
  const api = new Api()

  useEffect(() => {
    getProjectTasks()
  }, [])

  useEffect(() => {
    getProjectTasks() 
  }, [props.describeElem.task])

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


  const onSave = async ({content, note, dueDate, goalId, list, doneAt, projectId}) => {
    await api.updateProject(
      props.project._id,
      {content, dueDate, note, goalId, list, doneAt}
    )
    props.onDescribe({project: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteProject(props.project._id)
    props.onDescribe({project: null, project: null, goal: null})
  }
  return (
    <div style={styles().wrapper}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <div 
          onClick={() => props.onDescribe({task: null, project: null, goal: null})}
          style={styles().containerToDo}
        >
          <img style={styles().imgToDo} src={'./left-arrow.png'} alt='' />
          <div style={styles().title}>Description</div>
        </div>
        <DeleteButton confirm={true} width='15' height='15' onDelete={onDelete} />
      </div>

      <CharacteristicsTab
        tasks={tasks}
        setTasks={setTasks}
        goals={props.goals}
        elem={props.project}
        getTasks={getProjectTasks}
        onSave={onSave} 
        onDescribe={props.onDescribe}
      />

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
    justifyContent: 'center',
    boxShadow: '2px 4px grey',
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
  imgToDo: {
    height: 25,
    width: 25,
  },
  containerToDo: {
    marginLeft: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
})

export default ProjectDescription
