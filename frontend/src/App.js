import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import HomePage from './home/HomePage'
import LoginPage from './login/LoginPage'
import { PrivateRoute } from './PrivateRoute'


function App() {
  return (
    <div>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
        </div>
      </Router>
    </div>
  )
}

export default App
