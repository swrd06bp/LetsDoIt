import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

function ActionButton (props) {
  return (
      <TouchableOpacity onPress={props.onSubmit} style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
  )

}



const styles = EStyleSheet.create({
  button: {
    backgroundColor: '#32A3BC',
    margin: '10rem',
    borderRadius: '40rem',
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    margin: '10rem',
  },

})

export default ActionButton
