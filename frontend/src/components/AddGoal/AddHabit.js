import React, { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Select from 'react-select'

import Api from '../../app/Api'


export default function AddHabit (props) {
  const [content, setContent] = useState('')
  const [frequecyOption, setFrequencyOption] = useState('every day')
  const [cronFrequency, setCronFrequency] = useState('0 0 * * *')

  const api = new Api()

  
  const allFrequencyOptions = [
    'every day',
    'every week',
    'every month',
  ]

  const weeklyFrequencyOptions = [{
    label:'Monday', value: 1
  },{
    label:'Tuesday', value: 2
  },{
    label:'Wednesday', value: 3
  },{
    label:'Thursday', value: 4
  },{
    label:'Friday', value: 5
  },{
    label:'Saturday', value: 6
  },{
    label:'Sunday', value: 0
  }]

  const monthlyFrequencyOptions = [...Array(31).keys()].map(x => {
    if (x === 0) return {label: `${x + 1}st`, value: x + 1}
    else if (x === 1) return {label: `${x + 1}nd`, value: x + 1}
    else if (x === 2) return {label: `${x + 1}rd`, value: x + 1}
    return {label: `${x + 1}th`, value: x + 1}
  })
  
  const onOptionWeeklyChange = (value) => {
    const weeks = value.map(x => x.value).join()
    setCronFrequency(`0 0 * * ${weeks}`)
  }

  const onOptionMonthlyChange = (value) => {
    const months = value.map(x => x.value).join()
    setCronFrequency(`0 0 ${months} * *`)
  }

  const onSubmit = async () => {
    if(content) {
      const habit = { content, frequency: cronFrequency, goalId: props.goalId }
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
                value={frequecyOption} 
                onChange={({value}) => setFrequencyOption(value)}
              />
              {frequecyOption === 'every week' && (
                <div style={styles().weeklySelect}>
                <Select
                  isMulti
                  options={weeklyFrequencyOptions}
                  onChange={onOptionWeeklyChange}
                  closeMenuOnSelect={false}
                />
                </div>
              )}
              {frequecyOption === 'every month' && (
              <div style={styles().monthlySelect}>
                <Select 
                  isMulti 
                  options={monthlyFrequencyOptions}
                  closeMenuOnSelect={false}
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
