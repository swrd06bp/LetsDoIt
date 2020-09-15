import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'

function Quote (props) {
  const [note, setNote] = useState(null)


  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tell us more</Text>
      <TextInput 
        multiline={true}
        numberOfLines = {4}
        style={styles.inputArea}
        value={note ? note : ''}
        onChangeText={(text) => setNote(text)}
      />
      <TouchableOpacity
        onPress={() => props.onSubmit(note)}
        style={styles.doneButton}
      >
      <Text>Done</Text>
    </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: window.innerHeight,
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
  },
  inputArea: {
    width: 300,
    height: 300,
    borderWidth: 0.5,
  },
  doneButton: {
    marginTop: 30,
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'lightblue',
  },
})


export default Quote

