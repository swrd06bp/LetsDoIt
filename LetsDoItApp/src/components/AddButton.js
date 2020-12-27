import React from 'react'
import { TouchableHighlight, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

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

const styles = EStyleSheet.create({
  buttonContainer: {
    height: '45rem',
    width: '50rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32A3BC',
    borderRadius: 100,
  },
  buttonText: {
    fontSize: '36rem',
    color: 'white',
    marginBottom: '5rem',
  }
})

export default AddButton
