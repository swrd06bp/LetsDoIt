/* eslint-disable no-return-assign */
import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import * as Animatable from 'react-native-animatable'


import Api from '../Api'

function SignUpForm(props) {
  const [name, setName] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput1, setPasswordInput1] = useState('')
  const [passwordInput2, setPasswordInput2] = useState('')
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


  const attemptSignUp = async (username, password1, password2) => {
    // check if password are the same
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(username)) {
      setErrorMessage('The username is not a valid email address')
      view.current.bounce()
      setIsLoading(false)
      return      
    }

    if (!password1) {
      setErrorMessage('The password can not be null')
      view.current.bounce()
      setIsLoading(false)
      return      
    }

    if (password1 !== password2) {
      setErrorMessage('The passwords are not the same')
      view.current.bounce()
      setIsLoading(false)
      return
    }


    try {
      const isSignup = await timeout(5000, api.signup(name, username, password1, 'Le soleil est grand et beau'))
      if (isSignup.status === 400) {
        setErrorMessage('The username already exists')
        view.current.bounce()
      }
      else if (isSignup.status === 200)
        await props._accessHomePage()
    } catch (error) {
      setErrorMessage('No internet connection.')
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
          onChangeText={(text) => setName(text)}
          autoCorrect={false}
          keyboardType='default'
          returnKeyType="next"
          placeholder='First name'
          placeholderTextColor='#d4d4d4'
          editable={!isLoading}
        />
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
          returnKeyType="next"
          onSubmitEditing={()=> Keyboard.dismiss()}
          onChangeText={(text) => setPasswordInput1(text)}
          placeholder='Password'
          blurOnSubmit={false}
          placeholderTextColor='#d4d4d4'
          secureTextEntry
          textContentType="oneTimeCode"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={()=> Keyboard.dismiss()}
          returnKeyType="go"
          onChangeText={(text) => setPasswordInput2(text)}
          placeholder='Confirm password'
          textContentType="oneTimeCode"
          blurOnSubmit={false}
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
              attemptSignUp(emailInput, passwordInput1, passwordInput2)
            }
          }}>
          {isLoading && (
            <ActivityIndicator size='small' color='#ffffff' />
          )}
          <Text style={styles.buttonText}>SIGN UP</Text>
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
    backgroundColor: 'white',
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

export default SignUpForm
