import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'

function AddWeekGoal(props) {
  const [content, setContent] = useState(null)
  const api = new Api()
  
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  useEffect(() => {
    setContent(props.focusGoal ? props.focusGoal.content : '')
  }, [props.focusGoal])


  const onConfirm = async () => {
    if (content !== '') {
      const focus = {
        type: props.day ? 'day' : 'week',
        number: props.weekNumber,
        content,
      } 

      if (!props.focusGoal)
        await api.postFocus(focus)
      else 
        await api.putFocus(props.focusGoal._id, focus)
      
      props.onClose() 
    }
  }


  return (
    <Modal
      isOpen={props.modalOpen}
      onRequestClose={props.onClose}
      style={styles()}
      contentLabel="AddWeekGoal"
    >
      <div style={styles().addWeekGoalWrapper}>
        <div style={styles().titleAddWeekGoal}>
          {props.day ? 'What is your main focus today?' : 'What is the main goal for this week?'}
        </div>
        <input
          style={styles().inputAddWeekGoal}
          type='text'
          placeholder= 'I am going to acheive..'
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyUp={(event) => {
            if (event.keyCode === 13)
              onConfirm()
          }}
        />
        <div style={styles().choiceContainerAddWeekGoal}>
          <div 
            style={{
              ...styles().buttonDoneAddWeekGoal,
              cursor: content ? 'pointer' : 'not-allowed'
            }}
            onClick={onConfirm}
            onMouseOver={(event) => {
              if (content)
                event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              if(content)
                event.target.style.background = '#32A3BC'
            }}
          >
            { props.focusGoal ? 'Edit' : 'Done' }
          </div>
        </div>
      </div>
    </Modal>
  )
}

const styles = () => ({
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    borderRadius: 20,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  addWeekGoalWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    background: 'white',
    width: 500 * getDimRatio().X,
    height: 200 * getDimRatio().X,
  },
  titleAddWeekGoal: {
    fontSize: 25 * getDimRatio().X,
    fontWeight: 'bold',
  },
  inputAddWeekGoal: {
    fontSize: 18 * getDimRatio().X,
    marginTop: 20 * getDimRatio().X,
    width: 400 * getDimRatio().X,
  },
  choiceContainerAddWeekGoal: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonDoneAddWeekGoal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#32A3BC',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatio().X,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },

})

export default AddWeekGoal
