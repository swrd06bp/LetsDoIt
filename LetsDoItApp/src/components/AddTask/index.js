import React, { useState } from 'react'
import { 
  View, 
  Keyboard,
  TextInput,
  Text, 
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native'

import Api from '../../Api.js'
import ActionButton from '../ActionButton'


function AddTask (props) {
  const [taskInput, setTaskInput] = useState('')

  const onSubmit = async (e) => {
    const api = new Api() 
    if (taskInput) {
      await api.insertTask({
        content: taskInput,
        list: 'Personal',
        dueDate: new Date().toJSON(),
        note: null,
      })
    }
    setTaskInput('')
    Keyboard.dismiss()
    props.onUpdate()
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={{height: 100}}
    >
      <View style={styles.wrapper}>
        <TextInput 
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({

  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    paddingHorizontal: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
})


export default AddTask

