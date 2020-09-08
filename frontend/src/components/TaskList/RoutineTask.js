import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import GoalShape from '../GoalShape'
import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import {tomorrowDate} from '../../app/utils'


function FailureScreen (props) {
  const [note, setNote] = useState(null)
  const [postponeUntil, setPostponeUntil] = useState(null)
  const api = new Api()

  const onFailure = async () => {
    await api.insertRoutine({habitId: props.item.id, note, postponeUntil, isDone: false}) 
    await props.onUpdate()
    props.onClose()
  }
  return (
      <Modal
        isOpen={props.showModal}
        onRequestClose={() => props.onClose()}
        style={styles()}
      >
      <div style={styles().failureWrapper}>
        <div>
          <div>Note</div>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => setNote(event.target.value)} 
            style={styles().noteText}
          />


        
        </div>
        <div>
        <div>Postpone until:</div>
        <input type='date' onChange={(event) => setPostponeUntil(new Date(event.target.value))}/>
        </div>
        <div style={styles().button} onClick={() => onFailure()}>Done</div>
      </div>
    </Modal>
  )

}

function RoutineTask (props) {
  const [showModal, setShowModal] = useState(false)
  const api = new Api()

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const onAcheive = async () => {
    await api.insertRoutine({
      habitId: props.item.id,
      note: null,
      postponeUntil: null,
      isDone: true
    }) 
    props.onUpdate()
  }

  const filterGoal = props.goals.filter(x => (x._id === props.item.goalId))

  const colorCode = filterGoal && filterGoal.length ? filterGoal[0].colorCode : null
  

  return (
    <div
      style={styles().wrapper}
    >
      <FailureScreen 
        item={props.item}
        showModal={showModal}  
        onClose={() => setShowModal(false)}
        onUpdate={props.onUpdate}
      />
      <div style={styles().frontContainer}>
        <GoalShape colorCode={colorCode}/>
        <div style={styles().titleContainer}>{props.item.content}</div>
      </div>
      <div style={styles().buttonContainer}>
        <div style={styles().buttonText} onClick={onAcheive}>done</div>
        <div style={styles().buttonText} onClick={() => setShowModal(true)}>not today</div>
      </div>
    </div>
  )
  
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginLeft: 5,
  },
  frontContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: 5,
    width: 75,
    background: 'lightgrey',
    borderRadius: 20,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    borderRadius: 20,
    transform: 'translate(-50%, -50%)'
  },
  failureWrapper: {
    height: 300,
    width: 200,
    
  },
  button: {
    cursor: 'pointer'
  },
})

export default RoutineTask


