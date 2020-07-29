import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'

import Api from '../../Api.js'


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
    props.onUpdate()
  }

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <TextInput 
        type="text"
        name="task"
        placeholder="I want to.."
        value={taskInput}
        style={{paddingHorizontal: 20, width: '80%', borderWidth: 1, borderColor: 'lightgrey', borderRadius: 10}}
        onChangeText={(text) => setTaskInput(text)}
      />
      <TouchableOpacity onPress={onSubmit} style={{backgroundColor: 'lightblue', margin: 10, borderRadius: 40}}>
        <Text style={{color: 'white', fontWeight: 'bold', margin: 10}}>Add</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddTask

