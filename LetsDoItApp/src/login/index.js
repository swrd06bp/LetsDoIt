import React, { useState } from 'react'
import { CommonActions} from '@react-navigation/native'

import {
  KeyboardAvoidingView,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'

import LoginForm from './LoginForm'


function loginAction() {
  return CommonActions.reset({
    index: 0,
    routes: [
      {name: 'HomePage'},
    ],
  })
}

function LoginPage(props) {

  const _accessHomePage = () => {
    props.navigation.dispatch(loginAction())
  }

  

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
      <LoginForm
        _accessHomePage={_accessHomePage}
      />
    </KeyboardAvoidingView>
  )
}

LoginPage.navigationOptions = {
  headerStyle: {
    backgroundColor: '#2c3e50',
  },
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  textLogo: {
    color: '#5375ff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  logo: {
    width: 130,
    height: 100,
  },
})

export default LoginPage
