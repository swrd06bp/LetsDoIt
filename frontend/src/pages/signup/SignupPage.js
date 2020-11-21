import React, { useState, useEffect, useRef } from 'react'
import { ReCaptcha } from 'react-recaptcha-google'

import './SignupPage.css'

import Api from '../../app/Api'

function SignupPage() {
  
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef(null)


  useEffect(() => {
    onLoadCallback()
  }, [])
  
  const handleSubmit = async () => {
    const isSignup = await new Api().signup(name, username, password, captchaToken)
    if (isSignup.status === 200) window.location.assign('/login')
  }


  const onLoadCallback = () => {
    if(captchaRef.current) {
      captchaRef.current.reset()
    }
  }

  
  return (
    <div className="signup-page">
      <div className="form">
        <div className="signup-form">
          <input type="text" placeholder="name" value={name} 
            onChange={(e) => setName(e.target.value)}/>
          <input type="email" placeholder="email" value={username} 
            onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="password" value={password} 
            onChange={(e) => setPassowrd(e.target.value)}/>
          <ReCaptcha
            ref={captchaRef}
            size='normal'
            render='explicit'
            sitekey='6LfWLL8ZAAAAAKFH94RlDWBHpjxrBY79TVrXECs5'
            onloadCallback={onLoadCallback}
            verifyCallback={setCaptchaToken}
          />
          <button onClick={() => handleSubmit()}>signup</button>
          <p class="message">Already registered? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  )
} 


export default SignupPage

