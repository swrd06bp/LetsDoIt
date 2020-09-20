import React, { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import ListButton from '../ListButton'
import Api from '../../app/Api.js'


function SmarterForm (props) {
  const [goalInput, setGoalInput] = useState('')
  const [goalList, setGoalList] = useState('Work')
  const [dateSelectedOption, setDateSelectedOption] = useState('In 5 years')
  const [goalDueDate, setGoalDueDate] = useState(new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDay()))

  const allDateOptions = [{
    value: new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDay()),
    label: 'In 5 years'
  },
    {
    value: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDay()),
      label: 'Next year'
    },
    {
      value: new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDay()),
      label: 'In 6 months'
    },
    {
      value: goalDueDate,
      label: 'Custom'
    }
  ]

  const onSubmit = async (e) => {
    e.preventDefault();
    if (goalInput) {
      const api = new Api() 
      if (goalInput) {
        const resp = await api.insertGoal({
          content: goalInput,
          list: goalList,
          dueDate: new Date().toJSON(),
        })
        const {goalId} = await resp.json()
        props.onNext(goalId.insertedId)
      }
      setGoalInput('')
    }
  }

  const onChooseOption = (option) => {
    setDateSelectedOption(option.label)
    setGoalDueDate(option.value)
  }


  return (
    <div style={styles.wrapper}>
    <img style={styles.image} src='/goal_settings.png' alt=''/>
    <div>
      <div style={styles.introText}>
        Research showed that you are more likely to get what you want by setting yourself smarter goals. Your goals should be:
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>S</div><div style={styles.restLetterPoint}>pecific:</div><div style={styles.definePoint}>The more specific you are about your goals, the better and more able you’ll be to accomplish them no matter what method you use.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>M</div><div style={styles.restLetterPoint}>iningful:</div><div style={styles.definePoint}>When your goals have a deep enough meaning to you, you’ll do whatever it takes to achieve them.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>A</div><div style={styles.restLetterPoint}>chievable:</div><div style={styles.definePoint}>There are no unrealistic goals, only unrealistic deadlines.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>R</div><div style={styles.restLetterPoint}>elevant:</div><div style={styles.definePoint}>Your goals should be inline with and in harmony with what you actually want out of life; they should match up with your core values.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>T</div><div style={styles.restLetterPoint}>ime&#8722;bound:</div><div style={styles.definePoint}>When your goals are time-bound, they’re measurable. Hold yourself accountable by measuring those goals on a daily, weekly, and monthly basis.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>E</div><div style={styles.restLetterPoint}>valuate:</div><div style={styles.definePoint}>By evaluating your goals every single day, you’ll be much more likely to achieve them.</div>
      </div>
      <div style={styles.pointContainer}>
        <div style={styles.firstLetterPoint}>R</div><div style={styles.restLetterPoint}>eajust:</div><div style={styles.definePoint}>Constantly reajusting your approach to acheive your goals increases massively your chances of success.</div>
      </div>


    </div>
    <form style={styles.formContainer} onSubmit={onSubmit}>
      <div style={styles.elemsContainer}>
      <label style={styles.labelContainer}>
       <div style={styles.labelTitles}>Goal:</div> 
        <input 
          style={styles.inputGoal}
          type="text"
          name="goalInput"
          placeholder="Set a positive goal.."
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />
        <ListButton active={true} onListChange={setGoalList} scale={1} item={{list: goalList}} />
      </label>
      <div style={styles.labelContainer}>

        <div style={styles.labelTitles}>Deadline:</div> 
        <Dropdown options={allDateOptions} value={dateSelectedOption} onChange={onChooseOption}/>
        {dateSelectedOption === 'Custom' && ( 
          <label>
          <input 
            type="date"
            name="goalDueDate"
            value={goalDueDate.toJSON().slice(0, 10)}
            onChange={(event) => setGoalDueDate(new Date(event.target.value))}
          />
      </label>
      )}
      </div>
      </div>
      <input 
        type="submit"
        value="Add"
        style={{...styles.submitButton, cursor: goalInput ? 'pointer' : 'not-allowed'}}
        onMouseOver={(event) => {
          if(goalInput)
            event.target.style.background = '#58FAD0'
        }}
        onMouseLeave={(event) => {
          if(goalInput)
            event.target.style.background = '#32A3BC'
        }}
      />

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
    marginLeft: 20, 
    marginBottom: 20,
  },
  image: {
    margin: 20,
  },
  formContainer: {
    marginTop: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  elemsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  pointContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 20,
  },
  firstLetterPoint: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 17,
  },
  restLetterPoint: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  definePoint: {
    fontSize: 14,
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelTitles: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGoal: {
    width: 550,
    marginLeft: 5,
  },
  submitButton: {
    background: 'lightblue',
    marginLeft: 10,
    height: 40,
    width: 60,
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}


export default SmarterForm
