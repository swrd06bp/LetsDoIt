import React from 'react'
import GoalShape from '../GoalShape'
import ListButton from '../ListButton'

import { getDimRatio } from '../../app/DynamicSizing'

function Goal (props) {
  
  return (
    <div 
      style={{
        ...styles().wrapper,
        background: props.goal && props.goal._id === props.item._id ? 'lightgreen' : 'white'
      }}
      onClick={() => props.onDescribe({
        task: null,
        project: null,
        goal: props.goal ? null : props.item,
      })}
    >
      <div style={styles().firstPartContainer}>
        <div style={styles().frontContainer}>
          <GoalShape colorCode={props.item.colorCode} />
        </div>
        {props.item.content}
      </div>
      <div style={styles().backContainer}>
        <ListButton 
          item={props.item}
          type={'goal'}
          scale={0.6}
          onUpdate={() => {}}
        />
        <div style={styles().dueDate}>
          {props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday'}
        </div>
      </div>
    </div>
  )
}


const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, 
  firstPartContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 15 * getDimRatio().X,
  },
  frontContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  backContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  dueDate: {
    fontSize: 8,
    borderRadius: 20,
    background: 'lightgrey'
  }
})

export default Goal
