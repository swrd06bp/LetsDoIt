import React, { useState } from 'react'
import {  easings } from 'react-animation'


function ScoreBox(props) {
  const [hover, setHover] = useState(false)


  return (
    <div 
      style={{
        ...styles().scoreContainer, 
        background: hover ? 'black' : props.background,
        color: hover ? 'white' : 'black',
        fontWeight: hover ? 'bold' : 'normal',
        borderStyle: hover ? 'solid' : null,
        borderColor: hover ? 'white' : null,
      }}
      onClick={props.onSubmit}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
    {props.title}
    </div>

  )
}

function Survey (props) {

  return (
    <div style={styles().wrapper}>
      <div style={styles().title}>
        How do you feel?
      </div>
      <div style={styles().sliderContainer}>
       <ScoreBox onSubmit={() => props.onSubmit(1)} title={'Couldnt be worse'} background={'#cc0000'}/>
       <ScoreBox onSubmit={() => props.onSubmit(2)} title={'Very bad'} background={'#ff0000'}/>
       <ScoreBox onSubmit={() => props.onSubmit(3)} title={'Bad'} background={'#ff3300'}/>
       <ScoreBox onSubmit={() => props.onSubmit(4)} title={'Meh'} background={'#ff9933'}/>
       <ScoreBox onSubmit={() => props.onSubmit(5)} title={'So-so'} background={'#ffff66'}/>
       <ScoreBox onSubmit={() => props.onSubmit(6)} title={'Okay'} background={'#ccff66'}/>
       <ScoreBox onSubmit={() => props.onSubmit(7)} title={'Good'} background={'#66ff33'}/>
       <ScoreBox onSubmit={() => props.onSubmit(8)} title={'Very good'} background={'#33cc33'}/>
       <ScoreBox onSubmit={() => props.onSubmit(9)} title={'Great'} background={'#009933'}/>
       <ScoreBox onSubmit={() => props.onSubmit(10)} title={'Really great'} background={'#006600'}/>
      </div>
    </div>
  )
}


const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: window.innerHeight,
  },
  title: {
    fontSize: 70,
    marginBottom: 50,
    animation: `fade-in ${easings.easeOutQuad} 2000ms forwards`,
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    width: 1000,
    animation: `fade-in ${easings.easeOutQuad} 4000ms forwards`,
  },
  scoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    height: 70,
    width: 100,
    transition: '.5s background',
  }
})

export default Survey

