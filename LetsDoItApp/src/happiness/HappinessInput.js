import React, { useState } from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import { CommonActions} from '@react-navigation/native'

import Survey from './Survey'
import Quote from './Quote'
import Api from '../Api'

function HappinessInput (props) {
  const [score, setScore] = useState(null)
  const [showQuote, setShowQuote] = useState(false)
  
  const onSubmit = async (note) => {
    const api = new Api()
    await api.postHappiness(score, note)
    props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [
        {name: 'HomePage'},
      ],
    })
)
  }

  return (
    <View>
      {!showQuote && (
        <Survey onSubmit={(value) => {
          setScore(value)
          setShowQuote(true)
        }} />
      )}
      {showQuote && (
        <Quote onSubmit={onSubmit} />
      )}

    </View>
  )
}

export default HappinessInput
