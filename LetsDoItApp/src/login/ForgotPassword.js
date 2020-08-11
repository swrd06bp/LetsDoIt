import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'

import * as Animatable from 'react-native-animatable'

import Api from '../../app/Api'

function ForgotPassword (props) {
  const [emailInput, setEmailInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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


  const attemptResetPwd = async (email) => {
    setSuccess(false)
    try {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (re.test(email)) {
        await timeout(5000, api.resetPassword(email))
        setErrorMessage('')
        setSuccess(true)
      } else {
        setErrorMessage('Enter a valid email address.')
        throw 'Wrong format email entry'
      }
    } catch (error) {
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
      {success && (
        <Text style={styles.success}>A new email was sent to {emailInput} with a link to reset your password.</Text>
      )}
      <Animatable.View ref={handleViewRef}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setEmailInput(text)
            setErrorMessage('')
            setSuccess(false)
          }}
          autoCapitalize="none"
          value={emailInput}
          autoCorrect={false}
          keyboardType='email-address'
          returnKeyType="next"
          placeholder='Email address'
          placeholderTextColor='#d4d4d4'
          editable={!isLoading}
        />


        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={isLoading}
          onPress={() => {
            if (!isLoading) {
              setIsLoading(true)
              attemptResetPwd(emailInput)
            }
          }}>
          {isLoading && (
            <ActivityIndicator size='small' color='#ffffff' />
          )}
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>
      </Animatable.View>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => {
          props._forgotPwdToggle()
        }}
      >
      <Text style={styles.forgotPasswordText}>Sign in</Text>
      </TouchableOpacity>
    </View>

  )
}

const styles = EStyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 60,
    marginBottom: 10,
    padding: 10,
    borderColor: '#d4d4d4',
    borderWidth: 1,
  },
  buttonContainer: {
    backgroundColor: '#5375ff',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
  },
  buttonText: {
    color: '#fff',
    marginHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: 10,
  },
  forgotPassword: {
    margin: 15,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
    color: '#1a1a1a',
  },
  success: {
    color: 'green',
    alignSelf: 'center',
    marginBottom: 10,
  },
})

export default ForgotPassword

