import React, { useState } from 'react'

import Survey from './Survey'
import Quote from './Quote'
import Api from '../../app/Api'




function HappinessCreatePage (props) {
  const [score, setScore] = useState(null)
  const [showQuote, setShowQuote] = useState(false)
  const dueDate = new Date().toJSON()
  const api = new Api()


  const onSubmit = async (note) => {
    await api.postHappiness({dueDate, score, note})
    props.onSubmit()
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
