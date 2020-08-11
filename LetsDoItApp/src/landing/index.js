import React, { useEffect } from 'react'
import { CommonActions} from '@react-navigation/native'
import Api from '../Api'


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
    const checkStatus = async () => {
      const api = new Api()
      const isLogin = await api.status()
      if (!isLogin) props.navigation.dispatch(homeAction('LoginPage'))
      else props.navigation.dispatch(homeAction('HomePage'))
    }
    checkStatus()
  }, [])

  return (null)
}

export default LandingPage
