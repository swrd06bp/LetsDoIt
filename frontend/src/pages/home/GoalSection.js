import React, { useState, useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import Modal from 'react-modal'

import Goal from '../../components/Goal'
import Project from '../../components/Project'
import AddGoal from '../../components/AddGoal'
import AddProject from '../../components/AddProject'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'


function ToolSection (props) {

  const onChangeCompleted = () => {
    const newShowCompleted = !props.showCompleted
    props.onChange(newShowCompleted)
  }

  return (
    <div style={styles().toolContainer}>
      <div 
        onClick={onChangeCompleted}
        style={styles().toolButton}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >
       {props.showCompleted ? 'Show pending' : 'Show completed'}
      </div>
      <div 
        onClick={props.onNew}
        style={styles().toolButton}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >
        New
      </div>
    </div>
  )
}



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
      <h3 style={styles().titleSection}>Goals</h3>
      <ToolSection 
        showCompleted={showCompletedGoals}
        onChange={(flag) => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Show completed/pending goal', {showCompleted: flag})
          setShowCompletedGoals(flag)
        }}
        onNew={() => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Add a goal')
          setModalOpen('goals')
        }}
      />
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
            />  
          )
        else
          return (null)
      })}
      </div>
      <h3 style={styles().titleSection}>Projects</h3>
      <ToolSection
        showCompleted={showCompletedProjects}
        onChange={(flag) => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Show completed/pending projects', {showCompleted: flag})
          setShowCompletedProjects(flag)
        }}
        onNew={() => {
          if (mixpanel.config.token)
            mixpanel.track('Goal Section Page - Add a project')
          setModalOpen('projects')
        }} />
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
            />  
          )
          else
            return null
        })}
      </div>
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
  },
  titleSection: {
    fontSize: 28 * getDimRatioText().X,
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
})

export default GoalSection
