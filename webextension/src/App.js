
import React, { useState, useEffect } from 'react'

import LoginPage from './pages/login/LoginPage'
import HappinessCreatePage from './pages/happiness/Create'
import TodayTaskList from './pages/Home/TodayTaskList'
import TaskDescription from './pages/Home/TaskDescription'
import Api from './app/Api'


function App() {
  const [describeElem, setDescribeElem] = useState({task: null, project: null, goal: null})
  const [showPage, setShowPage] = useState('Login')
  const [allGoals, setAllGoals] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const api = new Api()

  useEffect(() => {
    const checkLogin = async () => {
      const isLogin = await api.status()
      if (isLogin) setShowPage('Today')
    }

    const getData = async () => {
      const respGoals = await api.getGoals()
      const resultGoals = await respGoals.json()
      const respProjects = await api.getProjects()
      const resultProjects = await respProjects.json()

      setAllGoals(resultGoals)
      setAllProjects(resultProjects)
      setIsLoading(false)
    }

    getData()
    checkLogin()
  }, [])



  return (
    <div className="App">
      {showPage === 'Login' && !isLoading && (
        <LoginPage 
          onLogin={() => setShowPage('Today')}
         />
      )}
      {showPage === 'Today' && !isLoading && !describeElem.task && ( 
         <div>
         <div>
         <div
           style={{cursor: 'pointer', background: 'lightgrey', radius: 10, display: 'flex'}} 
           onClick={() => {
            api.logout()
            setShowPage('Login')
         }}>Logout</div>
         </div>
         <TodayTaskList 
            task={describeElem.task}
            onDescribe={setDescribeElem}
            goals={allGoals}
            projects={allProjects}
            onHappinessSubmit={() => setShowPage('Happiness')}
         />
         </div>
      )}
      {describeElem.task && !isLoading && (
        <TaskDescription 
          describeElem={describeElem}
          projects={allProjects}
          goals={allGoals}
          onDescribe={setDescribeElem}    
        />
      )}
      {showPage === 'Happiness' && !isLoading && (
        <HappinessCreatePage 
           onSubmit={() => setShowPage('Today')}
         />
      )}
    </div>
  )
}

export default App;
