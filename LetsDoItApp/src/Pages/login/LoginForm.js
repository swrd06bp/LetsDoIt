/* eslint-disable no-return-assign */
import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import * as Animatable from 'react-native-animatable'

import Api from '../../Api'

function LoginForm(props) {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const view = useRef(null)
  const api = new Api()

  const handleViewRef = ref => view.current = ref
  
  const timeout = async (ms, promise) =>
    new Promise(((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, ms)
      promise.then(resolve, reject)
    }))

  const attemptLogin = async (username, password) => {
    try {
      const companyId = await timeout(5000, api.login(username, password))
      if (!companyId) {
        setErrorMessage('Wrong username or password.')
        throw "Wrong credentials"
      }
      await props._accessHomePage()
    } catch (error) {
      if (error !== 'Wrong credentials') setErrorMessage('No internet connection.')
      view.current.bounce()
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
     {!isLoading && (
      <Text style={styles.errorMessage}>{errorMessage}</Text>
     )}
      <Animatable.View ref={handleViewRef}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmailInput(text)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType='email-address'
          returnKeyType="next"
          placeholder='Email address'
          placeholderTextColor='#d4d4d4'
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="go"
          onChangeText={(text) => setPasswordInput(text)}
          placeholder='Password'
          placeholderTextColor='#d4d4d4'
          secureTextEntry
          editable={!isLoading}
        />


        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={isLoading}
          onPress={() => {
            if (!isLoading) {
              setIsLoading(true)
              attemptLogin(emailInput, passwordInput)
            }
          }}>
          {isLoading && (
            <ActivityIndicator size='small' color='#ffffff' />
          )}
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  )
}

// define your styles
const styles = EStyleSheet.create({
  container: {
    padding: '20rem',
  },
  input: {
    height: '60rem',
    marginBottom: '10rem',
    padding: '10rem',
    borderColor: '#d4d4d4',
    borderWidth: 1,
  },
  buttonContainer: {
    backgroundColor: '#5375ff',
    paddingVertical: '15rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '60rem',
  },
  buttonText: {
    color: '#fff',
    marginHorizontal: '20rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: '10rem',
  },
})

export default LoginForm
