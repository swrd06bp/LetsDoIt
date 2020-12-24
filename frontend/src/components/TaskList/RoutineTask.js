import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import GoalShape from '../Goal/GoalShape'
import Api from '../../app/Api'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import {tomorrowDate} from '../../app/utils'


function FailureScreen (props) {
  const [note, setNote] = useState(null)
  const [postponeUntil, setPostponeUntil] = useState(new Date().setDate(new Date().getDate() + 1))
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
          <div style={styles().failureTitle}>Not today?</div>
          <div style={styles().failureNoteTitle}>Note</div>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => setNote(event.target.value)} 
            style={styles().failureNoteText}
          />
        </div>
        <div>
        <div style={styles().failureNoteTitle}>Postpone until:</div>
        <input 
          type='date'
          onChange={(event) => setPostponeUntil(new Date(event.target.value))}
          value={new Date(postponeUntil).toJSON().slice(0, 10)} 
        />
        </div>
        <div style={styles().failureButtonContainer}>
          <div 
            style={styles().failureButton}
            onClick={() => onFailure()}
            onMouseOver={(event) => {
              event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#32A3BC'
            }}
          >Done</div>
        </div>
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
        <div 
          style={styles().buttonText} 
          onClick={onAcheive}
          onMouseOver={(event) => {
            event.target.style.background = '#33cc33'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#009933'
          }}
        >Done</div>
        <div
          style={styles().buttonText} 
          onClick={() => setShowModal(true)}
          onMouseOver={(event) => {
            event.target.style.background = '#33cc33'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#009933'
          }}
        >Not today</div>
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
    fontSize: 18 * getDimRatioText().X,
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
    width: 85 * getDimRatio().X,
    background: '#009933',
    color: 'white',
    borderRadius: 20,
    fontSize: 18 * getDimRatioText().X,
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
    width: 200 * getDimRatio().X,
    height: 400 * getDimRatio().Y,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',

    
  },
  failureTitle: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  failureNoteTitle: {
    marginLeft: 10,
    color: '#32A3BC',
    marginRight: 10,
  },
  failureNoteText: {
    height: 150* getDimRatio().Y,
    width: 150 * getDimRatio().X
  },
  failureButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  failureButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#32A3BC',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderWidth: 0,
    borderRadius: 20,
  },
})

export default RoutineTask


