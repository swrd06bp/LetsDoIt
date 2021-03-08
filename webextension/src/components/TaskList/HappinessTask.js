import React from 'react'
import { useMixpanel } from 'react-mixpanel-browser'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'

function HappinessTask (props) {
  //const mixpanel = useMixpanel()

  return (
    <div
      style={styles().wrapper}
    >
      <div style={styles().frontContainer}>
        <div style={styles().titleContainer}>Track your happiness</div>
      </div>
      <div style={styles().buttonContainer}>
        <div 
          style={styles().buttonText} 
          onClick={() => {
            // if (mixpanel.config.token)
            //   mixpanel.track('Happiness Task - Check yourself')
            props.onHappinessSubmit()

          }}
          onMouseOver={(event) => {
            event.target.style.background = '#33cc33'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#009933'
          }}
        >Check yourself</div>
      </div>
    </div>
  )
  
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginLeft: 5,
    fontSize: 18 * getDimRatioText().X,
  },
  frontContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 15,
  },
  buttonText: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: 5,
    width: 150 * getDimRatio().X,
    background: '#009933',
    color: 'white',
    borderRadius: 20,
    fontSize: 18 * getDimRatioText().X,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    borderRadius: 20,
    transform: 'translate(-50%, -50%)'
  },
})

export default HappinessTask

