import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-google'
import 'bootstrap/dist/css/bootstrap.min.css'

import HomePage from './home/HomePage'
import LoginPage from './login/LoginPage'
import SignupPage from './signup/SignupPage'
import { PrivateRoute } from './PrivateRoute'


function App() {

  useEffect(() => {
    loadReCaptcha()
  }, [])

  return (
    <div>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </Router>
    </div>
  )
}

export default App
