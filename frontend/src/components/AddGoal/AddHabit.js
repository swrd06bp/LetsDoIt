import React, { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Select from 'react-select'

import Api from '../../app/Api'


export default function AddHabit (props) {
  const [content, setContent] = useState('')
  const [frequecyOption, setFrequencyOption] = useState('every day')
  const [chosenFrequency, setChosenFrequency] = useState({day: 1})

  const api = new Api()

  
  const allFrequencyOptions = [
    {label: 'every day', value: 0},
    {label: 'every week', value: 1},
    {label: 'every month', value: 2},
  ]

  const weeklyFrequencyOptions = [...Array(7).keys()].slice(1).map(x => {
    const s = ' time per week'
    const ss= ' times per week'
    if (x === 1) return {label: x + s, value: x}
    else return {label: x + ss, value: x}
  })  

  const monthlyFrequencyOptions = [...Array(27).keys()].slice(1).map(x => {
    const s = ' time per month'
    const ss= ' times per month'
    if (x === 1) return {label: x + s, value: x}
    else return {label: x + ss, value: x}
  })

  const onOptionChange = ({value}) => {
    setFrequencyOption(value)
    if (value === 0) setChosenFrequency({day: 1})
    if (value === 1) setChosenFrequency({week: 1})
    if (value === 2) setChosenFrequency({month: 1})
  }
  
  const onOptionWeeklyChange = ({value}) => {
    setChosenFrequency({week: value})
  }

  const onOptionMonthlyChange = ({value}) => {
    setChosenFrequency({month: value})
  }

  const onSubmit = async () => {
    if(content) {
      const habit = { content, frequency: chosenFrequency, goalId: props.goalId, doneAt: null }
      await api.insertHabit(habit) 
      await props.getAllHabits() 
      setContent('')
    } 
  }

  return (
      <div style={styles().newHabitContainer}>
        <div style={styles().allInputContainer}>
         <div style={styles().setGoalContainer}>
          <div style={styles().titleInput}>New habit:</div>
            <input
              type='text'
              placeholder='I am going to..'
              style={styles().inputEntry}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          <div style={styles().frequencyContainer}>
            <div style={styles().titleFrequency}>Set the frequency of that new habit: </div>
              <Dropdown
                options={allFrequencyOptions} 
                onChange={onOptionChange}
              />
              {frequecyOption === 1 && (
                <div style={styles().weeklySelect}>
                <Dropdown
                  options={weeklyFrequencyOptions}
                  onChange={onOptionWeeklyChange}
                />
                </div>
              )}
              {frequecyOption === 2 && (
              <div style={styles().monthlySelect}>
                <Dropdown 
                  options={monthlyFrequencyOptions}
                  onChange={onOptionMonthlyChange}
                />
              </div>
              )}
            </div>
          </div>
          <div style={styles().addButton} onClick={onSubmit}>Add</div>
        </div>
  )
}

const styles = () => ({
  newHabitContainer: {
    borderStyle: 'solid',
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 20,
    width: 900,
    display: 'flex',
    flexDirection: 'row',
  },
  allInputContainer: {
    flexDirection: 'column',
    display: 'flex',
    width: 850,
  },
  setGoalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  titleFrequency: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  titleInput: {
    fontWeight: 'bold',
  },
  inputEntry: {
    width: 615,
    marginLeft: 20,
  },
  weeklySelect: {
    paddingTop: 10,
    marginLeft: 10,
    width: 300,
    height: 50,
  },
  monthlySelect: {
    paddingTop: 10,
    marginLeft: 10,
    width: 300,
    height: 50,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'lightblue',
    cursor: 'pointer',
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    width: 50,
    fontWeight: 'bold',
  },
})
