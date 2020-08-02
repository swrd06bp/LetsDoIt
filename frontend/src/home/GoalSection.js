import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import Goal from '../components/Goal'
import Project from '../components/Project'
import AddGoal from '../components/AddGoal'
import AddProject from '../components/AddProject'
import Api from '../Api'


function GoalSection (props) {
  const [modalOpen, setModalOpen] = React.useState(null)

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const getData = async () => {
    props.onUpdate()
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
      {props.goals.map((item) => {
        return (
          <Goal
            key={item._id}
            item={item}
            goal={props.goal}
            onUpdate={getData}
            onDescribe={props.onDescribe}
          />  
        )
      })}
      <div onClick={() => {setModalOpen('projects')}}>
        <h3>Projects +</h3>
      </div>
      {props.projects.map((item) => {
        return (
          <Project
            key={item._id}
            item={item}
            project={props.project}
            onUpdate={getData}
            onDescribe={props.onDescribe}
          />  
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
