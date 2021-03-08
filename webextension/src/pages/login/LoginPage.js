import React, { useState } from 'react'

//import { useMixpanel } from 'react-mixpanel-browser'

import './LoginPage.css'

import Api from '../../app/Api'

function LoginPage(props) {
  const [isLoading, setIsLoading] = useState(false) 
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  const [showError, setShowError] = useState(false)
  //const mixpanel = useMixpanel()
  
  const handleSubmit = async () => {
    setIsLoading(true)
    const isLogin = await new Api().login(username, password)
    //if (mixpanel.config.token)
   //   mixpanel.track('Login Page - Submit Login', {isLogin})
    if (isLogin) props.onLogin()
    else setShowError(true)
    setIsLoading(false)
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
          }}>
            {isLoading && (<img 
              alt={'loading'}
              src="/loading.svg"
              width="20" height="20"
              frameBorder="0" 
            />)}
            <div>Login</div>
          </button>
          
        </div>
      </div>
    </div>
  )
} 


export default LoginPage
