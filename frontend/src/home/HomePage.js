import React, { useState } from 'react'

import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from '../components/TaskDescription'
import './HomePage.css'


function HomePage() {
  const [task, setTask] = useState(null)
  const [isWeekly, setIsWeekly] = useState(false)
 

  return (
    <div className='HomePage'>
      Show weekly <input type='checkbox' checked={isWeekly} onChange={() => {setIsWeekly(!isWeekly)}}/>
      <div style={{display: 'flex', flexDirection: 'row'}}>
    {isWeekly && (<WeeklyTaskList task={task} onDescribe={setTask}/>)}
    {!isWeekly && ( <TodayTaskList task={task} onDescribe={setTask}/>)}
      {task && (<TaskDescription onDescribe={setTask} task={task} />)}
      </div>
    </div>
  )

}

export default HomePage
