import React, { useState } from 'react'
import { useParams, useHistory } from "react-router-dom"
import TopNavigation from '../../app/Navigation'

import Survey from './Survey'
import Quote from './Quote'
import Api from '../../app/Api'




function HappinessCreatePage (props) {
  const [score, setScore] = useState(null)
  const [showQuote, setShowQuote] = useState(false)
  const history = useHistory()
  const { happinessId, dueDate } = useParams()


  const onSubmit = async (note) => {
    const api = new Api()
    if (happinessId)
      await api.putHappiness(happinessId, {dueDate, score, note})
    else
      await api.postHappiness({dueDate, score, note})
    history.goBack()
  }

  return (
    <div>
      <TopNavigation />
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
