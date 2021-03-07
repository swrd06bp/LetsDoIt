import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ redirect, component: Component, ...rest }) => {
  return (<Route {...rest} render={props => {
    if (redirect === null)
      return <div></div>
    else if (redirect === false)
      return <Component {...props} />
    else if (redirect === true) 
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  }}
  />)
}
