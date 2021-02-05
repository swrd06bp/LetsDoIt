import React, { useState, useEffect } from 'react'
import GoalShape from './GoalShape'
import HabitsItem from './HabitsItem'
import { useMixpanel } from 'react-mixpanel-browser'

import Api from '../../app/Api'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'




function Goal (props) {
  const scale = props.type === 'day' ? 1 : 0.8

  return (
    <div>
      <div 
        className='task'
        style={{
          ...styles().wrapper,
          background: props.goal && !props.describeElem.habit && props.goal._id === props.item._id ? 'lightgreen' : 'white'
        }}
        onClick={() => props.onDescribe({
          task: null,
          project: null,
          goal: props.goal ? null : props.item,
          habit: null,
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
          <div style={{...styles(scale).dueDate, background: props.item.doneAt ? 'lightgreen' : 'lightgrey'}}>
            {props.item.doneAt ? props.item.doneAt.slice(0, 10) : (props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday')}
          </div>
          {props.item.doneAt && (
            <img src='/check.png' alt='' height='20' width='20' />
          )}
        </div>
      </div>
      {props.type === 'day' && ( 
        <HabitsItem 
          goal={props.item} 
          describeElem={props.describeElem}
          onDescribe={props.onDescribe}
          completed={props.completed}
        />
      )}
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
  },
  habitsWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20 * getDimRatio().Y,
  },
  firstHabitPart: {
    display: 'flex',
    flexDirection: 'column',
    width: 50 * getDimRatio().X,
    justifyContent: 'flex-end',

  },
  secondHabitPart: {
    borderLeftStyle: 'solid',
    borderLeftSize: 10,
    flex: 1,
  },
  habitContainer: {
    background: '#d8d0d2',
    cursor: 'pointer',
    borderRadius: 20,
    marginTop: 2 * getDimRatio().X,
  },
  habitText: {
    marginLeft: 10,
    fontSize: 16 * scale *  getDimRatioText().X,
  },
  toolButton: {
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16 * getDimRatio().X,
    color: 'white',
    borderStyle: 'solid',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Goal
