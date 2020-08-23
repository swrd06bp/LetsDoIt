import React, { useState } from 'react'

import './LoginPage.css'

import Api from '../../app/Api'

function LoginPage() {
  
  const [username, setUsername] = useState('')
  const [password, setPassowrd] = useState('')
  
  const handleSubmit = async () => {
    const isLogin = await new Api().login(username, password)
    if (isLogin) window.location.assign('/')
  }

  
  return (
    <div className="login-page">
      <div className="form">
        <div className="login-form">
          <input type="email" placeholder="email" value={username} 
            onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="password" value={password} 
            onChange={(e) => setPassowrd(e.target.value)}/>
          <button onClick={() => handleSubmit()}>login</button>
        </div>
      </div>
    </div>
  )
} 


export default LoginPage
