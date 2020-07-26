import React, { useState } from 'react'

import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from '../components/TaskDescription'
import './HomePage.css'


function HomePage() {
  const [task, setTask] = useState(null)
 

  return (
    <div className='HomePage'>
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <WeeklyTaskList task={task} onDescribe={setTask}/>
      <TodayTaskList task={task} onDescribe={setTask}/>
      {task && (<TaskDescription onDescribe={setTask} task={task} />)}
      </div>
    </div>
  )

}

export default HomePage
