import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { CommonActions} from '@react-navigation/native'
import Api from '../../Api'


function homeAction(routeName) {
  return CommonActions.reset({
    index: 0,
    routes: [
      {name: routeName},
    ],
  })
}

function LandingPage(props) {
  

  useEffect(() => {
    checkStatus()
  }, [])
  
  const checkStatus = async () => {
    const api = new Api()
    const reps = await fetch('https://www.google.com')
    const isLogin = await api.status()
    if (!isLogin) props.navigation.dispatch(homeAction('LoginPage'))
    else props.navigation.dispatch(homeAction('HomePage'))
  }

  return (<View></View>)

}

export default LandingPage
