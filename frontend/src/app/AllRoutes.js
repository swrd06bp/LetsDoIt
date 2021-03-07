import React, { useEffect, useState } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'

import Api from './Api'
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/login/LoginPage'
import AccountPage from '../pages/account'
import CustomizationPage from '../pages/customization'
import HappinessPage from '../pages/happiness'
import HappinessCreatePage from '../pages/happiness/Create'
import SignupPage from '../pages/signup/SignupPage'
import { PrivateRoute } from './PrivateRoute'

function AllRoutes (props) {
  const [redirect, setRedirect] = useState(null) 
  const history = useHistory()
  
  useEffect(() => {
    const checkStatus = async () => {
      const api = new Api()
      const isLogin = await api.status()
      if (!isLogin) setRedirect(true)
      else setRedirect(false)
    }
    checkStatus()
  }, [])
  
  return (
    <div>
      <PrivateRoute redirect={redirect} exact path="/" component={HomePage} />
      <PrivateRoute redirect={redirect} exact path="/week" component={HomePage} />
      <PrivateRoute redirect={redirect} exact path="/happinessCreate/:dueDate" component={HappinessCreatePage} />
      <PrivateRoute redirect={redirect} exact path="/happinessEdit/:happinessId/:dueDate" component={HappinessCreatePage} />
      <PrivateRoute redirect={redirect} exact path="/happiness" component={HappinessPage} />
      <PrivateRoute redirect={redirect} exact path="/account" component={AccountPage} />
      <PrivateRoute redirect={redirect} exact path="/customization" component={CustomizationPage} />
      <Route exact path={'/logout'} render={(props) => {
        const api = new Api()
        api.logout()
        setRedirect(true)
        return (<Redirect to={'/login'}/>)
      }}/>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
    </div>
  )
}

export default AllRoutes
