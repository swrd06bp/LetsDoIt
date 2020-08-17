import React, { useState, useEffect } from 'react'

import GoalSection from './GoalSection'
import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from '../components/TaskDescription'
import ProjectDescription from '../components/ProjectDescription'
import TopNavigation from '../Navigation'
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
    <div className='HomePage' style={styles.HomePage}>
      <TopNavigation />
      <div style={styles.titleContainer}>
        <div style={styles.title}>
          <h1>Let's do it{name && ', ' + name}!</h1>
        </div>
        <div>
          Show weekly 
          <input 
            type='checkbox'
            checked={isWeekly}
            onChange={() => {setIsWeekly(!isWeekly)}}
          />
        </div>
      </div>
      
      <div style={styles.mainCantainer}>
        
        {!isWeekly && (
          <div style={styles.toDoContainer}>
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

const styles = {
  HomePage: {
    background: 'rgba(196, 196, 196, 0.21)',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    height: window.screen.availHeight
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
}

export default HomePage
