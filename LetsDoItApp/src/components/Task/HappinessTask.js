import React from 'react'
import { 
  View, 
  TextInput, 
  Vibration,
  Text, 
  TouchableOpacity,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

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

const styles = EStyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: '37rem',
    borderRadius: '40rem',
    marginHorizontal: '5rem',
  },
  titleContainer: {
    marginLeft: '20rem',
    fontSize: '14rem',
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
    marginRight: '5rem',
    width: '130rem',
    backgroundColor: 'lightgrey',
    borderRadius: 20,
  },
})

export default HappinessTask

