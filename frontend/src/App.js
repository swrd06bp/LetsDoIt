import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-google'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MixpanelProvider } from 'react-mixpanel-browser'

import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import AccountPage from './pages/account'
import HappinessPage from './pages/happiness'
import HappinessCreatePage from './pages/happiness/Create'
import SignupPage from './pages/signup/SignupPage'
import { PrivateRoute } from './app/PrivateRoute'
import { DynamicResize } from './app/DynamicSizing'


function App() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  

  useEffect(() => {
    loadReCaptcha()
    DynamicResize(forceUpdate)
  }, [])

  return (
    <div>
    <MixpanelProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/happinessCreate/:dueDate" component={HappinessCreatePage} />
          <PrivateRoute exact path="/happinessEdit/:happinessId/:dueDate" component={HappinessCreatePage} />
          <PrivateRoute exact path="/happiness" component={HappinessPage} />
          <PrivateRoute exact path="/account" component={AccountPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </Router>
    </MixpanelProvider>
    </div>
  )
}

export default App
