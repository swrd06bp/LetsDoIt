import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'


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


const styles = StyleSheet.create({
  button: {
    borderRadius: 60,
    marginHorizontal: 10,
    elevation: 6,
    width: 50,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
})

export default ListButton
