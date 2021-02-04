import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Modal from 'react-modal'
import { TimePicker } from 'antd'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import Api from '../../app/Api'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import moment from 'moment'

function EditHabitForm (props) {
  const [content, setContent] = useState(props.habit ? props.habit.content : '')
  const [maxStreak, setMaxStreak] = useState(props.habit && props.habit.maxStreak ? props.habit.maxStreak : 66)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [frequencyOption, setFrequencyOption] = useState(!props.habit ? 0 : (props.habit.frequency.type === 'day' ? 0 : (props.habit.frequency.type === 'week' ? 1 : 2)))
  const [chosenFrequency, setChosenFrequency] = useState(props.habit ? props.habit.frequency : {type: 'day', number:1})
  const [startTime, setStartTime] = useState(props.habit && props.habit.startTime ? props.habit.startTime : moment(new Date()))
  const [isNotification, setIsNotification] = useState(false)
  
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])


  const allFrequencyOptions = [
    {label: 'every day', value: 0},
    {label: 'every week', value: 1},
    {label: 'every month', value: 2},
  ]


  const weeklyFrequencyOptions = [...Array(7).keys()].slice(1).map(x => {
    const s = 'Once per week'
    const ss = 'Twice per week'
    const sss = ' times per week'
    if (x === 1) return {label:  s, value: x}
    else if (x === 2) return {label: ss, value: x}
    else return {label: x + sss, value: x}
  })  

  const monthlyFrequencyOptions = [...Array(27).keys()].slice(1).map(x => {
    const s = 'Once per month'
    const ss = 'Twice per month'
    const sss = ' times per month'
    if (x === 1) return {label:  s, value: x}
    else if (x === 2) return {label: ss, value: x}
    else return {label: x + sss, value: x}
  })

  const onOptionChange = (value) => {
    if (value === 0) setChosenFrequency({type: 'day', number: 1})
    if (value === 1) setChosenFrequency({type: 'week', number: 1})
    if (value === 2) setChosenFrequency({type: 'month', number: 1})
    setFrequencyOption(value)
  }

  const onOptionWeeklyChange = (value) => {
    setChosenFrequency({type: 'week', number: value})
  }

  const onOptionMonthlyChange = (value) => {
    setChosenFrequency({type: 'month', number: value})
  }




  return (
      <Modal
        isOpen={true}
        onRequestClose={props.onClose}
        style={styles()}
        contentLabel="Example Modal"
      >
       <div style={styles().container}>
         <div style={styles().titleContainer}>
           <div style={styles().titleText}>{props.habit ? 'Edit this' : 'Create a'} habit</div>
         </div>
         <div style={styles().nameContainer}>
           <div>Name:</div>
           <input
            value={content} 
             placeholder={'Create a habit'}
             onChange={(event) => setContent(event.target.value)}
             style={styles().nameInputContainer}
            />
         </div>
         <div style={styles().frequencyContainer}>
           <div>Frequency:</div>
           <Select 
             styles={styles().dropdownSelect}
             options={allFrequencyOptions}
             onChange={({value}) => onOptionChange(value)}
           />
          {frequencyOption === 1 && (
           <Select 
             styles={styles().dropdownSelect}
             options={weeklyFrequencyOptions}
             onChange={({value}) => onOptionWeeklyChange(value)}
           />
          )}
          {frequencyOption === 2 && (
           <Select 
             styles={styles().dropdownSelect}
             options={monthlyFrequencyOptions}
             onChange={({value}) => onOptionMonthlyChange(value)}
           />
          )}
         </div>
          <div style={styles().notificationContainer}>
            <div>Notification:</div>
            <input 
              type='checkbox'
              style={styles.checkbox}
              value={isNotification}
              onChange={() => {
              setIsNotification(!isNotification)
            }}/>
            {isNotification && (
              <TimePicker
              format={'hh:mm'}
              minuteStep={15}
              value={startTime}
              style={styles.startTimeContainer}
              onChange={(value) => {
                setStartTime(value)
              }}
            />
            )}

         </div>
          <div style={styles().maxStreakContainer}>
           <div>Max streaks:</div>
           <input 
             type='number'
             value={maxStreak.toString()}
             style={styles().inputTextContainer}
             onChange={(event) => setMaxStreak(event.target.value)}
           />
         </div>
         <div 
          style={styles().buttonSave} 
          onClick={() => {
          if (content) {
            const habit = { 
              content, 
              frequency: chosenFrequency, 
              goalId: props.goalId, 
              doneAt: null,
              acheived: null,
              startTime: startTime.format('hh:mm'),
              maxStreak,
              isNotification,
            }
            props.onAddHabit(habit)
         }
         }}>Save</div>
    
         </div>
    </Modal>
  )
}

const styles = () => ({
  container: {
    marginHorizontal: 17 * getDimRatio().X,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18 * getDimRatioText().X,
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: 10 * getDimRatio().X,
  },
  nameContainer: {
    alignSelf: 'center',
    width: '100%',
    marginVertical: 2 * getDimRatio().Y,
  },
  nameInputContainer: {
    borderColor: 'grey',
    borderWidth: 0.5,
    height: 70 * getDimRatio().Y,
  },
  frequencyContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 70 * getDimRatio().Y,
    alignItems: 'center',
    marginVertical: 2 * getDimRatio().Y,
  },
  notificationContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 70 * getDimRatio().Y,
    alignItems: 'center',
    marginVertical: 2 * getDimRatio().Y,
  },
  startTimeContainer: {
    borderWidth: 0.5,
    borderColor: 'grey',
    marginVertical: 2 * getDimRatio().Y,
    height: 70 * getDimRatio().Y,
    justifyContent: 'center',
    paddingHorizontal: 3 * getDimRatio().X,
  },
  maxStreakContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 70 * getDimRatio().Y,
  },
  inputTextContainer: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    height: 70 * getDimRatio().Y,
    alignItems: 'center',
    paddingHorizontal: 3 * getDimRatio().X,
  }, 
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#32A3BC',
    fontSize: 18 * getDimRatio().X,
    height: 70 * getDimRatio().Y,
    width: 70 * getDimRatio().X,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderWidth: 0,
    borderRadius: 20,
  },
  dropdownSelect: {
    control: (styles) => ({...styles, width: 170 * getDimRatio().X})
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
})


export default EditHabitForm
