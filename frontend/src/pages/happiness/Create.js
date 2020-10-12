import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

import Survey from './Survey'
import Quote from './Quote'
import Api from '../../app/Api'




function HappinessCreatePage (props) {
  const [score, setScore] = useState(null)
  const [showQuote, setShowQuote] = useState(false)
  const history = useHistory()

  const onSubmit = async (note) => {
    const api = new Api()
    await api.postHappiness(score, note)
    history.goBack()
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


export default HappinessCreatePage
