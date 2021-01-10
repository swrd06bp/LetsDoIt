import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

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

const styles = EStyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: window.innerHeight,
  },
  title: {
    fontSize: '40rem',
    marginBottom: '40rem',
  },
  inputArea: {
    width: '300rem',
    height: '300rem',
    borderWidth: 0.5,
  },
  doneButton: {
    marginTop: '30rem',
    alignItems: 'center',
    width: '100rem',
    borderRadius: '10rem',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'lightblue',
  },
})


export default Quote

