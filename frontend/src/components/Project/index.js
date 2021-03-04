import React from 'react'
import ProjectShape from '../Project/ProjectShape'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'

function Project (props) {
  
  const scale = props.type === 'day' ? 1 : 0.8

  
  return (
    <div 
      className='task'
      style={{
        ...styles().wrapper,
        background: props.project && props.project._id === props.item._id ? 'lightgreen' : 'white'
      }}
      onClick={() => props.onDescribe({
        task: null,
        goal: null,
        project: props.project ? null : props.item,
        habit: null,
      })}
      onMouseOver={(event) => {
        if ((!props.project || (props.project && props.project._id !== props.item._id)) && event.target.className === 'task')
          event.target.style.background = '#FAFAFA'
      }}
      onMouseLeave={(event) => {
        if ((!props.project || (props.project && props.project._id !== props.item._id)) && event.target.className === 'task')
          event.target.style.background = 'white'
      }}
    >
      <div style={styles(scale).firstPartContainer}>
        <div style={styles(scale).frontContainer}>
          <ProjectShape project={props.item} />
        </div>
        {props.item.content}
      </div>
      <div style={styles(scale).backContainer}>
        <div style={{...styles(scale).dueDate, background: props.item.doneAt ? 'lightgreen' : 'lightgrey'}}>
          {props.item.doneAt ? props.item.doneAt.slice(0, 10) : (props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday')}
        </div>
        {props.item.doneAt && (
          <img src='/check.png' alt='' height='20' width='20' />
        )}
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
    width: 30 * scale *  getDimRatioText().X,
  },
  backContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginRight: 3
  },
  dueDate: {
    fontSize: 14 * scale *  getDimRatioText().X,
    borderRadius: 20,
    padding: 1,
    marginRight: 2,
    background: 'lightgrey'
  }
})

export default Project

