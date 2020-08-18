import React, { useState } from 'react'

import Api from '../../Api.js'


function SmarterForm (props) {
  const [goalInput, setGoalInput] = useState('')
  const [goalDueDate, setGoalDueDate] = useState(new Date())

  const onSubmit = async (e) => {
    e.preventDefault();
    const api = new Api() 
    if (goalInput) {
      await api.insertGoal({
        content: goalInput,
        list: 'Work',
        dueDate: new Date().toJSON(),
      })
    }
    setGoalInput('')
    props.onNext()
  }

  return (
    <div style={styles.wrapper}>
    <img style={styles.image} src='/goal_settings.png' alt=''/>
    <div>
      <div style={styles.introText}>
        Research showed that you are more likely to get what you want by setting yourself smarter goals.
      </div>
      <div style={styles.pointContainer}>
        <div>S</div><div>pecific:</div><div>The more specific you are about your goals, the better and more able you’ll be to accomplish them no matter what method you use.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>M</div><div>iningful:</div><div>When your goals have a deep enough meaning to you, you’ll do whatever it takes to achieve them.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>A</div><div>chievable:</div><div>There are not unrealistic goals, only unrealistic deadlines.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>R</div><div>elevant:</div><div>Your goals should be inline with and in harmony with what you actually want out of life; they should match up with your core values.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>T</div><div>ime-bound:</div><div>Your goals should be inline with and in harmony with what you actually want out of life; they should match up with your core values.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>E</div><div>valuate:</div><div>By evaluating your goals every single day, you’ll be much more likely to achieve them.</div>
      </div>
      <div style={styles.pointContainer}>
        <div>R</div><div>eajust:</div><div>Constantly reajusting your approach to acheive your goals increases massively your chances of success.</div>
      </div>


    </div>
    <form style={styles.formContainer} onSubmit={onSubmit}>
      <label>
        Goal: 
        <input 
          type="text"
          name="goalInput"
          placeholder="Set a smarter goal"
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />
      </label>
      <label>
          Deadline: <input 
            type="date"
            name="goalDueDate"
            value={goalDueDate.toJSON().slice(0, 10)}
            onChange={(event) => setGoalDueDate(new Date(event.target.value))}
          />
      </label>
      <input type="submit" value="Add" />
    </form>
    </div>
  
  )
}


const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    
  },
  introText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    margin: 20,
  },
  formContainer: {
    marginTop: 25,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  pointContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}


export default SmarterForm
