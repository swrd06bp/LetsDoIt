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
  Image,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import {
  todayDate,
  tomorrowDate,
  nextMondayDate,
} from '../../utils'
import Api from '../../Api'
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
    if (Platform.OS === "ios") 
      setTimeout(() => inputRef.current.focus(), 50)
    else
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
    onDismiss()
  }

  function onDismiss (props) {
    setTaskInput('')
    Keyboard.dismiss()    
  }

  return (
    <ScrollView
      scrolEnabled={false}
      keyboardShouldPersistTaps='always'
    >
    <View style={styles.inputContainer}>
     <View style={styles.firstPart}>
      <TouchableOpacity
        style={styles.imageCrossContainer} 
        onPress={onDismiss}
      >
        <Image 
          resizeMode="contain"
          source={require('../../../static/cross.png')} 
          style={styles.imageCross} 
        />
      </TouchableOpacity>
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
  imageCross: {
    height: '15rem',
    width: '15rem',
  },
  imageCrossContainer: {
    padding: '8rem'
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    paddingHorizontal: '20rem',
    height: '50rem',
    fontSize: '16rem',
    width: '75%',
    borderWidth: 1,
    height: '40rem',
    borderColor: 'lightblue',
    borderRadius: '10rem',
  },
  buttonAdd: {
    
  },
})


export default AddTask

