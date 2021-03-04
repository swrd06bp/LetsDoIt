import React, { useEffect, useState, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-google'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MixpanelProvider } from 'react-mixpanel-browser'

import Api from './app/Api'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import AccountPage from './pages/account'
import CustomizationPage from './pages/customization'
import HappinessPage from './pages/happiness'
import HappinessCreatePage from './pages/happiness/Create'
import SignupPage from './pages/signup/SignupPage'
import { PrivateRoute } from './app/PrivateRoute'
import { DynamicResize } from './app/DynamicSizing'


function App() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [redirect, setRedirect] = useState(null) 
  

  useEffect(() => {
    const checkStatus = async () => {
      const api = new Api()
      const isLogin = await api.status()
      if (!isLogin) setRedirect(true)
      else setRedirect(false)
    }
    checkStatus()

    loadReCaptcha()
    DynamicResize(forceUpdate)
  }, [])

  return (
    <div>
    <MixpanelProvider>
      <Router>
        <div>
          <PrivateRoute redirect={redirect} exact path="/" component={HomePage} />
          <PrivateRoute redirect={redirect} exact path="/week" component={HomePage} />
          <PrivateRoute redirect={redirect} exact path="/happinessCreate/:dueDate" component={HappinessCreatePage} />
          <PrivateRoute redirect={redirect} exact path="/happinessEdit/:happinessId/:dueDate" component={HappinessCreatePage} />
          <PrivateRoute redirect={redirect} exact path="/happiness" component={HappinessPage} />
          <PrivateRoute redirect={redirect} exact path="/account" component={AccountPage} />
          <PrivateRoute redirect={redirect} exact path="/customization" component={CustomizationPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </Router>
    </MixpanelProvider>
    </div>
  )
}

export default App
