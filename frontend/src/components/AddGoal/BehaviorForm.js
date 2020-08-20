import React, { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Select from 'react-select'



function BehaviorForm (props) {
  const [content, setContent] = useState('')

  const allFrequencyOptions = [
    'every day',
    'every week',
    'every month',
  ]

  const weeklyFrequencyOptions = [{
    label:'Monday', value: 'Monday'
  },{
    label:'Tuesday', value: 'Tuesday'
  },{
    label:'Wednesday', value: 'Wednesday'
  },{
    label:'Thursday', value: 'Thursday'
  },{
    label:'Friday', value: 'Friday'
  },{
    label:'Saturday', value: 'Saturday'
  },{
    label:'Sunday', value: 'Sunday'
  }]

  const monthlyFrequencyOptions = [...Array(31).keys()].map(x => ({label: x, value: x}))
  
  

  const onOptionChange = (value) => {
    console.log(value)
  }


  return (
    <div>
    <div>What new habit will help you to get there</div>
    <div style={styles().newHabitContainer}>
      <div>New habit</div>
      <input
        type='text'
        placeholder='I am going to..'
        style={styles().inputEntry}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <Dropdown options={allFrequencyOptions} value={'every week'} onChange={onOptionChange}/>
      <div style={styles().weeklySelect}>
      <Select isMulti options={weeklyFrequencyOptions} closeMenuOnSelect={false} />
      </div>
      <div style={styles().monthlySelect}>
        <Select isMulti options={monthlyFrequencyOptions} closeMenuOnSelect={false} />
      </div>
      <div style={styles().addButton}>Add</div>
    </div>
    </div>
  )
}

const styles = () => ({
  newHabitContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklySelect: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 50,
  },
  monthlySelect: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 50,
  },
  addButton: {
    background: 'lightblue',
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    width: 50,
    fontWeight: 'bold',
  },
})


export default BehaviorForm

