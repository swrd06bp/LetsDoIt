import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Api from './Api'

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [redirect, setRedirect] = useState(null) 
  
  useEffect(() => {
    const checkStatus = async () => {
      const api = new Api()
      const isLogin = await api.status()
      if (!isLogin) setRedirect(true)
      else setRedirect(false)
    }
    checkStatus()
  }, [])
  if (redirect === null)
    return <div></div>
  else {
    return (<Route {...rest} render={props => (
      !redirect ?
        <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )}
    />)
  }
}
