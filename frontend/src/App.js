import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-google'
import 'bootstrap/dist/css/bootstrap.min.css'

import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import HappinessPage from './pages/happiness'
import SignupPage from './pages/signup/SignupPage'
import { PrivateRoute } from './PrivateRoute'
import { DynamicResize } from './DynamicSizing'


function App() {

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    loadReCaptcha()
    DynamicResize(forceUpdate)
  }, [])

  return (
    <div>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/happiness" component={HappinessPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </Router>
    </div>
  )
}

export default App
