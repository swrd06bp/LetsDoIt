import React, { useState } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'

import './LoginPage.css'

import Api from '../../app/Api'

function LoginPage() {
  
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  const [showError, setShowError] = useState(false)
  const mixpanel = useMixpanel()
  
  const handleSubmit = async () => {
    const isLogin = await new Api().login(username, password)
    if (mixpanel.config.token)
      mixpanel.track('Login Page - Submit Login', {isLogin})
    if (isLogin) window.location.assign('/')
    else setShowError(true)
  }

  
  return (
    <div className="login-page">
     {showError && (<div className='error'>Your username or password must be wrong</div>)}
      <div className="form">
        <div className="login-form">
          <input type="email" placeholder="email" value={username} 
            onChange={(e) => {
              setUsername(e.target.value)
              if (showError) setShowError(false)
            }}
          />
          <input type="password" placeholder="password" value={password} 
            onChange={(e) => {
              setPassowrd(e.target.value)
              if (showError) setShowError(false)
            }}
          />
          <button onClick={() => {
            handleSubmit()
          }}>login</button>
          <p class="message">Not registered? <a href="/signup" onClick={() => {
            if (mixpanel.config.token)
              mixpanel.track('Login Page - Redirect to signup page')
          }}>Create an account</a></p>
        </div>
      </div>
    </div>
  )
} 


export default LoginPage
