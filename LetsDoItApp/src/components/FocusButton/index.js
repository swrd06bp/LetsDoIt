import React, { useState, useEffect } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { TouchableOpacity, View, Text, AppState } from 'react-native'
import moment from 'moment'

import Api from '../../Api'

function FocusButton (props) {
  const [customization, setCustomization] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [focusGoal, setFocusGoal] = useState(null)
  const api = new Api()
  


  useEffect(() => {
    AppState.addEventListener("change", getFocus)
    getFocus()
    getCurrentCustomization()
    return () => AppState.addEventListener("change", getFocus)
  }, [props.number])

  const getFocus = async () => {
    const resp = await api.getFocus({
      type: props.type, number: props.number, limit: 1
    })
    const json = await resp.json()
    
    if (json.length) setFocusGoal(json[0].content)
    else setFocusGoal(null)
    setIsLoading(false)
  }

  const getCurrentCustomization = async () => {
    const resp = await api.getCustomization() 
    const json = await resp.json()
    if (json[0].customization) {
      const customization = json[0].customization
      setCustomization(customization)
    }
  }

  if (!customization.dailyFocus && props.type === 'day') return null
  if (!customization.weeklyFocus && !props.type !== 'day') return null

  return (
  	<View>
  	  {!isLoading && (
        <TouchableOpacity 
          onPress={() => props.navigation.navigate('DayFocus', {type: props.type})}
          style={focusGoal ? styles.activeButton : styles.button}
        >
          <Text style={styles.buttonText}>{focusGoal ? focusGoal : (props.type === 'day' ? 'Set the focus of your day' : 'Set the focus of your week')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )

}



const styles = EStyleSheet.create({
  button: {
    backgroundColor: '#32A3BC',
    margin: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },
  activeButton: {
    backgroundColor: '#009933',
    margin: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',	
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16rem',
    margin: 5,
  },

})

export default FocusButton
