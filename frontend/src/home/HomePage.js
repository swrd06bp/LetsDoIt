import React, { useState, useEffect } from 'react'

import GoalSection from './GoalSection'
import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from '../components/TaskDescription'
import ProjectDescription from '../components/ProjectDescription'
import './HomePage.css'
import Api from '../Api'


function HomePage() {
  const [describeElem, setDescribeElem] = useState({task: null, project: null, goal: null})
  const [isWeekly, setIsWeekly] = useState(false)
  const [allGoals, setAllGoals] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const api = new Api()
 
  useEffect(() => {
    getData() 
  }, [])
  
  const getData = async () => {
    const respGoals = await api.getGoals()
    const resultGoals = await respGoals.json()
    const respProjects = await api.getProjects()
    const resultProjects = await respProjects.json()
    setAllGoals(resultGoals)
    setAllProjects(resultProjects)
  }

  return (
    <div className='HomePage' style={{height: '100%', width: '100%'}}>
      Show weekly <input type='checkbox' checked={isWeekly} onChange={() => {setIsWeekly(!isWeekly)}}/>
      <div style={{display: 'flex', flexDirection: 'row'}}>
      {!isWeekly && (
        <div style={{display: 'flex', flexDirection: 'row'}}>
        <GoalSection 
          goals={allGoals}
          projects={allProjects}
          onUpdate={getData}
          project={describeElem.project}
          goal={describeElem.goal}
          onDescribe={setDescribeElem}
        />
        {!describeElem.project && !describeElem.goal && (
          <TodayTaskList
            task={describeElem.task}
            onDescribe={setDescribeElem}
            projects={allProjects}
            goals={allGoals}
          />
        )}
        </div>
      )}
      {isWeekly && (
        <WeeklyTaskList 
          task={describeElem.task} 
          onDescribe={setDescribeElem}
          projects={allProjects}
          goals={allGoals}
        />
      )}
      {describeElem.task && (
        <TaskDescription
          onDescribe={setDescribeElem}
          task={describeElem.task}
          projects={allProjects}
          goals={allGoals}
        />
      )}
      {describeElem.project && (
        <ProjectDescription
          onDescribe={(value) => {
            setDescribeElem(value)
            getData()
          }}
          project={describeElem.project}
          goals={allGoals}
        />
      )}
      </div>
    </div>
  )

}

export default HomePage
