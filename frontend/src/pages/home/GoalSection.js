import React, { useState, useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import Modal from 'react-modal'

import Goal from '../../components/Goal'
import Project from '../../components/Project'
import AddGoal from '../../components/AddGoal'
import AddProject from '../../components/AddProject'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'





function GoalSection (props) {
  const [modalOpen, setModalOpen] = React.useState(null)
  const [showCompletedProjects, setShowCompletedProjects] = useState(false)
  const [showCompletedGoals, setShowCompletedGoals] = useState(false)
  const mixpanel = useMixpanel()

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
        onRequestClose={getData}
        style={styles()}
        contentLabel="Example Modal"
      >
        { modalOpen === 'goals' && (
          <AddGoal onUpdate={getData} />
        )}
        { modalOpen === 'projects' && (
          <AddProject onUpdate={getData}/>
        )}
      </Modal>
    <div style={styles().wrapper}>
      <div style={styles().toolContainer}>
        <h3 style={styles().titleSection}>Goals</h3>
        <div 
          onClick={() => {
            if (mixpanel.config.token)
              mixpanel.track('Goal Section Page - Add a goal')
            setModalOpen('goals')
          }}
          style={styles().toolButton}
          title={'Set a new goal for yourself'}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
        >
          +
        </div>
      </div>
      <div style={styles().goalSection}>
      {props.goals.map((item) => {
        if ((item.doneAt === null) === (!showCompletedGoals))
          return (
            <Goal
              key={item._id}
              item={item}
              goal={props.goal}
              onUpdate={getData}
              onDescribe={props.onDescribe}
              completed={showCompletedGoals}
              type={'day'}
            />  
          )
        else
          return (null)
      })}
      </div>
      <div 
        style={styles().showCompletedText}
        onClick={() => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Show completed/pending goals', {showCompleted: !showCompletedGoals})
          setShowCompletedGoals(!showCompletedGoals)
        }}
      >{showCompletedGoals ? 'Show pending' : 'Show completed'}</div>
      <div style={styles().toolContainer}>
        <h3 style={styles().titleSection}>Projects</h3>
        <div 
          onClick={() => {
            if (mixpanel.config.token)
              mixpanel.track('Goal Section Page - Add a project')
            setModalOpen('projects')
          }}
          style={styles().toolButton}
          title={'Plan a new project'}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
        >
          +
        </div>
      </div>
      <div style={styles().projectSection}>
        {props.projects.map((item) => {
        if ((item.doneAt === null) === (!showCompletedProjects))
          return (
            <Project
              key={item._id}
              item={item}
              project={props.project}
              onUpdate={getData}
              onDescribe={props.onDescribe}
              type={'day'}
            />  
          )
          else
            return null
        })}
      </div>
      <div 
        style={styles().showCompletedText}
        onClick={() => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Show completed/pending projects', {showCompleted: !showCompletedProjects})
          setShowCompletedProjects(!showCompletedProjects)
        }}
      >{showCompletedProjects ? 'Show pending' : 'Show completed'}</div>
    </div>
    </div>
  )

}


const styles = () => ({
  wrapper: {
    background: 'white',
    width: 450 * getDimRatio().X,
    display: 'flex',
    flexDirection: 'column',
    height: 650* getDimRatio().Y,
    borderRadius: 20,
    margin: 30,
    boxShadow: '2px 4px grey',
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    borderRadius: 20,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  toolContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  showCompletedText: {
    fontSize: 13 * getDimRatioText().X,
    textAlign: 'center',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  toolButton: {
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16 * getDimRatio().X,
    color: 'white',
    borderStyle: 'solid',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    fontSize: 28 * getDimRatioText().X,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  goalSection: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '60%',
    marginRight: 10,
    marginLeft: 10,
    overflow: 'scroll',
  },
  projectSection: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '30%',
    marginRight: 10,
    marginLeft: 10,
    overflow: 'scroll',
  },
})

export default GoalSection
