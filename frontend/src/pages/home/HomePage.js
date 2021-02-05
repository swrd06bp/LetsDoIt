import React, { useState, useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import Switch from "react-switch"

import GoalSection from './GoalSection'
import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import TaskDescription from './TaskDescription'
import ProjectDescription from './ProjectDescription'
import GoalDescription from './GoalDescription'
import HabitDescription from './HabitDescription'
import TopNavigation from '../../app/Navigation'
import { sortProjects } from '../../app/utils'
import { getDimScreen, getDimRatio } from '../../app/DynamicSizing'
import './HomePage.css'
import Api from '../../app/Api'
import { createSocketConnection } from '../../app/socket'


function HomePage() {
  const [describeElem, setDescribeElem] = useState({task: null, project: null, goal: null, habit: null})
  const [isWeekly, setIsWeekly] = useState(false)
  const [allGoals, setAllGoals] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [name, setName] = useState('')
  const api = new Api()
  const mixpanel = useMixpanel()
 
  useEffect(() => {
    createSocketConnection()
    getData() 
  }, [])
  


  const getData = async () => {
    const respGoals = await api.getGoals()
    const resultGoals = await respGoals.json()
    const respProjects = await api.getProjects()
    const resultProjects = await respProjects.json()
    const respName = await api.getName()
    const resultName = await respName.json()
    setAllGoals(sortProjects(resultGoals))
    setAllProjects(sortProjects(resultProjects))
    if (resultName.length) {
      mixpanel.identify(resultName[0]._id)
      setName(resultName[0].name)
    }
  }


  return (
    <div className='HomePage' style={styles().HomePage}>
      <TopNavigation />
      <div style={styles().titleContainer}>
        <div style={styles().title}>
          Let's do it{name && ', ' + name}!
        </div>
        <div style={{display: 'flex',}}>
          <Switch 
            checked={isWeekly}
            onChange={() => {
              if (mixpanel.config.token)
                mixpanel.track('Home page - set weekly')
              setIsWeekly(!isWeekly)
            }}
            height={20}
            width={40}
          />
          <div style={styles().weeklyToogle}>
            Show weekly
          </div> 
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
              describeElem={describeElem}
              onDescribe={setDescribeElem}
            />
            {!describeElem.project && !describeElem.goal && !describeElem.habit && (
              <TodayTaskList
                task={describeElem.task}
                onDescribe={setDescribeElem}
                projects={allProjects}
                goals={allGoals}
              />
            )}
            {describeElem.project && !describeElem.goal && !describeElem.habit && (
              <ProjectDescription
                describeElem={describeElem}
                onDescribe={(value) => {
                  getData()
                  setDescribeElem(value)
                }}
                project={describeElem.project}
                goals={allGoals}
              />
            )}
            {describeElem.goal && !describeElem.project && !describeElem.habit && (
              <GoalDescription
                describeElem={describeElem}
                onDescribe={(value) => {
                  getData()
                  setDescribeElem(value)
                }}
                goal={describeElem.goal}
              />
            )}
            {describeElem.habit && !describeElem.project && describeElem.goal && (
              <HabitDescription
                describeElem={describeElem}
                onDescribe={(value) => {
                  getData()
                  setDescribeElem(value)
                }}
                habit={describeElem.habit}
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
            describeElem={describeElem}
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
    margin: 25,
  },
  title: {
    display: 'flex',
    marginLeft: 20,
    fontSize: 40 * getDimRatio().X,
  },
  weeklyToogle: {
    marginLeft: 5,
    fontSize: 17 * getDimRatio().X
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
