import React from 'react'
import ProjectShape from '../Project/ProjectShape'

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'

function Project (props) {
  
  const scale = props.scale ? props.scale : 1
  
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
    fontSize: 18 * scale *  getDimRatio().X,
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
    width: 70 * scale * getDimRatio().X,
  },
  dueDate: {
    fontSize: 15 * scale *  getDimRatio().X,
    borderRadius: 20,
    background: 'lightgrey'
  }
})

export default Project

