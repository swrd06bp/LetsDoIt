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
        style={styles}
        contentLabel="Example Modal"
      >
        { modalOpen === 'goals' && (
          <AddGoal onUpdate={getData}/>
        )}
        { modalOpen === 'projects' && (
          <AddProject onUpdate={getData}/>
        )}
      </Modal>
    <div style={styles.wrapper}>
      <div onClick={() => setModalOpen('goals')}>
        <h3 style={styles.titleSection}>Goals +</h3>
      </div>
      <div style={styles.goalSection}>
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
      </div>
      <div onClick={() => {setModalOpen('projects')}}>
        <h3 style={styles.titleSection}>Projects +</h3>
      </div>
      <div style={styles.projectSection}>
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
    </div>
  )

}


const styles = {
  wrapper: {
    background: 'white',
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    height: '50%',
    borderRadius: 20,
    margin: 30,
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  titleSection: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  goalSection: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '30%',
    marginRight: 10,
    marginLeft: 10,
    overflow: 'scroll',
  },
  projectSection: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '50%',
    marginRight: 10,
    marginLeft: 10,
    overflow: 'scroll',
  },
}

export default GoalSection
