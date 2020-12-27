import React, { useState } from 'react'
import { CommonActions} from '@react-navigation/native'

import {
  KeyboardAvoidingView,
  View,
  Image,
  Text,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

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
      <View style={styles.logoContainer}>
      <Image
         resizeMode="contain" style={styles.logo}
         source={require('../../static/logo.png')}
        />
        </View>
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

const styles = EStyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
  },
  textLogo: {
    color: '#5375ff',
    fontSize: '32rem',
    fontWeight: 'bold',
  },
  logo: {
    width: '130rem',
    height: '100rem',
  },
})

export default LoginPage
