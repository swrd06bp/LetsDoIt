import React from 'react'
import GoalShape from './GoalShape'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'

function Goal (props) {
  
  const scale = props.type === 'day' ? 1 : 0.8

  return (
    <div 
      className='task'
      style={{
        ...styles().wrapper,
        background: props.goal && props.goal._id === props.item._id ? 'lightgreen' : 'white'
      }}
      onClick={() => props.onDescribe({
        task: null,
        project: null,
        goal: props.goal ? null : props.item,
      })}
      onMouseOver={(event) => {
        if ((!props.goal || (props.goal && props.goal._id !== props.item._id)) && event.target.className === 'task')
          event.target.style.background = '#FAFAFA'
      }}
      onMouseLeave={(event) => {
        if ((!props.goal || (props.goal && props.goal._id !== props.item._id)) && event.target.className === 'task')
          event.target.style.background = 'white'
      }}
    >
      <div style={styles(scale).firstPartContainer}>
        <div style={styles(scale).frontContainer}>
          <GoalShape goal={props.item} />
        </div>
        {props.item.content}
      </div>
      <div style={styles(scale).backContainer}>
        <div style={styles(scale).dueDate}>
          {props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday'}
        </div>
      </div>
    </div>
  )
}


const styles = (scale) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  }, 
  firstPartContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18 * scale *  getDimRatioText().X,
  },
  frontContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30 * scale *  getDimRatio().X,
  },
  backContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90 * scale * getDimRatio().X,
  },
  dueDate: {
    fontSize: 14 * scale *  getDimRatioText().X,
    borderRadius: 20,
    background: 'lightgrey'
  }
})

export default Goal
