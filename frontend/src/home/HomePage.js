import React, { useState, useEffect } from 'react'

import GoalSection from './GoalSection'
import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from '../components/TaskDescription'
import ProjectDescription from '../components/ProjectDescription'
import GoalDescription from '../components/GoalDescription'
import TopNavigation from '../Navigation'
import { getDimScreen, getDimRatio } from '../DynamicSizing'
import './HomePage.css'
import Api from '../Api'


function HomePage() {
  const [describeElem, setDescribeElem] = useState({task: null, project: null, goal: null})
  const [isWeekly, setIsWeekly] = useState(false)
  const [allGoals, setAllGoals] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [name, setName] = useState('')
  const api = new Api()
 
  useEffect(() => {
    getData() 
  }, [])
  
  const getData = async () => {
    const respGoals = await api.getGoals()
    const resultGoals = await respGoals.json()
    const respProjects = await api.getProjects()
    const resultProjects = await respProjects.json()
    const respName = await api.getName()
    const resultName = await respName.json()
    setAllGoals(resultGoals)
    setAllProjects(resultProjects)
    setName(resultName[0].name)
  }


  return (
    <div className='HomePage' style={styles().HomePage}>
      <TopNavigation />
      <div style={styles().titleContainer}>
        <div style={styles().title}>
          Let's do it{name && ', ' + name}!
        </div>
        <div style={{display: 'flex',}}>
          <div style={styles().weeklyToogle}>
            Show weekly
          </div> 
          <input 
            type='checkbox'
            checked={isWeekly}
            onChange={() => {setIsWeekly(!isWeekly)}}
          />
        </div>
      </div>
      
      <div style={styles().mainCantainer}>
        
        {!isWeekly && (
          <div style={styles().toDoContainer}>
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
            {describeElem.project && !describeElem.goal && (
              <ProjectDescription
                onDescribe={(value) => {
                  setDescribeElem(value)
                  getData()
                }}
                project={describeElem.project}
                goals={allGoals}
              />
            )}
            {describeElem.goal && !describeElem.project && (
              <GoalDescription
                onDescribe={(value) => {
                  setDescribeElem(value)
                  getData()
                }}
                goal={describeElem.goal}
              />
            )}
          </div>
        )}
        {isWeekly && (
          <WeeklyTaskList 
            task={describeElem.task} 
            onDescribe={(value) => {
              setDescribeElem(value)
              getData()
            }}
            projects={allProjects}
            goals={allGoals}
          />
        )}
        {describeElem.task && (
          <TaskDescription
            onDescribe={(value) => {
              setDescribeElem(value)
            }}
            task={describeElem.task}
            projects={allProjects}
            goals={allGoals}
          />
        )}
      </div>
    </div>
  )

}

const styles = () => ({
  HomePage: {
    background: 'rgba(196, 196, 196, 0.21)',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    height: getDimScreen().Y,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 50,
  },
  title: {
    display: 'flex',
    marginLeft: 20,
    fontSize: 40 * getDimRatio().X,
  },
  weeklyToogle: {
    fontSize: 14 * getDimRatio().X
  },
  mainCantainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  toDoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export default HomePage
