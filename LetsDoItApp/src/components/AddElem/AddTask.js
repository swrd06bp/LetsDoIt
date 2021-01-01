import React, { useState, createRef, useEffect } from 'react'
import { 
  View, 
  Keyboard,
  TextInput,
  Text, 
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import {
  todayDate,
  tomorrowDate,
  nextMondayDate,
} from '../../utils'
import Api from '../../Api.js'
import ActionButton from '../ActionButton'


function Helper(props) {
  const isActive = props.content === props.chosenDateOption 
  return (
    <TouchableOpacity 
      style={isActive ? styles.helperActiveWrapper : styles.helperWrapper}
      onPress={() => {props.onChange(props.content)}}
    >
      <Text style={styles.helperText}>{props.content}</Text>
    </TouchableOpacity>
  )
}

function AddTask (props) {
  const inputRef = createRef()
  const [taskInput, setTaskInput] = useState('')
  const [chosenDateOption, setChosenDateOption] = useState('Today')

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const onSubmit = async (e) => {
    let dueDate
    if (chosenDateOption === 'Today') dueDate = todayDate()
    else if(chosenDateOption === 'Tomorrow') dueDate = tomorrowDate()
    else if(chosenDateOption === 'Next Monday') dueDate = nextMondayDate()
    else if(chosenDateOption === 'Someday') dueDate = null

    
    const api = new Api() 
      const newTask = {
        content: taskInput,
        list: 'Personal',
        dueDate,
        note: null,
      }
    if (taskInput) {
      const resp = await api.insertTask(newTask)
      const json = await resp.json()
      newTask.type = 'task'
      newTask.id = json.taskId.insertedId
      newTask._id = json.taskId.insertedId
      props.onCreate(newTask, chosenDateOption)
    }
    setTaskInput('')
  }

  return (
    <ScrollView
      scrolEnabled={false}
      keyboardShouldPersistTaps='always'
    >
    <View style={styles.inputContainer}>
      <View style={styles.firstPart}>
      <View style={styles.helpersContainer}>
        <Helper 
          content={'Today'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        {!props.isWeek && (
        <Helper 
          content={'Tomorrow'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        )}
        {!props.isWeek && (
        <Helper
          content={'Next Monday'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        )}
        {!props.isWeek && (
        <Helper
          content={'Someday'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        )}
      </View>
      
         
        <TextInput 
          ref={inputRef}
          type="text"
          name="task"
          placeholder="I want to.."
          value={taskInput}
          style={styles.textInput}
          onSubmitEditing={onSubmit}
          onChangeText={(text) => setTaskInput(text)}
        />
        </View>
      
        <ActionButton onSubmit={onSubmit} text={'Add'}/>
      </View>
    </ScrollView>
  )
}

const styles = EStyleSheet.create({
  ScrollView: {
    backgroundColor: 'white',
    flex: 1,
  },
  helpersContainer: {
    flexDirection: 'row',
    marginVertical: 1,

  },
  helperWrapper: {
    backgroundColor: '#D8D8D8',
    marginHorizontal: '2rem',
    paddingHorizontal: '4rem',
    borderRadius: 20,
  },
  helperActiveWrapper: {
    backgroundColor: '#A4A4A4',
    marginHorizontal: '2rem',
    paddingHorizontal: '4rem',
    borderRadius: 20,
  },
  helperText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14rem',
  },
  firstPart: {
    width: '80%'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  textInput: {
    paddingHorizontal: '20rem',
    height: '50rem',
    fontSize: '16rem',
    width: '100%',
    borderWidth: 1,
    height: '40rem',
    marginBottom: '18rem',
    borderColor: 'lightblue',
    borderRadius: '10rem',
  },
  buttonAdd: {
    
  },
})


export default AddTask

