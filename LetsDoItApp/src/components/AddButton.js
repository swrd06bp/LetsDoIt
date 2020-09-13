import React from 'react'
import { TouchableHighlight, Text, StyleSheet } from 'react-native'

function AddButton(props) {

  return (
    <TouchableHighlight
      onPress={props.onClick}
      style={[styles.buttonContainer, props.style]}
      underlayColor={'#58FAD0'}
    >
      <Text style={styles.buttonText}>+</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32A3BC',
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 36,
    color: 'white',
    marginBottom: 5,
  }
})

export default AddButton
