import React, { useState } from 'react'

function Quote (props) {
  const [note, setNote] = useState(null)

  return (
    <div>
      <textarea 
        type='input'
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </div>
  )

}

export default Quote
