import React, { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Select from 'react-select'
import { getDimRatio } from '../../app/DynamicSizing'

import Api from '../../app/Api'


export default function AddHabit (props) {
  const [content, setContent] = useState('')
  const [frequecyOption, setFrequencyOption] = useState('every day')
  const [chosenFrequency, setChosenFrequency] = useState({type: 'day', number:1})
  const [startTime, setStartTime] = useState('00:00')

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
    if (value === 0) setChosenFrequency({type: 'day', number: 1})
    if (value === 1) setChosenFrequency({type: 'week', number: 1})
    if (value === 2) setChosenFrequency({type: 'month', number: 1})
  }
  
  const onOptionWeeklyChange = ({value}) => {
    setChosenFrequency({type: 'week', number: value})
  }

  const onOptionMonthlyChange = ({value}) => {
    setChosenFrequency({type: 'month', number: value})
  }

  const onSubmit = async () => {
    if(content) {
      const habit = { 
        content, 
        frequency: chosenFrequency, 
        goalId: props.goalId, 
        doneAt: null,
        acheived: null,
        startTime,
      }
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
          <div style={styles().frequencyContainer}>
            <div style={styles().titleFrequency}>Start time: </div>
            <input 
              type='time'
              step="1800"
              value={startTime}
              onChange={x => setStartTime(x.target.value)}
            />
          </div>
          </div>
          <div
            style={{...styles().addButton, cursor: content ? 'pointer' : 'not-allowed'}}
            onClick={onSubmit}
            onMouseOver={(event) => {
              if (content)
                event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              if (content)
                event.target .style.background = '#32A3BC'
            }}
          >
            Add
          </div>
        </div>
  )
}

const styles = () => ({
  newHabitContainer: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 0.5,
    padding: 20,
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  allInputContainer: {
    flexDirection: 'column',
    display: 'flex',
    width: '85%'
  },
  setGoalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 16 * getDimRatio().X,
  },
  titleFrequency: {
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16 * getDimRatio().X,
  },
  titleInput: {
    fontWeight: 'bold',
    fontSize: 16 * getDimRatio().X,
  },
  inputEntry: {
    width: '90%',
    marginLeft: 20,
    fontSize: 16 * getDimRatio().X,
  },
  weeklySelect: {
    paddingTop: 10,
    marginLeft: 10,
    height: 50,
    fontSize: 16 * getDimRatio().X,
  },
  monthlySelect: {
    paddingTop: 10,
    marginLeft: 10,
    height: 50,
    fontSize: 16 * getDimRatio().X,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'lightblue',
    marginLeft: 10,
    height: 50,
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    witdh: '15%',
    fontWeight: 'bold',
  },
})
