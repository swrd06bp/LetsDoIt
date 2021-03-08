import React, { useState } from 'react'
import { easings } from 'react-animation'

function Quote (props) {
  const [note, setNote] = useState('')
   

  return (
    <div style={styles().wrapper}>
      <div style={styles().title}>Tell us more</div>
      <textarea 
        style={styles().inputArea}
        type='input'
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <div
        onClick={() => props.onSubmit(note)}
        style={styles().doneButton}
      >Done</div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: window.innerHeight,
  },
  title: {
    animation: `fade-in ${easings.easeOutQuad} 2000ms forwards`,
    fontSize: 70
  },
  inputArea: {
    width: 600,
    height: 200,
    animation: `fade-in ${easings.easeOutQuad} 4000ms forwards`,
  },
  doneButton: {
    cursor: 'pointer',
    marginTop: 30,
    textAlign: 'center',
    width: 100,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    background: 'lightblue',
    animation: `fade-in ${easings.easeOutQuad} 4000ms forwards`,
  },
})


export default Quote
