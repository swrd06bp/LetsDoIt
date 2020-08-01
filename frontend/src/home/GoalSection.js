import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import Goal from '../components/Goal'
import Project from '../components/Project'
import AddGoal from '../components/AddGoal'
import AddProject from '../components/AddProject'
import Api from '../Api'


function GoalSection (props) {
  const [goals, setGoals] = useState([])
  const [projects, setProjects] = useState([])
  const [modalOpen, setModalOpen] = React.useState(null)
  const api = new Api()

  useEffect(() => {
    Modal.setAppElement('body')
    getData() 
  }, [])

  const getData = async () => {
    const respGoals = await api.getGoals()
    const resultGoals = await respGoals.json()
    const respProjects = await api.getProjects()
    const resultProjects = await respProjects.json()
    setGoals(resultGoals)
    setProjects(resultProjects)
    setModalOpen(null)
  }

  return (
    <div>
      <Modal
        isOpen={modalOpen ? true : false}
        onRequestClose={() => {setModalOpen(null)}}
        style={customStyles}
        contentLabel="Example Modal"
      >
        { modalOpen === 'goals' && (
          <AddGoal onUpdate={getData}/>
        )}
        { modalOpen === 'projects' && (
          <AddProject onUpdate={getData}/>
        )}
      </Modal>
    <div style={{width: 250}}>
      <div onClick={() => setModalOpen('goals')}>
        <h3>Goals +</h3>
      </div>
      {goals.map((item) => {
        return (
          <Goal key={item._id} item={item} onUpdate={getData} />  
        )
      })}
      <div onClick={() => {setModalOpen('projects')}}>
        <h3>Projects +</h3>
      </div>
      {projects.map((item) => {
        return (
          <Project key={item._id} item={item} onUpdate={getData} />  
        )
      })}
    </div>
    </div>
  )

}


const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default GoalSection
