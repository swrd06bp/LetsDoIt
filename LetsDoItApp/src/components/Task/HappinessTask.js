import React from 'react'
import { 
  View, 
  TextInput, 
  Vibration,
  Text, 
  TouchableOpacity,
  StyleSheet
} from 'react-native'

function HappinessTask (props) {

  const onAcheive = async () => {
    props.navigation.navigate('HappinessInput')
    Vibration.vibrate(100)
    
  } 

  return (
    <View
      style={styles.wrapper}
    >
      <View style={styles.frontContainer}>
        <Text style={styles.titleContainer}>Track your happiness</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onAcheive}>
          <Text style={styles.buttonText}>Check yourself</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 37,
    borderRadius: 40,
    marginHorizontal: 5,
  },
  titleContainer: {
    marginLeft: 20,
    fontSize: 14,
  },
  frontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    width: 130,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
  },
})

export default HappinessTask

