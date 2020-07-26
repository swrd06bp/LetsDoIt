import React from 'react'

import AddTask from '../components/AddTask.js'
import TodayTaskList from '../components/TodayTaskList'
import './HomePage.css'

import Api from '../Api'

function HomePage() {

  return (
    <div className='HomePage'>
      <TodayTaskList />
      <AddTask />
    </div>
  )

}

export default HomePage
