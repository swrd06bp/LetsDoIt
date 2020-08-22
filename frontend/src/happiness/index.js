import React, { useState } from 'react'

import Survey from './Survey'
import Quote from './Quote'
import Api from '../Api'




function HappinessPage (props) {
  const [score, setScore] = useState(null)
  const [showQuote, setShowQuote] = useState(false)

  const onSubmit = async (note) => {
    const api = new Api()
    await api.postHappiness(score, note)
    window.location.pathname = '/'
  }

  return (
    <div>
      {!showQuote && (
        <Survey onSubmit={(value) => {
          setScore(value)
          setShowQuote(true)
        }} />
      )}
      {showQuote && (
        <Quote onSubmit={onSubmit} />
      )}
    </div>
  )
}


export default HappinessPage
