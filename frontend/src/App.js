import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-google'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MixpanelProvider } from 'react-mixpanel-browser'

import AllRoutes from './app/AllRoutes'
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
        <AllRoutes />
      </Router>
    </MixpanelProvider>
    </div>
  )
}

export default App
