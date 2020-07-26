import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import HomePage from './home/HomePage'


function App() {
  return (
    <div>
      <Router>
        <div>
          <Route exact path="/" component={HomePage} />
        </div>
      </Router>
    </div>
  )
}

export default App
