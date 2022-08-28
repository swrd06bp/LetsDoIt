import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { useMixpanel } from 'react-mixpanel-browser'
 import queryString from 'query-string'


import './LoginPage.css'

import Api from '../../app/Api'

function LoginPage(props) {
  const [isLoading, setIsLoading] = useState(false) 
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  const [showError, setShowError] = useState(false)
  let history = useHistory()
  const mixpanel = useMixpanel()
  
  const handleSubmit = async () => {
    const api = new Api()
    setIsLoading(true)
    const isLogin = await api.login(username, password)
    if (mixpanel.config.token)
      mixpanel.track('Login Page - Submit Login', {isLogin})
    if (isLogin) {
      const params = queryString.parse(props.location.search)
      if (params.type === 'slack') {
        const response = await api.postIntegrations({ 
          type: 'slack',
          values: {
            teamId: params.teamId,
            userId: params.userId,
          },
        })
      }
      history.replace("/") 
    }
    else setShowError(true)
    setIsLoading(false)
  }

  console.log(props)
  
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
          }}>
            {isLoading && (<img 
              alt={'loading'}
              src="/loading.svg"
              width="20" height="20"
              frameBorder="0" 
            />)}
            <div>Login</div>
          </button>
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
