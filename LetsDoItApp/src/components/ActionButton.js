import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

function ActionButton (props) {
  return (
      <TouchableOpacity onPress={props.onSubmit} style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
  )

}



const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
    margin: 10,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
  },

})

export default ActionButton
