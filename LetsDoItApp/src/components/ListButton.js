import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'


function ListButton (props) {
  return (
    <TouchableOpacity 
      style={[{backgroundColor: props.list === 'Personal' ? 'blue' : 'brown'}, styles.button]}
      onPress={props.onListChange}
    >
      <Text style={styles.buttonText}>{props.list}</Text>
    </TouchableOpacity>
  )
}


const styles = EStyleSheet.create({
  button: {
    borderRadius: '60rem',
    marginHorizontal: '10rem',
    elevation: 6,
    width: '50rem',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: '10rem',
    fontWeight: 'bold',
    color: 'white',
  },
})

export default ListButton
