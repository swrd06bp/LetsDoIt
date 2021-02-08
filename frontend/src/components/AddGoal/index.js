import React, { useState } from 'react'
import Select from 'react-select'

import ListButton from '../ListButton'
import { getDimRatio } from '../../app/DynamicSizing'
import Api from '../../app/Api.js'


function AddGoal (props) {
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
        if (props.type === 'goal') {
          const resp = await api.insertGoal({
            content: goalInput,
            list: goalList,
            dueDate: goalDueDate,
          })
        }
        else if (props.type === 'project') {
          const resp = await api.insertProject({
            content: goalInput,
            list: goalList,
            dueDate: goalDueDate,
          })
        }
        props.onUpdate()
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
    <form style={styles.formContainer} onSubmit={onSubmit}>
      <div style={styles.elemsContainer}>
      <label style={styles.labelContainer}>
       <div style={styles.labelTitles}>{props.type === 'goal' ? 'Goal' : 'Project'}:</div> 
        <input 
          style={styles.inputGoal}
          type="text"
          name="goalInput"
          placeholder={props.type === 'goal' ? "Set a positive goal..": 'Create a new project'}
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />
        <ListButton active={true} onListChange={setGoalList} scale={1} item={{list: goalList}} />
      </label>
      <div style={styles.labelContainer}>

        <div style={styles.labelTitles}>Deadline:</div> 
        <Select
          menuPlacement="top"
          styles={{control: (styles) => ({...styles, width: 150 * getDimRatio().X})}}
          options={allDateOptions}
          selectValue={dateSelectedOption}
          onChange={onChooseOption}
        />
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

export default AddGoal



