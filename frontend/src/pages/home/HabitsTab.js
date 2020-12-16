import React, { useEffect, useState, useReducer } from 'react'
import Modal from 'react-modal'

import HabitProgress from './GoalProgress'
import ListHabit from '../../components/AddGoal/ListHabit'
import AddHabit from '../../components/AddGoal/AddHabit' 
import BehaviorForm from '../../components/AddGoal/BehaviorForm'
import { getDimRatio } from '../../app/DynamicSizing'


function HabitsTab (props) {
  const [showModal, setShowModal] = useState(false)
  const [chosenHabit, setChosenHabit] = useState(null)
  
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  return (
    <div style={styles().habitsWrapper}>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={styles()}
        contentLabel="Example Modal"
      >
        {showModal && ( 
          <div style={styles().modalContainer}>
            <BehaviorForm goalId={props.goal._id}/>
          </div>
        )}
      </Modal>
      <div
        style={styles().button}
        onClick={() => setShowModal(true)}
        onMouseOver={(event) => {
          event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          event.target.style.background = '#32A3BC'
        }}
      >
      Edit habits 
      </div>
      <ListHabit
        isClickable={true}
        onChooseHabit={setChosenHabit}
        goalId={props.goal._id} 
      />
      {chosenHabit && (
        <HabitProgress habit={chosenHabit} />
      )}
    </div>
  )
}

const styles = () => ({
  habitsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  modalContainer: {
    display: 'flex',
    width: 1300 * getDimRatio().X,
    height: 1000 * getDimRatio().Y,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'lightblue',
    cursor: 'pointer',
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    width: 100,
    fontWeight: 'bold',
    marginBottom: 20 * getDimRatio().Y,
  },
})

export default HabitsTab
