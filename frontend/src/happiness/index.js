import React, { useState } from 'react'
import { animations, easings } from 'react-animation'
import { getDimScreen } from '../DynamicSizing'

import Survey from './Survey'
import Quote from './Quote'
import Api from '../Api'




function HappinessPage (props) {
  const [showQuote, setShowQuote] = useState(false)

  const onSubmit = async (score) => {
    const api = new Api()
    await api.postHappiness(score, null)
    document.location.href = '/'
    //setShowQuote(true)
  }

  return (
    <div>
      {!showQuote && (
        <Survey onSubmit={onSubmit} />
      )}
      {showQuote && (
        <Quote />
      )}
    </div>
  )
}


export default HappinessPage
