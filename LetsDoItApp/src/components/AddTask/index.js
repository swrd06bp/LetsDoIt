import React, { useState, createRef, useEffect } from 'react'
import { 
  View, 
  Keyboard,
  TextInput,
  ScrollView,
  Text, 
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native'

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
    else if(chosenDateOption === 'Next monday') dueDate = nextMondayDate()
    else if(chosenDateOption === 'Someday') dueDate = null

    
    const api = new Api() 
    if (taskInput) {
      await api.insertTask({
        content: taskInput,
        list: 'Personal',
        dueDate,
        note: null,
      })
    }
    setTaskInput('')
    props.onUpdate()
  }

  return (
    <ScrollView
      scrolEnabled={false}
      keyboardShouldPersistTaps='always'
    >
      <View style={styles.helpersContainer}>
        <Helper 
          content={'Today'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        <Helper 
          content={'Tomorrow'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        <Helper
          content={'Next monday'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
        <Helper
          content={'Someday'}
          chosenDateOption={chosenDateOption}
          onChange={setChosenDateOption}
        />
      </View>
      <View style={styles.inputContainer}>
         
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
        <ActionButton onSubmit={onSubmit} text={'Add'}/>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
    marginHorizontal: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  helperActiveWrapper: {
    backgroundColor: '#A4A4A4',
    marginHorizontal: 2,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  helperText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    paddingHorizontal: 20,
    height: 50,
    fontSize: 16,
    width: '80%',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
})


export default AddTask

