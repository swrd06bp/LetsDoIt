import React, { useState } from 'react'
import { CommonActions} from '@react-navigation/native'

import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'


function loginAction() {
  return CommonActions.reset({
    index: 0,
    routes: [
      {name: 'HomePage'},
    ],
  })
}

function LoginPage(props) {
  const [showSignedUp, setShowSignedUp] = useState(false)

  const _accessHomePage = () => {
    props.navigation.dispatch(loginAction())
  }

  

  return (
    
    <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
      <SafeAreaView>
      
        <View style={styles.logoContainer}>
        <Image
           resizeMode="contain" style={styles.logo}
           source={require('../../static/logo.png')}
          />
          </View>
        {!showSignedUp && (
          <LoginForm
            _accessHomePage={_accessHomePage}
          />
        )}
        {showSignedUp && (
          <SignUpForm
            _accessHomePage={() => setShowSignedUp(false)}
          />
        )}
        <Text style={styles.isSignedUpText}>{!showSignedUp ? 'Not registered? ' : 'Already registered? '}
          <TouchableOpacity
            onPress={() => setShowSignedUp(!showSignedUp)}
          >
            <Text style={styles.changeFormText}>{!showSignedUp ? 'Create an account' : 'Login to your account'}</Text>
          </TouchableOpacity>
        </Text>

      </SafeAreaView>
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
  isSignedUpText: {
    alignSelf: 'center',
  },
  changeFormText: {
    color: 'green',
    textDecorationLine: 'underline'
  },
})

export default LoginPage
