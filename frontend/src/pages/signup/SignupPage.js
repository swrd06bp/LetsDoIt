import React, { useState, useEffect, useRef } from 'react'
import { ReCaptcha } from 'react-recaptcha-google'
import { useMixpanel } from 'react-mixpanel-browser'

import './SignupPage.css'

import Api from '../../app/Api'

function SignupPage() {
  
  const [isLoading, setIsLoading] = useState(false) 
  const [errorMess, setErrorMess] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef(null)
  const mixpanel = useMixpanel()


  useEffect(() => {
    onLoadCallback()
  }, [])
  
  const handleSubmit = async () => {
    setIsLoading(true)
    setErrorMess(false)
    const isSignup = await new Api().signup(name, username, password, captchaToken)
    setIsLoading(false)
    if (mixpanel.config.token)
      mixpanel.track('Signup Page - Submit signup', {isSignup: isSignup.status === 200})
    if (isSignup.status === 200) window.location.assign('/login')
    else if (isSignup.status === 400) {
      setErrorMess(true)  
      captchaRef.current.reset()
    }
    captchaRef.current.reset()
  }


  const onLoadCallback = () => {
    if(captchaRef.current) {
      captchaRef.current.reset()
    }
  }

  
  return (
    <div className="signup-page">
    {errorMess && (<div className='error'>This email is already used by somebody else..</div>)}
      <div className="form">
        <div className="signup-form">
          <input type="text" placeholder="First name" value={name} 
            onChange={(e) => setName(e.target.value)}/>
          <input type="email" placeholder="Email" value={username} 
            onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} 
            onChange={(e) => setPassowrd(e.target.value)}/>
          <ReCaptcha
            ref={captchaRef}
            size='normal'
            render='explicit'
            sitekey='6LfWLL8ZAAAAAKFH94RlDWBHpjxrBY79TVrXECs5'
            onloadCallback={onLoadCallback}
            verifyCallback={setCaptchaToken}
          />
          <button onClick={() => handleSubmit()}>
            {isLoading && (<img 
              alt={'loading'}
              src="/loading.svg"
              width="20" height="20"
              frameBorder="0" 
            />)}
            <div>signup</div>
           </button>
          <p class="message">Already registered? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  )
} 


export default SignupPage

